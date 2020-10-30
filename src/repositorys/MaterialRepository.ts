import db from "../database/connection";
import Material from "../models/Material";
import InsertMaterial from "../interfaces/inputRepository/insertMaterial";
import UpdateMaterial from "../interfaces/request/UpdateMaterialRequest";

class MaterialRepository {

    public static insertMaterial(InsertMaterial: InsertMaterial, event_code: number): Promise<Material> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedMaterial =
                await trx('tb_material')
                    .insert({
                        nm_material: InsertMaterial.nm_material,
                        qt_material: InsertMaterial.qt_material,
                        qt_acquired: 0,
                        ds_observation: InsertMaterial.ds_observation,
                        cd_event: event_code,
                        sg_status: "PEN"
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedMaterial[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updateStatusMaterial(idMaterial: number, status: "ADQ"|"PEN"): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_material')
                .update({
                    sg_status: status
                })
                .where('cd_material', '=', idMaterial);

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updateMaterial(idMaterial: number, UpdateMaterial: UpdateMaterial): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedMaterial =
            await trx('tb_material')
                .update({
                    nm_material: UpdateMaterial.name_to,
                    qt_material: UpdateMaterial.quantity_to,
                    ds_observation: UpdateMaterial.description_to
                })
                .where('cd_material', '=', idMaterial);

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback(updatedMaterial);
                    reject(err);
                });
        });
    }

    public static updateAcquired(idMaterial: number, qt_acquired: number): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedAcquired =
            await trx('tb_material')
                .update({
                    qt_acquired: qt_acquired
                })
                .where('cd_material', '=', idMaterial);

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback(updatedAcquired);
                    reject(err);
                });
        });
    }

    public static async findMaterialById(idMaterial: number): Promise<Material> {

        return new Promise(async (resolve) => {
            const material =
            await db('tb_material as m')
                .select('*')
                .where('m.cd_material', '=', idMaterial);

            resolve(material[0]);
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