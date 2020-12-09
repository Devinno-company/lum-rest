import NewTicketRequest from "../interfaces/request/NewTicketRequest";
import UpdateTicketRequest from "../interfaces/request/UpdateTicketRequest";
import TicketResponse from "../interfaces/response/TicketResponse";
import User from "../models/User";
import EventRepository from "../repositorys/EventRepository";
import PurchaseRepository from "../repositorys/PurchaseRepository";
import TicketRepository from "../repositorys/TicketRepository";
import havePermission from "../utils/havePermission";

class TicketController {

    insertTicket(user: User, event_id: number, newTicket: NewTicketRequest): Promise<TicketResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(event_id);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                const isAllowed = await havePermission(user.cd_user, event_id, "CRI")
                    .catch(() => reject({ status: 401, message: "You are not allowed to do so" }));

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" })
                else {
                    TicketRepository.insertTicket(newTicket, event_id)
                        .then(result => {
                            resolve({
                                id: result.cd_ticket,
                                name: result.nm_ticket,
                                description: result.ds_ticket,
                                price: result.vl_ticket,
                                quantity_total: result.qt_ticket,
                                quantity_available: result.qt_ticket_available
                            });
                        })
                        .catch((err) => { reject({ status: 400, message: "Unknown error. Try again later.", err }) });
                }
            }
        });
    }

    readTickets(user: User, event_id: number) {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(event_id);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                let isAllowed = true;

                if (event.sg_privacy == "PRI") {
                    await havePermission(user.cd_user, event_id, "EQP")
                        .catch(() => isAllowed = false);

                    if (!isAllowed)
                        isAllowed = false;
                }
                if (isAllowed) {
                    const tickets = await TicketRepository.findTicketsByEventId(event_id);
                    const ticketResponse: Array<TicketResponse> = [];

                    tickets.map(ticket => {
                        ticketResponse.push({
                            id: ticket.cd_ticket,
                            name: ticket.nm_ticket,
                            description: ticket.ds_ticket,
                            price: ticket.vl_ticket,
                            quantity_total: ticket.qt_ticket,
                            quantity_available: ticket.qt_ticket_available
                        });
                    });

                    resolve(ticketResponse);
                }
                else
                    reject({ status: 401, message: 'This event is private' });
            }
        });
    }

    readTicket(user: User, event_id: number, idTicket: number) {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(event_id);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                let isAllowed = true;

                if (event.sg_privacy == "PRI") {
                    await havePermission(user.cd_user, event_id, "EQP")
                        .catch(() => isAllowed = false);

                    if (!isAllowed)
                        isAllowed = false;
                }
                if (isAllowed) {
                    const ticket = await TicketRepository.findTicketById(idTicket);

                    if (!ticket)
                        reject({ status: 404, message: "This ticket doesn't exists" });
                    else {
                        if (ticket.cd_event != event.cd_event)
                            reject({ status: 400, message: "This ticket does not belong to this event" });
                        else {
                            resolve({
                                id: ticket.cd_ticket,
                                name: ticket.nm_ticket,
                                description: ticket.ds_ticket,
                                price: ticket.vl_ticket,
                                quantity_available: ticket.qt_ticket_available
                            });
                        }
                    }
                }
                else
                    reject({ status: 401, message: 'This event is private' });
            }
        });
    }

    updateTicket(user: User, event_id: number, idTicket: number, updateTicket: UpdateTicketRequest): Promise<TicketResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(event_id);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                const isAllowed = await havePermission(user.cd_user, event_id, "CRI")
                    .catch(() => reject({ status: 401, message: "You are not allowed to do so" }));

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" })
                else {
                    const ticket = await TicketRepository.findTicketById(idTicket);

                    if (ticket.cd_event != event.cd_event)
                        reject({ status: 400, message: "This ticket does not belong to this event" });
                    else {
                        if (updateTicket.quantity_to && updateTicket.quantity_available_to && updateTicket.quantity_available_to > updateTicket.quantity_to)
                            reject({ status: 400, message: 'New quantity available is invalid' });
                        else if (!updateTicket.quantity_to && updateTicket.quantity_available_to && updateTicket.quantity_available_to > ticket.qt_ticket)
                            reject({ status: 400, message: 'New quantity available is invalid' });
                        else {
                            TicketRepository.updateTicketById(ticket.cd_ticket, updateTicket)
                                .then(result => {
                                    resolve({
                                        id: result.cd_ticket,
                                        name: result.nm_ticket,
                                        description: result.ds_ticket,
                                        price: result.vl_ticket,
                                        quantity_total: result.qt_ticket,
                                        quantity_available: result.qt_ticket_available
                                    })
                                })
                                .catch((err) => { reject({ status: 400, message: "Unknown erro. Try again later.", err }) });
                        }
                    }
                }
            }
        });
    }

    deleteTicket(user: User, event_id: number, idTicket: number): Promise<TicketResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(event_id);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                const isAllowed = await havePermission(user.cd_user, event_id, "CRI")
                    .catch(() => reject({ status: 401, message: "You are not allowed to do so" }));

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" })
                else {
                    const ticket = await TicketRepository.findTicketById(idTicket);

                    if (ticket.cd_event != event.cd_event)
                        reject({ status: 400, message: "This ticket does not belong to this event" });
                    else {
                        if ((await PurchaseRepository.findPurchasesByTicketId(ticket.cd_ticket)).length > 0) {
                            reject({ status: 403, message: "You can't delete a ticket that already has purchases" });
                        }
                        else {
                            TicketRepository.deleteTicketById(ticket.cd_ticket)
                                .then(() => {
                                    resolve();
                                })
                                .catch((err) => { reject({ status: 400, message: "Unknown erro. Try again later.", err }) });
                        }
                    }
                }
            }
        });
    }
}

export default TicketController;