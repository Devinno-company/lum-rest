import db from "../database/connection";
import InsertCheckin from "../interfaces/inputRepository/insertCheckin";
import UpdateCheckin from "../interfaces/request/UpdateCheckinRequest";
import UpdateEvent from "../interfaces/request/UpdateEventRequest";
import Checkin from "../models/Checkin";
import Event from '../models/Event';

class CheckinRepository {

    public static async insertCheckin(newCheckin: InsertCheckin, purchase_id: number, ticket_id: number, id_valid: boolean): Promise<Checkin> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedCheckin =
                await trx('tb_checkin')
                    .insert({
                        id_valid: id_valid,
                        cd_qr_code: newCheckin.qr_code,
                        cd_token_qr: newCheckin.token_qr,
                        nm_buyer: newCheckin.buyer_name,
                        cd_cpf_buyer: newCheckin.buyer_cpf,
                        cd_phone_buyer: newCheckin.buyer_phone,
                        cd_purchase: purchase_id,
                        cd_ticket: ticket_id
                    })
                    .returning('*');

            await trx.commit()
                .then(() => { resolve(insertedCheckin[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updateCheckin(idCheckin: number, updateCheckin: UpdateCheckin): Promise<Checkin> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedCheckins = await trx('tb_checkin')
                .update({
                    cd_qr_code: updateCheckin.qr_code_to,
                    cd_token_qr: updateCheckin.token_qr_to,
                    nm_buyer: updateCheckin.buyer_name_to,
                    cd_cpf_buyer: updateCheckin.buyer_cpf_to,
                    cd_phone_buyer: updateCheckin.buyer_phone_to
                })
                .where('cd_checkin', '=', idCheckin)
                .returning('*');

            const checkin = updatedCheckins[0];

            trx.commit()
                .then(() => { resolve(checkin); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updateValid(idCheckin: number, valid_id: boolean): Promise<Checkin> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedCheckins = await trx('tb_checkin')
                .update({
                    id_valid: valid_id
                })
                .where('cd_checkin', '=', idCheckin)
                .returning('*');

            const checkin = updatedCheckins[0];

            trx.commit()
                .then(() => { resolve(checkin); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findCheckinById(idCheckin: number): Promise<Checkin> {

        return new Promise(async (resolve) => {
            const checkin =
                await db('tb_checkin as c')
                    .select('*')
                    .where('c.cd_checkin', '=', idCheckin);

            resolve(checkin[0]);
        });
    }

    public static async findCheckinsByPurchaseId(idPurchase: number): Promise<Array<Checkin>> {

        return new Promise(async (resolve) => {
            const checkins =
                await db('tb_checkin as c')
                    .select('*')
                    .where('c.cd_purchase', '=', idPurchase);

            resolve(checkins);
        });
    }

    public static async findCheckinsByTicketId(idTicket: number): Promise<Array<Checkin>> {

        return new Promise(async (resolve) => {
            const checkins =
                await db('tb_checkin as c')
                    .select('*')
                    .where('c.cd_ticket', '=', idTicket);

            resolve(checkins);
        });
    }

    public static async findCheckinsByPurchaseIdAndTicketId(idPurchase: number, idTicket: number): Promise<Array<Checkin>> {

        return new Promise(async (resolve) => {
            const checkins =
                await db('tb_checkin as c')
                    .select('*')
                    .where('c.cd_purchase', '=', idPurchase)
                    .andWhere('c.cd_ticket', '=', idTicket);

            resolve(checkins);
        });
    }

    public static async findCheckinByToken(Token: string): Promise<Checkin> {

        return new Promise(async (resolve) => {
            const checkins =
                await db('tb_checkin as c')
                    .select('*')
                    .where('c.cd_token_qr', '=', Token);

            resolve(checkins[0]);
        });
    }

    public static async deleteCheckinById(idCheckin: number): Promise<any> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_checkin')
                .where('cd_checkin', '=', idCheckin)
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

export default CheckinRepository;