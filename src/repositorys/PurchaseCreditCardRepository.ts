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
}

export default PurchaseCreditCardRepository;