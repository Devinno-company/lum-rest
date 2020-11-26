import PurchaseResponse from "../interfaces/response/PurchaseResponse";
import User from "../models/User";
import PurchaseRepository from "../repositorys/PurchaseRepository";
import TicketRepository from "../repositorys/TicketRepository";
import EventRepository from "../repositorys/EventRepository";
import LoginRepository from "../repositorys/LoginRepository";
import NewPurchase from "../interfaces/request/NewPurchase";
import PurchaseBilletRepository from "../repositorys/PurchaseBilletRepository";
import PurchaseCreditCardRepository from "../repositorys/PurchaseCreditCardRepository";
import LinkMercadoPagoRepository from "../repositorys/LinkMercadoPagoRepository";
import Axios from "axios";
import updateLinkMercadoPago from "../interfaces/inputRepository/updateLinkMercadoPago";
import qrcode from 'qrcode';
import getTicketHtml from "../utils/getTicketHtml";
import jwt from 'jsonwebtoken';
import pdf from 'html-pdf';
import ItemTicketPurchaseRepository from "../repositorys/ItemTicketPurchaseRepository";
import { array, link } from "joi";
import TicketResponse from "../interfaces/response/TicketResponse";
import PurchaseTicketResponse from "../interfaces/response/PurchaseTicketResponse";
import ticketRoutes from "../routes/TicketRoutes";
import Ticket from "../models/Ticket";
import DisbursementsMercadoPago from "../interfaces/externals/DisbursementsMercadoPago";
import SellerSplit from "../interfaces/request/SellerSplitRequest";
import PaymentData from "../interfaces/externals/PaymentData";

const mercadopago = require('mercadopago');


class PurchaseController {

