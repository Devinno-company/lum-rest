import PurchaseResponse from "../interfaces/response/PurchaseResponse";
import User from "../models/User";
import PurchaseRepository from "../repositorys/PurchaseRepository";
import TicketRepository from "../repositorys/TicketRepository";
import EventRepository from "../repositorys/EventRepository";
import LoginRepository from "../repositorys/LoginRepository";
import NewPurchase from "../interfaces/request/NewPurchase";
import PaymentDataCreditCard from "../interfaces/externals/PaymentDataCreditCard";
import PaymentDataTicket from "../interfaces/externals/PaymentDataTicket";
import PurchaseBilletRepository from "../repositorys/PurchaseBilletRepository";
import PurchaseCreditCardRepository from "../repositorys/PurchaseCreditCardRepository";
import insertPurchase from "../interfaces/inputRepository/insertPurchase";
import LinkMercadoPagoRepository from "../repositorys/LinkMercadoPagoRepository";
import { link } from "joi";
const mercadopago = require('mercadopago');

class PurchaseController {

    async insertPurchase(user: User, purchase: NewPurchase): Promise<PurchaseResponse> {
        return new Promise(async (resolve, reject) => {

            if (JSON.stringify(purchase) === '{}') {
                reject({ status: 400, message: 'No field to insert' });
            }
            else {
                const ticket = await TicketRepository.findTicketById(purchase.ticket_id);
                if (!ticket) {
                    reject({ status: 400, message: "This ticket id doesn't exist" });
                }
                const login = await LoginRepository.findLoginById(user.cd_login);
                const linkMercadoPago = await LinkMercadoPagoRepository.findLinkMercadoPagoByEventId(ticket.cd_event);
                
                mercadopago.configure.setAccessToken(linkMercadoPago.cd_access_token);
                
                if (purchase.type_payment == 'credit-card') {
                    if (!purchase.credit_card)
                        reject({ status: 400, message: 'Unsubmitted transaction information' })
                    else {
                        const payment_data: any = {
                            transaction_amount: (ticket.vl_ticket * purchase.quantity_ticket),
                            token: purchase.credit_card?.token,
                            description: ticket.nm_ticket,
                            installments: purchase.credit_card.installments,
                            payment_method_id: purchase.credit_card.payment_method_id,
                            issuer_id: purchase.credit_card.issuer,
                            application_fee: ((ticket.vl_ticket * purchase.quantity_ticket) * 0.035),
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
                    if (!purchase.billet)
                        reject({ status: 400, message: 'You need to send a location.' });
                    else {
                        const address = {
                            zip_code: purchase.billet.zip_code,
                            street_name: purchase.billet.street_name,
                            street_number: purchase.billet.street_number,
                            neighborhood: purchase.billet.neighborhood,
                            city: purchase.billet.city,
                            federal_unit: purchase.billet.federal_unit
                        }

                        const payment_data: PaymentDataTicket = {
                            transaction_amount: (ticket.vl_ticket * purchase.quantity_ticket),
                            description: ticket.nm_ticket,
                            payment_method_id: 'bolbradesco',
                            application_fee: Number(((ticket.vl_ticket * purchase.quantity_ticket) * 0.035).toFixed(2)),
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
                const ticket = await TicketRepository.findTicketById(purchase.cd_ticket);
                const event = await EventRepository.findEventById(ticket.cd_event);

                let billet
                let credit_card;

                const billetCode = purchase.cd_purchase_billet;
                if (billetCode) {
                    const searchBillet = await PurchaseBilletRepository.findPurchaseBilletById(billetCode)

                    billet = {
                        idBillet: searchBillet.cd_purchase_billet,
                        BilletImage: searchBillet.im_billet,
                        BilletPurchaseDate: searchBillet.dt_purchase
                    }
                }
                else {
                    billet = null;
                };

                const creditCode = purchase.cd_purchase_credit_card;
                if (creditCode) {
                    const searchCreditCard = await PurchaseCreditCardRepository.findPurchaseCreditCardById(creditCode)

                    credit_card = {
                        idCreditCard: searchCreditCard.cd_purchase_credit_card,
                        CreditCardPaymentMethod: searchCreditCard.cd_payment_method,
                        CreditCardApprovedDate: searchCreditCard.dt_approved
                    }
                }
                else {
                    credit_card = null;
                };

                resolve({
                    id: purchase.cd_purchase,
                    idMercadoPago: purchase.cd_purchase_mercado_pago,
                    PurchaseDate: purchase.dt_purchase,
                    PurchaseStatus: purchase.cd_status,
                    ticket: {
                        idTicket: ticket.cd_ticket,
                        TicketName: ticket.nm_ticket,
                        TicketEvent: event.nm_event,
                        TicketQuantity: purchase.qt_ticket,
                        TicketValue: ticket.vl_ticket
                    },
                    billet: billet,
                    credit_card: credit_card
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

                for (let i = 0; i < purchases.length; i++) {

                    const ticket = await TicketRepository.findTicketById(purchases[i].cd_ticket);
                    const event = await EventRepository.findEventById(ticket.cd_event);

                    let billet
                    let credit_card;

                    const billetCode = purchases[i].cd_purchase_billet;
                    if (billetCode) {
                        const searchBillet = await PurchaseBilletRepository.findPurchaseBilletById(billetCode)

                        billet = {
                            idBillet: searchBillet.cd_purchase_billet,
                            BilletImage: searchBillet.im_billet,
                            BilletPurchaseDate: searchBillet.dt_purchase
                        }
                    }
                    else {
                        billet = null;
                    };

                    const creditCode = purchases[i].cd_purchase_credit_card;
                    if (creditCode) {
                        const searchCreditCard = await PurchaseCreditCardRepository.findPurchaseCreditCardById(creditCode)

                        credit_card = {
                            idCreditCard: searchCreditCard.cd_purchase_credit_card,
                            CreditCardPaymentMethod: searchCreditCard.cd_payment_method,
                            CreditCardApprovedDate: searchCreditCard.dt_approved
                        }
                    }
                    else {
                        credit_card = null;
                    };

                    purchasesResponse.push({
                        id: purchases[i].cd_purchase,
                        idMercadoPago: purchases[i].cd_purchase_mercado_pago,
                        PurchaseDate: purchases[i].dt_purchase,
                        PurchaseStatus: purchases[i].cd_status,
                        ticket: {
                            idTicket: ticket.cd_ticket,
                            TicketName: ticket.nm_ticket,
                            TicketEvent: event.nm_event,
                            TicketQuantity: purchases[i].qt_ticket,
                            TicketValue: ticket.vl_ticket
                        },
                        billet: billet,
                        credit_card: credit_card
                    });
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