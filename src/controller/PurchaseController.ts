import PurchaseResponse from "../interfaces/response/PurchaseResponse";
import User from "../models/User";
import Event from "../models/Event";
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
import PurchaseTicketResponse from "../interfaces/response/PurchaseTicketResponse";
import Ticket from "../models/Ticket";
import DisbursementsMercadoPago from "../interfaces/externals/DisbursementsMercadoPago";
import SellerSplit from "../interfaces/request/SellerSplitRequest";
import PaymentData from "../interfaces/externals/PaymentData";
import PaymentBillet from "../interfaces/externals/PaymentBillet";
import PaymentCreditCard from "../interfaces/externals/PaymentCreditCard";
import PayerPayment from "../interfaces/externals/PayerPayment";
import CheckinRepository from "../repositorys/CheckinRepository";
import DownloadRequest from "../interfaces/request/DownloadRequest";

class PurchaseController {

    async insertPurchase(user: User, purchase: NewPurchase): Promise<PurchaseResponse> {
        return new Promise(async (resolve, reject) => {

            if (JSON.stringify(purchase) === '{}') {
                reject({ status: 400, message: 'No field to insert' });
            }
            else {
                let valueAmount: number = 0;
                let transaction_amount: number = 0;

                let payer: PayerPayment;

                const sellerSplits: Array<SellerSplit> = [];
                const ticketsPurchase: Array<Ticket> = [];
                const disbursements: Array<DisbursementsMercadoPago> = [];
                const payments: Array<PaymentBillet | PaymentCreditCard> = [];

                for (let i = 0; i < purchase.tickets.length; i++) {

                    const ticket = await TicketRepository.findTicketById(purchase.tickets[i].id);
                    if (!ticket) {
                        return reject({ status: 400, message: "This ticket id doesn't exist" });
                    } else if (purchase.tickets[i].buyers.length != purchase.tickets[i].quantity) {
                        return reject({ status: 400, message: "Please give the informations for each ticket buyer" });
                    }
                    else {
                        const linkMercadoPago = await LinkMercadoPagoRepository.findLinkMercadoPagoByEventId(ticket.cd_event);
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

                        const event = await EventRepository.findEventById(ticket.cd_event);

                        const event_date = new Date(event.dt_start);
                        const today = new Date('2020-10-20');

                        const timeDiff = Math.abs(event_date.getTime() - today.getTime());
                        const daysDiff = Math.ceil((timeDiff / (3600 * 1000 * 24)));

                        if (today > event_date) {
                            return reject({ status: 400, message: 'it is not possible to buy tickets to an event already held' })
                        }
                        else {
                            if (purchase.billet) {
                                if (daysDiff < 3)
                                    return reject({ status: 400, message: 'To make a ticket purchase you must have at least 3 days difference between today and the start date of the event' })
                            }

                            if (!sellerSplits.some(e => e.code == linkMercadoPago.cd_link_mercado_pago)) {
                                sellerSplits.push({
                                    code: Number(linkMercadoPago.cd_link_mercado_pago),
                                    identification: Number(linkMercadoPago.cd_identification),
                                    split: Number(ticket.vl_ticket * purchase.tickets[i].quantity),
                                    user_id_mercado_pago: linkMercadoPago.cd_user_mercado_pago
                                });
                            }
                            else {
                                const sellerIndex = sellerSplits.findIndex(e => e.code == linkMercadoPago.cd_link_mercado_pago);
                                sellerSplits[sellerIndex].split += Number(ticket.vl_ticket * purchase.tickets[i].quantity);
                            };
                            transaction_amount += ticket.vl_ticket * purchase.tickets[i].quantity;

                            for (let j = 0; j < sellerSplits.length; j++) {
                                if (!disbursements.some(e => e.id == sellerSplits[j].user_id_mercado_pago)) {
                                    disbursements.push({
                                        id: sellerSplits[j].user_id_mercado_pago,
                                        amount: Number(sellerSplits[j].split.toFixed(2)),
                                        external_reference: `${event.cd_event}`,
                                        collector_id: sellerSplits[j].user_id_mercado_pago,
                                        application_fee: Number(((valueAmount) * 0.03).toFixed(2)),
                                        money_release_days: 30
                                    });
                                } else {
                                    const disbursementIndex = disbursements.findIndex(e => e.id == sellerSplits[j].user_id_mercado_pago);
                                    disbursements[disbursementIndex].amount = sellerSplits[j].split;
                                }
                            }

                            ticketsPurchase.push(ticket);
                        }
                    }
                }

                if (purchase.billet != null && purchase.billet != undefined) {
                    payer = {
                        first_name: user.nm_user,
                        last_name: user.nm_surname_user,
                        email: purchase.email,
                        identification: {
                            type: 'CPF',
                            number: purchase.cpf_payer
                        },
                        address: purchase.billet.address,
                        id: user.cd_user
                    }

                    //Sets the expiration date to 3 days before the earliest event.
                    let earliestEvent = new Date(3000, 0, 0);
                    for (let i = 0; i < ticketsPurchase.length; i++) {
                        
                        let event = await EventRepository.findEventById(ticketsPurchase[i].cd_event)
                        let eventDate = new Date(event.dt_start)
                        if (new Date(event.dt_start) < earliestEvent) {
                            earliestEvent = eventDate;
                        };
                    }
                    const expirationDate = new Date(earliestEvent.setDate(earliestEvent.getDate() - 3))

                    const paymentBillet: PaymentBillet = {
                        payment_type_id: 'ticket',
                        payment_method_id: 'bolbradesco',
                        date_of_expiration: expirationDate.toISOString(),
                        transaction_amount,
                        processing_mode: 'aggregator'
                    }

                    payments.push(paymentBillet);
                } else {
                    payer = {
                        first_name: user.nm_user,
                        last_name: user.nm_surname_user,
                        email: purchase.email,
                        identification: {
                            type: 'CPF',
                            number: purchase.cpf_payer
                        },
                        id: user.cd_user
                    }

                    const paymentCreditCard: PaymentCreditCard = {
                        payment_type_id: 'credit_card',
                        payment_method_id: purchase.credit_card.payment_method_id,
                        token: purchase.credit_card.token,
                        transaction_amount: Number(transaction_amount.toFixed(2)),
                        installments: purchase.credit_card.installments,
                        issuer_id: purchase.credit_card.issuer_id,
                        processing_mode: 'agreggator'
                    }

                    payments.push(paymentCreditCard);
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`
                    }
                }

                const payment_data: PaymentData = {
                    payer,
                    payments,
                    application_id: Number(process.env.APP_ID_MP),
                    disbursements,
                    external_reference: 'ref-transaction-1'
                }

                await Axios.post('https://api.mercadopago.com/v1/advanced_payments', payment_data, config)
                    .then((result) => {
                        const paymentResponse = (result.data as any);
                        
                        let billetResponse: {
                            idBillet: number,
                            BilletImage: string,
                            BilletPurchaseDate: string
                        } | null;
                        let creditcardResponse: {
                            idCreditCard: number,
                            CreditCardPaymentMethod: string,
                            CreditCardApprovedDate?: string
                        } | null;

                        let idCreditCard: number | null = null;
                        let idBillet: number | null = null;

                        if (purchase.credit_card) {
                            PurchaseCreditCardRepository.insertPurchaseCreditCard({
                                dt_approved: null,
                                payment_method: paymentResponse.payments[0].payment_method_id
                            })
                            .then((purchaseCreditCard) => {
                                creditcardResponse = {
                                    idCreditCard: purchaseCreditCard.cd_purchase_credit_card,
                                    CreditCardApprovedDate: purchaseCreditCard.dt_approved,
                                    CreditCardPaymentMethod: purchaseCreditCard.cd_payment_method
                                };
                                billetResponse = null;
                                idCreditCard = purchaseCreditCard.cd_purchase_credit_card; idBillet = null;
                            })
                            .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err: err.response.data }) });
                        }
                        else if (purchase.billet) {
                            PurchaseBilletRepository.insertPurchaseBillet({
                                link_billet: paymentResponse.payments[0].transaction_details.external_resource_url,
                                dt_expiration: paymentResponse.payments[0].date_of_expiration
                            })
                            .then((purchaseBillet) => {
                                billetResponse = {
                                    idBillet: purchaseBillet.cd_purchase_billet,
                                    BilletImage: purchaseBillet.im_billet,
                                    BilletPurchaseDate: purchaseBillet.dt_purchase
                                };
                                creditcardResponse = null;
                                idCreditCard = null; idBillet = purchaseBillet.cd_purchase_billet;
                            })
                            .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err: err.response.data }) });
                        }
                            PurchaseRepository.insertPurchase(paymentResponse.id, paymentResponse.status, user.cd_user, idBillet, idCreditCard)
                            .then(async (result) => {
                                const ticketsResponse: Array<PurchaseTicketResponse> = [];

                                    const items = await ItemTicketPurchaseRepository.findItemByPurchaseId(result.cd_purchase)
                                    for (let i = 0; i <  purchase.tickets.length; i++) {
                                        ItemTicketPurchaseRepository.insertItem({
                                            cd_ticket: purchase.tickets[i].id,
                                            cd_purchase: result.cd_purchase,
                                            qt_ticket_sell: purchase.tickets[i].quantity
                                        })
                                        for (let j = 0; j < purchase.tickets[i].quantity; j++) {
                                            
                                        const ticket = await TicketRepository.findTicketById(purchase.tickets[i].id);
                                        const event = await EventRepository.findEventById(ticket.cd_event);
                                        let newQrcode: string;
                                            
                                        var today = new Date();
                                        var event_date = new Date(event.dt_end);
                                    
                                        var timeDiff = Math.abs(event_date.getTime() - today.getTime());
                                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                        
                                        const newToken = jwt.sign({
                                            event_id: event.cd_event,
                                            ticket_id: ticket.cd_ticket
                                        }, process.env.SECRET_TICKET as string, { expiresIn: `${diffDays}d` });
                                    
                                        const link = `http://localhost:3000/events/${event.cd_event}/checkin?token=${newToken}&ticket_id=${ticket.cd_ticket}`;
                                        
                                        
                                        var idValid: boolean;
                                        var QRCode: string;
                                        
                                            CheckinRepository.insertCheckin({
                                                qr_code: link,
                                                token_qr: newToken,
                                                buyer_name: purchase.tickets[i].buyers[j].name,
                                                buyer_cpf: purchase.tickets[i].buyers[j].cpf,
                                                buyer_phone: purchase.tickets[i].buyers[j].phone,
                                            }, result.cd_purchase, purchase.tickets[i].id)
                                            .then((result) => {                                                   
                                                
                                                ticketsResponse.push({
                                                    idTicket: purchase.tickets[i].id,
                                                    TicketName: ticket.nm_ticket,
                                                    TicketEvent: event.nm_event,
                                                    TicketValue: ticket.vl_ticket,
                                                    idValid: result.id_valid,
                                                    QRCode: result.cd_qr_code,
                                                    payer: {
                                                        name: result.nm_buyer,
                                                        cpf: result.cd_cpf_buyer,
                                                        phone: result.cd_phone_buyer
                                                    }
                                                });
                                            })
                                        }
                                    }
                                    
                                    
                                    resolve({
                                        id: result.cd_purchase,
                                        idMercadoPago: result.cd_purchase_mercado_pago,
                                        PurchaseStatus: result.cd_status,
                                        PurchaseDate: result.dt_purchase,
                                        tickets: ticketsResponse,
                                        billet: billetResponse,
                                        credit_card: creditcardResponse
                                    })
                                })
                                .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                            
                    })
                    .catch((err: any) => {
                        console.log(err.response.data);
                        reject({ status: 400, message: 'Unknown error. Try again later.', err })
                    });
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
                    const checkins = await CheckinRepository.findCheckinsByPurchaseIdAndTicketId(purchase.cd_purchase, ticket.cd_ticket);
                    for (let j = 0; j < checkins.length; j++) {
                        ticketResponse.push({
                            idTicket: ticket.cd_ticket,
                            TicketName: ticket.nm_ticket,
                            TicketEvent: event.nm_event,
                            TicketValue: ticket.vl_ticket,
                            idValid: checkins[j].id_valid,
                            QRCode: checkins[j].cd_qr_code,
                            payer: {
                                name: checkins[j].nm_buyer,
                                cpf: checkins[j].cd_cpf_buyer,
                                phone: checkins[j].cd_phone_buyer
                            }
                        });
                    }
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
                        const checkins = await CheckinRepository.findCheckinsByPurchaseIdAndTicketId(items[i].cd_purchase, ticket.cd_ticket);
                        for (let j = 0; j < checkins.length; j++) {
                            ticketResponse.push({
                                idTicket: ticket.cd_ticket,
                                TicketName: ticket.nm_ticket,
                                TicketEvent: event.nm_event,
                                TicketValue: ticket.vl_ticket,
                                idValid: checkins[j].id_valid,
                                QRCode: checkins[j].cd_qr_code,
                                payer: {
                                    name: checkins[j].nm_buyer,
                                    cpf: checkins[j].cd_cpf_buyer,
                                    phone: checkins[j].cd_phone_buyer
                                }
                            });
                        }
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
                const checkins = await CheckinRepository.findCheckinsByPurchaseId(purchase.cd_purchase);
                let checkinResponse: Array<{
                    ticket: Ticket,
                    event: Event,
                    qrcode: string
                }> = [];
                let downloadRequest: DownloadRequest;

                for (let i = 0; i < checkins.length; i++) {
                    const ticket = await TicketRepository.findTicketById(checkins[i].cd_ticket);
                    const event = await EventRepository.findEventById(ticket.cd_event);

                    const newQrcode = (await qrcode.toDataURL(checkins[i].cd_qr_code, { errorCorrectionLevel: 'L' }));

                    checkinResponse.push({
                        ticket: ticket,
                        event: event,
                        qrcode: newQrcode
                    })
                    
                }
                    downloadRequest = {
                        user: user,
                        login: login,
                        purchase: purchase,
                        checkins: checkinResponse
                    };
                    
                    const html = getTicketHtml(downloadRequest);
                

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
        });
    }
}


export default PurchaseController;