    async insertPurchase(user: User, purchase: NewPurchase): Promise<PurchaseResponse> {
        return new Promise(async (resolve, reject) => {

            if (JSON.stringify(purchase) === '{}') {
                reject({ status: 400, message: 'No field to insert' });
            }
            else {
                let valueAmount: number = 0;
                let transaction_amount: number = 0;

                let sellerSplits: Array<SellerSplit> = [];
                let ticketsPurchase: Array<Ticket> = [];
                let disbursements: Array<DisbursementsMercadoPago> = [];

                for (let i = 0; i < purchase.tickets.length; i++) {

                    if (!TicketRepository.findTicketById(purchase.tickets[i].id)) {
                        reject({ status: 400, message: "This ticket id doesn't exist" });
                    }
                    const ticket = await TicketRepository.findTicketById(purchase.tickets[i].id);
                    const linkMercadoPago = await LinkMercadoPagoRepository.findLinkMercadoPagoByEventId(ticket.cd_event);
                    const event = await EventRepository.findEventById(ticket.cd_event);

                    const event_date = new Date(event.dt_start);
                    const today = new Date();

                    const timeDiff = Math.abs(event_date.getTime() - today.getTime());
                    const daysDiff = Math.ceil((timeDiff / (3600 * 1000 * 24)));

                    if (purchase.payments.payment_type_id == 'credit_card') {
                        if (today > event_date)
                            reject({ status: 400, message: 'it is not possible to buy tickets to an event already held' })
                    }
                    else if (purchase.payments.payment_type_id == 'ticket')
                        if (daysDiff < 3) {
                            reject({ status: 400, message: 'To make a ticket purchase you must have at least 3 days difference between today and the start date of the event' })
                        }
                        else {
                            // Checks whether you need to refresh the token
                            if (!linkMercadoPago.id_valid) {
                                const data = {
                                    client_secret: process.env.ACCESS_TOKEN_MP,
                                    grant_type: 'refresh_token',
                                    refresh_token: linkMercadoPago.cd_refresh_token
                                };

                                await Axios.post('https://api.mercadopago.com/oauth/token', data)
                                    .then((response) => {
                                        const updateLink: updateLinkMercadoPago = {
                                            refresh_token: response.data.refresh_token,
                                            cd_public_key: response.data.public_key,
                                            authorization_code: response.data.authorization_code,
                                            id_valid: true,
                                            cd_access_token: response.data.access_token,
                                        }
                                        LinkMercadoPagoRepository.updateLinkMercadoPago(linkMercadoPago.cd_link_mercado_pago, updateLink)
                                            .then()
                                            .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));
                                    })
                                    .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err: err.response.data }));
                            }
        
                            mercadopago.configurations.setAccessToken(linkMercadoPago.cd_access_token);

                            ticketsPurchase.push(ticket);

                            if (!sellerSplits.some(e => e.code == linkMercadoPago.cd_link_mercado_pago)) {
                                
                                sellerSplits.push({
                                    code: Number(linkMercadoPago.cd_link_mercado_pago),
                                    identification: Number(linkMercadoPago.cd_identification),
                                    split: Number(ticket.vl_ticket * purchase.tickets[i].quantity)
                                });
                            }
                            else {
                                const sellerIndex = sellerSplits.findIndex(e => e.code == linkMercadoPago.cd_link_mercado_pago);
                                sellerSplits[sellerIndex].split += Number(ticket.vl_ticket * purchase.tickets[i].quantity);
                            };
                            transaction_amount += Number(ticket.vl_ticket * purchase.tickets[i].quantity)

                        }
                }

                for (let i = 0; i < sellerSplits.length; i++) {
                    
                    disbursements.push({
                        amount: Number(sellerSplits[i].split),
                        external_reference: `${sellerSplits[i].identification}`,
                        collector_id: 671993915,
                        application_fee: Number(((valueAmount) * 0.03).toFixed(2)),
                        money_release_days: 30
                    });
                }

                if (purchase.payments.payment_type_id == 'credit_card') {
                    if (!purchase.payments.installments) { reject({ status: 400, message: 'Please Specify the installment number' }) }
                    else if (!purchase.payments.issuer_id) { reject({ status: 400, message: 'Please Specify the issuer' }) }
                    else {
                        const payment_data: PaymentData = {
                            payer: {
                                email: purchase.email,
                                identification: {
                                    type: 'CPF',
                                    number: purchase.cpf_payer
                                }
                            },
                            payment: {
                                payment_method_id: purchase.payments.payment_method_id,
                                payment_type_id: purchase.payments.payment_type_id,
                                token: purchase.payments.token,
                                transaction_amount: transaction_amount,
                                processing_mode: 'aggregator',
                                installments: purchase.payments.installments,
                                issuer_id: purchase.payments.issuer_id,
                                description: purchase.payments.description
                            },
                            dispursements: disbursements
                        };
                        let config = {
                            headers: {
                                Authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`
                            }
                        }
                        await Axios.post('https://api.mercadopago.com/v1/advanced_payments', payment_data, config)
                            .then((result) => {
                                const paymentResponse = (result.data as any);
                                PurchaseCreditCardRepository.insertPurchaseCreditCard({
                                    dt_approved: null,
                                    payment_method: paymentResponse.payments[0].payment_method_id
                                })
                                    .then((purchaseCreditCard) => {
                                        PurchaseRepository.insertPurchase(paymentResponse.id, paymentResponse.status, user.cd_user, undefined, purchaseCreditCard.cd_purchase_credit_card)
                                            .then(async (result) => {
                                                const ticketsResponse: Array<PurchaseTicketResponse> = [];
                                                for (let i = 0; i < purchase.tickets.length; i++) {
                                                    const ticket = await TicketRepository.findTicketById(purchase.tickets[i].id);
                                                    const event = await EventRepository.findEventById(ticket.cd_event);
                                                    ticketsResponse.push({
                                                        idTicket: purchase.tickets[i].id,
                                                        TicketName: ticket.nm_ticket,
                                                        TicketEvent: event.nm_event,
                                                        TicketQuantity: purchase.tickets[i].quantity,
                                                        TicketValue: ticket.vl_ticket
                                                    });
                                                }
                                                resolve({
                                                    id: result.cd_purchase,
                                                    idMercadoPago: result.cd_purchase_mercado_pago,
                                                    PurchaseStatus: result.cd_status,
                                                    PurchaseDate: result.dt_purchase,
                                                    tickets: ticketsResponse,
                                                    billet: null,
                                                    credit_card: {
                                                        idCreditCard: purchaseCreditCard.cd_purchase_credit_card,
                                                        CreditCardApprovedDate: purchaseCreditCard.dt_approved,
                                                        CreditCardPaymentMethod: purchaseCreditCard.cd_payment_method
                                                    },
                                                })
                                            })
                                            .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                                    })
                                    .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err: err.response.data }) });
                            })
                            .catch((err: any) => {
                                console.log(err.response.data);
                                reject({ status: 400, message: 'Unknown error. Try again later.', err })
                            });
                    }
                } else {
                    if (!purchase.address)
                        reject({ status: 400, message: 'You need to send a location.' });
                    else {
                        const payment_data = {
                            payer: {
                                first_name: user.nm_user,
                                last_name: user.nm_surname_user,
                                email: purchase.email,
                                identification: {
                                    type: 'CPF',
                                    number: purchase.cpf_payer
                                },
                                address: {
                                    zip_code: purchase.address.zip_code,
                                    street_name: purchase.address.street_name,
                                    street_number: purchase.address.street_number
                                }
                            },
                            payments: [
                                {
                                    payment_method_id: purchase.payments.payment_method_id,
                                    payment_type_id: purchase.payments.payment_type_id,
                                    token: purchase.payments.token,
                                    transaction_amount: transaction_amount,
                                    date_of_expiration:  new Date('2020-12-10') ,
                                    processing_mode: 'aggregator',
                                    description: purchase.payments.description
                                }
                            ],
                            application_id: process.env.APP_ID,
                            disbursements: disbursements
                        };
                        let config = {
                            headers: {
                                Authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`
                            }
                        }
                        await Axios.post('https://api.mercadopago.com/v1/advanced_payments', payment_data, config)
                            .then((result) => {
                                const paymentResponse = (result.data as any);

                                PurchaseBilletRepository.insertPurchaseBillet({
                                    link_billet: paymentResponse.payments[0].transaction_details.external_resource_url,
                                    dt_expiration: paymentResponse.payments[0].date_of_expiration
                                })
                                    .then((purchaseBillet) => {
                                        PurchaseRepository.insertPurchase(paymentResponse.id, paymentResponse.status, user.cd_user, purchaseBillet.cd_purchase_billet, undefined)
                                            .then(async (result) => {
                                                const ticketsResponse: Array<PurchaseTicketResponse> = [];
                                                for (let i = 0; i < purchase.tickets.length; i++) {
                                                    const ticket = await TicketRepository.findTicketById(purchase.tickets[i].id);
                                                    const event = await EventRepository.findEventById(ticket.cd_event);
                                                    ticketsResponse.push({
                                                        idTicket: purchase.tickets[i].id,
                                                        TicketName: ticket.nm_ticket,
                                                        TicketEvent: event.nm_event,
                                                        TicketQuantity: purchase.tickets[i].quantity,
                                                        TicketValue: ticket.vl_ticket
                                                    });
                                                }
                                                resolve({
                                                    id: result.cd_purchase,
                                                    idMercadoPago: result.cd_purchase_mercado_pago,
                                                    PurchaseStatus: result.cd_status,
                                                    PurchaseDate: result.dt_purchase,
                                                    tickets: ticketsResponse,
                                                    billet: {
                                                        idBillet: purchaseBillet.cd_purchase_billet,
                                                        BilletImage: purchaseBillet.im_billet,
                                                        BilletPurchaseDate: purchaseBillet.dt_purchase
                                                    },
                                                    credit_card: null
                                                })
                                            })
                                            .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                                    })
                                    .catch((err) => {
                                        reject({ status: 400, message: 'Unknown error. Try again later.', err: err.response.data });
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
                const items = await ItemTicketPurchaseRepository.findItemByPurchaseId(purchase.cd_purchase);
                let ticketResponse: Array<PurchaseTicketResponse> = [];
                for (let i = 0; i < items.length; i++) {
                    const ticket = await TicketRepository.findTicketById(items[i].cd_ticket);
                    const event = await EventRepository.findEventById(ticket.cd_event);
                    ticketResponse.push({
                        idTicket: ticket.cd_ticket,
                        TicketName: ticket.nm_ticket,
                        TicketEvent: event.nm_event,
                        TicketQuantity: items[i].qt_ticket_sell,
                        TicketValue: ticket.vl_ticket
                    });
                }

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
                    tickets: ticketResponse,
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

                    const items = await ItemTicketPurchaseRepository.findItemByPurchaseId(purchases[i].cd_purchase);
                    let ticketResponse: Array<PurchaseTicketResponse> = [];
                    for (let i = 0; i < items.length; i++) {
                        const ticket = await TicketRepository.findTicketById(items[i].cd_ticket);
                        const event = await EventRepository.findEventById(ticket.cd_event);
                        ticketResponse.push({
                            idTicket: ticket.cd_ticket,
                            TicketName: ticket.nm_ticket,
                            TicketEvent: event.nm_event,
                            TicketQuantity: items[i].qt_ticket_sell,
                            TicketValue: ticket.vl_ticket
                        });
                    }

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
                        tickets: ticketResponse,
                        billet: billet,
                        credit_card: credit_card
                    });
                }
                resolve(purchasesResponse);
            };
        });
    }

    async updateStatus(idPurchase: number, status: 'pending' | 'approved' | 'authorized' | 'in_process' | '_in_mediation' | 'reject' | 'cancelled' | 'refund' | 'charged_back'): Promise<PurchaseResponse> {

        return new Promise(async (resolve, reject) => {

            const purchase = await PurchaseRepository.findPurchaseById(idPurchase);
            if (!purchase)
                reject({ status: 404, message: 'This purchase does not exist' });

            PurchaseRepository.updatePurchaseStatus(idPurchase, status)
                .then(() => { resolve() })
                .catch(err => reject(err));
        });
    }

    async downloadPurchase(user: User, idPurchase: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const purchase = await PurchaseRepository.findPurchaseById(idPurchase);

            if (!purchase)
                reject({ status: 404, message: "This purchase doesn't exist" })
            else if (purchase.cd_user != user.cd_user)
                reject({ status: 401, message: "You are not allowed to do so" });
            else if (purchase.cd_status != 'approved')
                reject({ status: 401, message: 'This purchase has not yet been approved' });
            else {
                const login = await LoginRepository.findLoginById(user.cd_login);
                const items = await ItemTicketPurchaseRepository.findItemByPurchaseId(purchase.cd_purchase);
                const qrcodes: Array<string> = [];

                for (let i = 0; i < items.length; i++) {
                    const ticket = await TicketRepository.findTicketById(items[i].cd_ticket);
                    const event = await EventRepository.findEventById(ticket.cd_event);

                    for (let i = 0; i < items[i].qt_ticket_sell; i++) {
                        var today = new Date();
                        var event_date = new Date(event.dt_end);

                        var timeDiff = Math.abs(event_date.getTime() - today.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                        const token = jwt.sign({
                            event_id: event.cd_event,
                            ticket_id: ticket.cd_ticket
                        }, process.env.SECRET_TICKET as string, { expiresIn: `${diffDays}d` });

                        const link = `http://localhost:3000/events/${event.cd_event}/checkin?token=${token}&ticket_id=${ticket.cd_ticket}`;

                        qrcodes.push(await qrcode.toDataURL(link, { errorCorrectionLevel: 'L' }));
                    }
                    const html = getTicketHtml(user, login, ticket, purchase, event, qrcodes);


                    pdf.create(html, {
                        type: 'pdf',
                        format: 'A4',
                        orientation: 'portrait',
                    }).toFile((err, file) => {
                        if (!err) {
                            resolve(file);
                        }
                        else
                            reject({ status: 400, message: 'Unknown error. Try again later', err })
                    });
                }
            }
        });
    }
}


export default PurchaseController;