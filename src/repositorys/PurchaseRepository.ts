import db from "../database/connection";
import Purchase from "../models/Purchase";
import InsertPurchase from "../interfaces/inputRepository/insertPurchase";

class PurchaseRepository {

    public static insertPurchase(insertPurchase: InsertPurchase, status_id: string, user_id: number, purchase_billet_id?: number, purchase_credit_card_id?: number): Promise<Purchase> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedPurchase =
                await trx('tb_purchase')
                    .insert({
                        cd_ticket: insertPurchase.ticket_id,
                        qt_ticket: insertPurchase.quantity_ticket,
                        cd_purchase_mercado_pago: insertPurchase.cd_purchase_mercado_pago,
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

    public static async findPurchasesByUserId(idUser: number): Promise<Array<Purchase>> {

        return new Promise(async (resolve) => {
            const purchase =
            await db('tb_purchase as p')
                .select('*')
                .where('p.cd_user', '=', idUser);

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