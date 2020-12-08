import db from "../database/connection";
import Purchase from "../models/Purchase";

class PurchaseRepository {

    public static insertPurchase(cd_purchase_mercado_pago: number | null, status_id: string, user_id: number, purchase_billet_id?: number | null, purchase_credit_card_id?: number | null): Promise<Purchase> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedPurchase =
                await trx('tb_purchase')
                    .insert({
                        cd_purchase_mercado_pago: cd_purchase_mercado_pago,
                        cd_status: status_id,
                        cd_user: user_id,
                        cd_purchase_billet: purchase_billet_id,
                        cd_purchase_credit_card: purchase_credit_card_id
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedPurchase[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updatePurchaseStatus(idPurchase: number, status: string): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_purchase')
                .update({
                    sg_status: status
                })
                .where('cd_purchase', '=', idPurchase);

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findPurchaseById(idPurchase: number): Promise<Purchase> {

        return new Promise(async (resolve) => {
            const purchase =
            await db('tb_purchase as p')
                .select('*')
                .where('p.cd_purchase', '=', idPurchase);

            resolve(purchase[0]);
        });
    }

    public static async findPurchaseByMercadoPagoId(idPurchaseMercadoPago: number): Promise<Purchase> {

        return new Promise(async (resolve) => {
            const purchase =
            await db('tb_purchase as p')
                .select('*')
                .where('p.cd_purchase_mercado_pago', '=', idPurchaseMercadoPago);

            resolve(purchase[0]);
        });
    }

    public static async findPurchasesByUserId(idUser: number): Promise<Array<Purchase>> {

        return new Promise(async (resolve) => {
            const purchase =
            await db('tb_purchase as p')
                .select('*')
                .where('p.cd_user', '=', idUser);

            resolve(purchase);
        });
    }

    public static async findPurchasesByTicketId(idTicket: number): Promise<Array<Purchase>> {

        return new Promise(async (resolve) => {
            const purchase =
            await db('tb_purchase as p')
                .select('*')
                .join('item_ticket_purchase as i', 'i.cd_purchase', 'p.cd_purchase')
                .where('i.cd_ticket', '=', idTicket)

            resolve(purchase);
        });
    }

    public static async findApprovedPurchasesByTicketId(idTicket: number): Promise<Array<Purchase>> {

        return new Promise(async (resolve) => {
            const purchase =
            await db('tb_purchase as p')
                .select('*')
                .join('item_ticket_purchase as i', 'i.cd_purchase', 'p.cd_purchase')
                .where('i.cd_ticket', '=', idTicket)
                .andWhere('p.cd_status', '=', 'approved')

            resolve(purchase);
        });
    }

    public static async findPendentPurchasesByTicketId(idTicket: number): Promise<Array<Purchase>> {

        return new Promise(async (resolve) => {
            const purchase =
            await db('tb_purchase as p')
                .select('*')
                .join('item_ticket_purchase as i', 'i.cd_purchase', 'p.cd_purchase')
                .where('i.cd_ticket', '=', idTicket)
                .andWhere('p.cd_status', '=', 'pending')

            resolve(purchase);
        });
    }

    public static async deletePurchaseById(idPurchase: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_purchase')
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

export default PurchaseRepository;