import db from "../database/connection";
import insertPurchaseCreditCard from "../interfaces/inputRepository/insertPurchaseCreditCard";
import PurchaseCreditCard from "../models/PurchaseCreditCard";

class PurchaseCreditCardRepository {

    public static insertPurchaseCreditCard(insertPurchaseCreditCard: insertPurchaseCreditCard): Promise<PurchaseCreditCard> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedPurchaseCreditCard = await trx('tb_purchase_credit_card')
                .insert({
                    cd_payment_method: insertPurchaseCreditCard.payment_method,
                    dt_approved: insertPurchaseCreditCard.dt_approved
                })
                .returning('*');

            await trx.commit()
                .then(() => { resolve(insertedPurchaseCreditCard[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updateApprovedPurchaseCreditCard(idPurchaseCreditCard: number, dtApproved: string): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_purchase_credit_card')
                .update({
                    dt_approved: dtApproved
                })
                .where('cd_purchase_credit_card', '=', idPurchaseCreditCard);

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static findPurchaseCreditCardById(idPurchaseCreditCard: number): Promise<PurchaseCreditCard> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const purchaseCreditCards = await trx('tb_purchase_credit_card as pc')
                .select('*')
                .where('pc.cd_purchase_credit_card', '=', idPurchaseCreditCard);

            await trx.commit()
                .then(() => { resolve(purchaseCreditCards[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static deletePurchaseCreditCard(idPurchaseCreditCard: number): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_purchase_credit_card')
                .where('cd_purchase_credit_card', '=', idPurchaseCreditCard)
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

export default PurchaseCreditCardRepository;