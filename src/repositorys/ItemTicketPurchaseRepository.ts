import db from "../database/connection";
import ItemTicketPurchase from "../models/ItemTicketPurchase";

class ItemTicketPurchaseRepository {

    public static insertItem(InsertItem: ItemTicketPurchase): Promise<ItemTicketPurchase> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedItem =
                await trx('item_ticket_purchase')
                    .insert({
                        cd_ticket: InsertItem.cd_ticket,
                        cd_purchase: InsertItem.cd_purchase,
                        qt_ticket_sell: InsertItem.qt_ticket_sell 
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedItem[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findItemByTicketId(idTicket: number): Promise<Array<ItemTicketPurchase>> {

        return new Promise(async (resolve) => {
            const item =
            await db('item_ticket_purchase as i')
                .select('*')
                .where('i.cd_ticket', '=', idTicket);

            resolve(item);
        });
    }

    public static async findItemByPurchaseId(idPurchase: number): Promise<Array<ItemTicketPurchase>> {

        return new Promise(async (resolve) => {
            const item =
            await db('item_ticket_purchase as i')
                .select('*')
                .where('i.cd_purchase', '=', idPurchase);

            resolve(item);
        });
    }

    public static async findItemByTicketIdAndPurchaseId(idTicket: number, idPurchase: number): Promise<ItemTicketPurchase> {

        return new Promise(async (resolve) => {
            const item =
            await db('item_ticket_purchase as i')
                .select('*')
                .where('i.cd_ticket', '=', idTicket)
                .where('i.cd_purchase', '=', idPurchase);


            resolve(item[0]);
        });
    }

    public static async updateQuantityByTicketIdAndPurchaseId(idTicket: number, idPurchase: number, quantity: number): Promise<ItemTicketPurchase> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();
            
            const item =
            await trx('item_ticket_purchase')
                .update({
                    qt_ticket_sell: quantity
                })
                .where('cd_ticket', '=', idTicket)
                .where('cd_purchase', '=', idPurchase)
                .returning('*');

            trx.commit()
                .then(() => { resolve(item[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async deleteItemByTicketIdAndPurchaseId(idTicket: number, idPurchase: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('item_ticket_purchase')
                .where('cd_ticket', '=', idTicket)
                .where('cd_purchase', '=', idPurchase)
                .delete();

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }
}

export default ItemTicketPurchaseRepository;