import db from "../database/connection";
import Purchase from "../models/Purchase";
import InsertPurchase from "../interfaces/inputRepository/insertPurchase";

class PurchaseRepository {

    public static insertPurchase(InsertPurchase: InsertPurchase, user_code: number): Promise<Purchase> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedPurchase =
                await trx('tb_purchase')
                    .insert({
                        sg_status: InsertPurchase.sg_status,
                        cd_user: user_code
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