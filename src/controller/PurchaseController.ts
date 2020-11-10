import PurchaseResponse from "../interfaces/response/PurchaseResponse";
import User from "../models/User";
import PurchaseRepository from "../repositorys/PurchaseRepository";
import ItemTicketPurchaseRepository from "../repositorys/ItemTicketPurchaseRepository";
import TicketPurchase from "../interfaces/response/TicketPurchase";
import TicketRepository from "../repositorys/TicketRepository";
import EventRepository from "../repositorys/EventRepository";
import LoginRepository from "../repositorys/LoginRepository";
import NewPurchase from "../interfaces/request/NewPurchase";
import PaymentDataCreditCard from "../interfaces/externals/PaymentDataCreditCard";
import PaymentDataTicket from "../interfaces/externals/PaymentDataTicket";
import PurchaseBilletRepository from "../repositorys/PurchaseBilletRepository";
import PurchaseCreditCardRepository from "../repositorys/PurchaseCreditCardRepository";
import insertPurchase from "../interfaces/inputRepository/insertPurchase";
const mercadopago = require('mercadopago');

class PurchaseController {

    async insertPurchase(user: User, purchase: NewPurchase): Promise<PurchaseResponse> {
        return new Promise(async (resolve, reject) => {

            if (JSON.stringify(purchase) === '{}') {
                reject({ status: 400, message: 'No field to insert' });
            }
            else {
                const ticket = await TicketRepository.findTicketById(purchase.ticket_id);
                const login = await LoginRepository.findLoginById(user.cd_login);

                if (purchase.type_payment == 'credit-card') {
                    if (!purchase.credit_card)
                        reject({ status: 400, message: 'Unsubmitted transaction information' })
                    else {
                        const payment_data: PaymentDataCreditCard = {
                            transaction_amount: (ticket.vl_ticket * purchase.quantity_ticket),
                            token: purchase.credit_card?.token,
                            description: ticket.nm_ticket,
                            installments: purchase.credit_card.installments,
                            payment_method_id: purchase.credit_card.payment_method_id,
                            issuer_id: purchase.credit_card.issuer,
                            payer: {
                                email: login.nm_email,
                                identification: {
                                    type: 'CPF',
                                    number: purchase.cpf_payer
                                }
                            }
                        };

                        mercadopago.payment.save(payment_data)
                            .then((result: Response) => {
                                const payment = (result.body as any);
                                PurchaseCreditCardRepository.insertPurchaseCreditCard({
                                    dt_approved: payment.date_approved,
                                    payment_method: payment.payment_method_id
                                })
                                    .then((purchaseCreditCard) => {
                                        const newPurchase: insertPurchase = {
                                            ticket_id: ticket.cd_ticket,
                                            cd_purchase_mercado_pago: payment.id,
                                            quantity_ticket: purchase.quantity_ticket,
                                        }

                                        PurchaseRepository.insertPurchase(newPurchase, payment.status_payment, user.cd_user, undefined, purchaseCreditCard.cd_purchase_credit_card)
                                            .then(() => { resolve() })
                                            .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                                    })
                                    .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                            })
                            .catch((err: any) => {
                                console.log(err);
                                reject({ status: 400, message: 'Unknown error. Try again later.', err })
                            });
                    }
                } else {
                    if (!purchase.ticket)
                        reject({ status: 400, message: 'You need to send a location.' });
                    else {
                        const address = {
                            zip_code: purchase.ticket.zip_code,
                            street_name: purchase.ticket.street_name,
                            street_number: purchase.ticket.street_number,
                            neighborhood: purchase.ticket.neighborhood,
                            city: purchase.ticket.city,
                            federal_unit: purchase.ticket.federal_unit
                        }

                        const payment_data: PaymentDataTicket = {
                            transaction_amount: (ticket.vl_ticket * purchase.quantity_ticket),
                            description: ticket.nm_ticket,
                            payment_method_id: 'bolbradesco',
                            payer: {
                                email: login.nm_email,
                                first_name: user.nm_user,
                                last_name: user.nm_surname_user,
                                identification: {
                                    type: 'CPF',
                                    number: purchase.cpf_payer
                                },
                                address
                            }
                        };

                        mercadopago.payment.create(payment_data)
                            .then((response: Response) => {
                                const payment = response.body as any;

                                PurchaseBilletRepository.insertPurchaseBillet({
                                    link_billet: payment.transaction_details.external_resource_url,
                                    dt_expiration: payment.date_of_expiration
                                })
                                    .then((purchaseBillet) => {
                                        const newPurchase: insertPurchase = {
                                            ticket_id: ticket.cd_ticket,
                                            cd_purchase_mercado_pago: payment.id,
                                            quantity_ticket: purchase.quantity_ticket,
                                        }
                                        PurchaseRepository.insertPurchase(newPurchase, payment.status_payment, user.cd_user, purchaseBillet.cd_purchase_billet)
                                            .then(() => { resolve() })
                                            .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                                    })
                                    .catch((err) => {
                                        reject({ status: 400, message: 'Unknown error. Try again later.', err });
                                    })

                            })
                            .catch((err: any) => {
                                console.log(err);
                                reject({ status: 400, message: 'Unknown error. Try again later.', err });
                            });

                    }
                }
            }
        });
    }

