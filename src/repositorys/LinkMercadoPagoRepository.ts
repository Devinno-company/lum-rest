import db from "../database/connection"
import updateLinkMercado from "../interfaces/inputRepository/updateLinkMercadoPago";
import LinkMercadoPago from "../models/LinkMercadoPago";

class LinkMercadoPagoRepository {

    public static insertLinkMercadoPago(identificaion_id: string, user_id: number): Promise<LinkMercadoPago> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedLinkMercadoPago =
            await trx('tb_link_mercado_pago')
                .insert({
                    cd_identification: identificaion_id,
                    cd_user: user_id
                })
                .returning('*');

            trx.commit()
                .then(() => resolve(insertedLinkMercadoPago[0]))
                .catch((err) => reject(err));
        })
    }

    public static updateLinkMercadoPago(idLinkMercadoPago: number, updateLinkMercadoPago: updateLinkMercado): Promise<LinkMercadoPago> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedLink =
            await trx('tb_link_mercado_pago')
                .update({
                    cd_identification: updateLinkMercadoPago.identification_code,
                    cd_authorization: updateLinkMercadoPago.authorization_code,
                    id_valid: updateLinkMercadoPago.id_valid,
                    cd_refresh_token: updateLinkMercadoPago.refresh_token,
                    cd_access_token: updateLinkMercadoPago.cd_access_token,
                    cd_public_key: updateLinkMercadoPago.cd_public_key
                })
                .where('cd_link_mercado_pago', '=', idLinkMercadoPago)
                .returning('*');

            trx.commit()
                .then(() => resolve(updatedLink[0]))
                .catch((err) => reject(err));
        })
    }

    public static findLinkMercadoPagoByUserId(idUser: number): Promise<LinkMercadoPago> {

        return new Promise(async (resolve) => {
            const trx = await db.transaction();

            const linkMercado =
            await trx('tb_link_mercado_pago as l')
                .select('*')
                .where('l.cd_user', '=', idUser)
                .returning('*');

            resolve(linkMercado[0]);
        })
    }

    public static findLinkMercadoPagoByIdentificationId(identfiication_code: string): Promise<LinkMercadoPago> {
        
        return new Promise(async (resolve) => {
            const trx = await db.transaction();

            const linkMercado =
            await trx('tb_link_mercado_pago as l')
                .select('*')
                .where('l.cd_identification', '=', identfiication_code)
                .returning('*');

            resolve(linkMercado[0]);
        })
    }
}

export default LinkMercadoPagoRepository;