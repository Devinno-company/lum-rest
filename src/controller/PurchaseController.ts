import insertPurchase from "../interfaces/inputRepository/insertPurchase";
import PurchaseResponse from "../interfaces/response/PurchaseResponse";
import User from "../models/User";
import PurchaseRepository from "../repositorys/PurchaseRepository";
import ItemTicketPurchaseRepository from "../repositorys/ItemTicketPurchaseRepository";
import TicketPurchase from "../interfaces/response/TicketPurchase";
import TicketRepository from "../repositorys/TicketRepository";
import EventRepository from "../repositorys/EventRepository";

class PurchaseController {

    async insertPurchase(user: User, purchase: insertPurchase): Promise<PurchaseResponse> {
        return new Promise(async (resolve, reject) => {

            if (JSON.stringify(purchase) === '{}') {
                reject({ status: 400, message: 'No field to insert' });
            }
            else {                           
                  PurchaseRepository.insertPurchase(purchase, user.cd_user)
                      .then(() => { resolve() })
                      .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
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
                    sg_status: purchase.sg_status,
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
                reject({ status: 404, message: 'There are no purchases' }) }
            else if (user.cd_user != purchases[0].cd_user) {
                reject({ status: 401, message: 'You can only see your own purchases' }) }
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
                        sg_status: purchases[i].sg_status,
                        cd_user: purchases[i].cd_user,
                        tickets
                    });
                    tickets = [];
                }       
                resolve(purchasesResponse);
            };
        });
    }

    async updateStatus(user: User, idPurchase: number, status: 'PEN'|'APR'|'AUT'|'PRO'|'MED'|'REJ'|'CAN'|'REE'|'EST'): Promise<PurchaseResponse> {

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