    async readPurchase(user: User, idPurchase: number): Promise<PurchaseResponse> {

        return new Promise(async (resolve, reject) => {
            const purchase = await PurchaseRepository.findPurchaseById(idPurchase);
            if (!purchase)
                reject({ status: 404, message: 'This purchase does not exist' });
            else if (user.cd_user != purchase.cd_user)
                reject({ status: 401, message: 'You can only see your own purchases' });
            else {
                const itens = await ItemTicketPurchaseRepository.findItemByPurchaseId(idPurchase);

                const tickets: Array<TicketPurchase> = [];
                for (let i = 0; i < itens.length; i++) {
                    const ticket = await TicketRepository.findTicketById(itens[i].cd_ticket);
                    const event = await EventRepository.findEventById(ticket.cd_event);

                    tickets.push({
                        idTicket: ticket.cd_ticket,
                        TicketName: ticket.nm_ticket,
                        TicketEvent: event.nm_event,
                        TicketQuantity: itens[i].qt_ticket_sell,
                        TicketValue: ticket.vl_ticket
                    });
                }

                resolve({
                    cd_purchase: purchase.cd_purchase,
                    sg_status: purchase.cd_status,
                    cd_user: purchase.cd_user,
                    tickets
                });
            }
        });
    }

    async readPurchases(user: User): Promise<Array<PurchaseResponse>> {

        return new Promise(async (resolve, reject) => {
            const purchases = await PurchaseRepository.findPurchasesByUserId(user.cd_user);
            const purchasesResponse: Array<PurchaseResponse> = [];
            if (purchases.length == 0) {
                reject({ status: 404, message: 'There are no purchases' })
            }
            else if (user.cd_user != purchases[0].cd_user) {
                reject({ status: 401, message: 'You can only see your own purchases' })
            }
            else {
                var tickets: Array<TicketPurchase> = [];

                for (let i = 0; i < purchases.length; i++) {

                    const itens = await ItemTicketPurchaseRepository.findItemByPurchaseId(purchases[i].cd_purchase);
                    for (let i2 = 0; i2 < itens.length; i2++) {
                        const ticket = await TicketRepository.findTicketById(itens[i2].cd_ticket);
                        const event = await EventRepository.findEventById(ticket.cd_event);

                        tickets.push({
                            idTicket: ticket.cd_ticket,
                            TicketName: ticket.nm_ticket,
                            TicketEvent: event.nm_event,
                            TicketQuantity: itens[i2].qt_ticket_sell,
                            TicketValue: ticket.vl_ticket
                        });
                    }

                    purchasesResponse.push({
                        cd_purchase: purchases[i].cd_purchase,
                        sg_status: purchases[i].cd_status,
                        cd_user: purchases[i].cd_user,
                        tickets
                    });
                    tickets = [];
                }
                resolve(purchasesResponse);
            };
        });
    }

    async updateStatus(user: User, idPurchase: number, status: 'pending' | 'approved' | 'authorized' | 'in_process' | '_in_mediation' | 'reject' | 'cancelled' | 'refund' | 'charged_back'): Promise<PurchaseResponse> {

        return new Promise(async (resolve, reject) => {

            const purchase = await PurchaseRepository.findPurchaseById(idPurchase);
            if (!purchase)
                reject({ status: 404, message: 'This purchase does not exist' });

            PurchaseRepository.updatePurchaseStatus(idPurchase, status)
                .then(() => { resolve() })
                .catch(err => reject(err));
        });
    }

    async deletePurchase(user: User, idPurchase: number) {
        return new Promise(async (resolve, reject) => {
            const purchase = await PurchaseRepository.findPurchaseById(idPurchase);

            if (!purchase)
                reject({ status: 404, message: "This purchase doesn't exist" })
            else {
                PurchaseRepository.deletePurchaseById(idPurchase)
                    .then(() => { resolve() })
                    .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }); })
            }
        });
    }
}

export default PurchaseController;