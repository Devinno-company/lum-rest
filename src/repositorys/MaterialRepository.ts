import db from "../database/connection";
import Material from "../models/Material";

class MaterialRepository {

    public static insertMaterial(material_name: string, material_quantity: number, material_observation: string, event_code: number, status_material: number): Promise<Material> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedMaterial =
                await trx('tb_material')
                    .insert({
                        nm_material: material_name,
                        qt_material: material_quantity,
                        ds_observation: material_observation,
                        cd_event: event_code,
                        sg_status: status_material
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedMaterial[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findMaterialById(idMaterial: number): Promise<Array<Material>> {

        return new Promise(async (resolve) => {
            const material =
            await db('tb_material as m')
                .select('*')
                .where('m.cd_material', '=', idMaterial);

            resolve(material);
        });
    }

    public static async findMaterialByEventId(idEvent: number): Promise<Array<Material>> {

        return new Promise(async (resolve) => {
            const material =
            await db('tb_material as m')
                .select('*')
                .where('m.cd_event', '=', idEvent);

            resolve(material);
        });
    }

    public static async deleteMaterialById(idMaterial: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_material')
                .where('cd_material', '=', idMaterial)
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

export default MaterialRepository;