import db from "../database/connection";
import insertPurchaseBillet from "../interfaces/inputRepository/insertPurchaseBillet";
import PurchaseBillet from "../models/PurchaseBillet";

class PurchaseBilletRepository {

    public static insertPurchaseBillet(insertPurchaseBillet: insertPurchaseBillet): Promise<PurchaseBillet> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedPurchaseBillet = await trx('tb_purchase_billet')
                .insert({
                    im_billet: insertPurchaseBillet.link_billet,
                    dt_expiration: insertPurchaseBillet.dt_expiration
                })
                .returning('*');

            await trx.commit()
                .then(() => { resolve(insertedPurchaseBillet[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static findPurchaseBilletById(idPurchaseBillet: number): Promise<PurchaseBillet> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const purchaseBillets = await trx('tb_purchase_billet as pb')
                .select('*')
                .where('pb.cd_purchase_billet', '=', idPurchaseBillet);

            await trx.commit()
                .then(() => { resolve(purchaseBillets[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }
}

export default PurchaseBilletRepository;