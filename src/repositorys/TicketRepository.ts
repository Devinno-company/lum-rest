import db from "../database/connection";
import NewTicketRequest from "../interfaces/request/NewTicketRequest";
import UpdateTicketRequest from "../interfaces/request/UpdateTicketRequest";
import Ticket from "../models/Ticket";

class TicketRepository {

    public static insertTicket(newTicket: NewTicketRequest, event_id: number): Promise<Ticket> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedTicket =
                await trx('tb_ticket')
                    .insert({
                        nm_ticket: newTicket.name,
                        ds_ticket: newTicket.description,
                        vl_ticket: newTicket.price,
                        qt_ticket: newTicket.quantity,
                        qt_ticket_available: newTicket.quantity,
                        cd_event: event_id
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedTicket[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static findTicketsByEventId(event_id: number): Promise<Array<Ticket>> {
        return new Promise(async (resolve) => {

            const tickets =
                await db('tb_ticket as t')
                    .select('*')
                    .where('t.cd_event', '=', event_id);

            resolve(tickets)
        });
    }

    public static findTicketById(event_id: number): Promise<Ticket> {
        return new Promise(async (resolve) => {

            const tickets =
                await db('tb_ticket as t')
                    .select('*')
                    .where('t.cd_ticket', '=', event_id);

            resolve(tickets[0])
        });
    }

    public static updateTicketById(idTicket: number, updateTicket: UpdateTicketRequest): Promise<Ticket> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedTicket =
                await trx('tb_ticket')
                    .update({
                        nm_ticket: updateTicket.name_to,
                        ds_ticket: updateTicket.description_to,
                        vl_ticket: updateTicket.price_to,
                        qt_ticket: updateTicket.quantity_to,
                        qt_ticket_available: updateTicket.quantity_available_to,
                    })
                    .where('cd_ticket', '=', idTicket)
                    .returning('*');

            await trx.commit()
                .then(() => { resolve(updatedTicket[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static deleteTicketById(idTicket: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_ticket')
                .delete()
                .where('cd_ticket', '=', idTicket)
                .returning('*');

            await trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }
}

export default TicketRepository;