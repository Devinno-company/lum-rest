import InsertNotification from "../interfaces/inputRepository/insertNotification";
import insertMaterial from "../interfaces/inputRepository/insertMaterial";
import UpdateMaterial from "../interfaces/request/UpdateMaterialRequest";
import MaterialResponse from "../interfaces/response/MaterialResponse";
import User from "../models/User";
import AccessRepository from "../repositorys/AccessRepository";
import EventRepository from "../repositorys/EventRepository";
import MaterialRepository from "../repositorys/MaterialRepository";
import LinkNotificationRepository from "../repositorys/LinkNotificationRepository";
import NotificationRepository from "../repositorys/NotificationRepository";
import havePermission from "../utils/havePermission";

class MaterialController {

    async insertMaterial(user: User, idEvent: number, material: insertMaterial): Promise<MaterialResponse> {
        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (JSON.stringify(material) === '{}') {
                reject({ status: 400, message: 'No field to insert' });
            }
            else if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            else {
                await havePermission(user.cd_user, event.cd_event, 'COO')
                        .then(() => {                              
                              MaterialRepository.insertMaterial(material, event.cd_event)
                                  .then(async (material) => {
                                      const insertNotification: InsertNotification = {
                                          notification_title: "Novo material!",
                                          notification_content: `Um novo material foi adicionado ao evento ${material.cd_event}, Material: ${material.nm_material}, Quantidade: ${material.qt_material}`,
                                          notification_read: false
                                      }
                                  
                                      const notificationType = "MTA";
                                      const linkNotification = await LinkNotificationRepository
                                          .insertLinkNotification(material.cd_material, notificationType);
                                      const access = await AccessRepository.findAccessByEventId(event.cd_event);
                                      for (let i = 0; i < access.length; i++) {
                                        NotificationRepository
                                        .insertNotification(insertNotification, access[i].cd_user, linkNotification.cd_link)
                                      };

                                        resolve({
                                            id: material.cd_material,
                                            name: material.nm_material,
                                            quantity: material.qt_material,
                                            acquired: material.qt_acquired,
                                            observation: material.ds_observation,
                                            status: material.sg_status
                                        })
                                  })
                                  .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                        })
                        .catch(() => reject({ status: 401, message: 'You are not allowed do so' }));
            }
        });
    }

    async readMaterial(user: User, idEvent: number, idMaterial: number): Promise<MaterialResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);
            const material = await MaterialRepository.findMaterialById(idMaterial);

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            if (!material)
                reject({ status: 404, message: 'This material does not exist' });
            else {
                await havePermission(user.cd_user, event.cd_event, 'EQP')
                    .then(() => {
                        resolve({
                            id: material.cd_material,
                            name: material.nm_material,
                            quantity: material.qt_material,
                            acquired: material.qt_acquired,
                            observation: material.ds_observation,
                            status: material.sg_status
                        });
                    })
                    .catch(() => reject({ status: 401, message: 'You are not allowed to do so' }));
            }
        });
    }

    async readMaterials(user: User, idEvent: number): Promise<Array<MaterialResponse>> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);
            const materials = await MaterialRepository.findMaterialByEventId(idEvent);
            const materialsResponse: Array<MaterialResponse> = [];

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            if (!materials)
                reject({ status: 404, message: 'There are no materials' });
            else {
                await havePermission(user.cd_user, event.cd_event, 'EQP')
                    .then(() => {
                        for (let i = 0; i < materials.length; i++) {

                            materialsResponse.push({
                                id: materials[i].cd_material,
                                name: materials[i].nm_material,
                                quantity: materials[i].qt_material,
                                acquired: materials[i].qt_acquired,
                                observation: materials[i].ds_observation,
                                status: materials[i].sg_status
                            });
                        }       
                        resolve(materialsResponse);
                    })
                    .catch(() => reject({ status: 401, message: 'You are not allowed to do so' }));
            };
        });
    }

    async updateMaterial(user: User, updateMaterial: UpdateMaterial, idEvent: number, idMaterial: number): Promise<MaterialResponse> {

        return new Promise(async (resolve, reject) => {

            const event = await EventRepository.findEventById(idEvent);
            const material = await MaterialRepository.findMaterialById(idMaterial);
            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            if (!material)
                reject({ status: 404, message: 'This material does not exist' });

            if (JSON.stringify(updateMaterial) === '{}') {
                reject({ status: 400, message: 'No field to update' });
            } else {
                await havePermission(user.cd_user, event.cd_event, 'EQP')
                    .then(() => {
                        MaterialRepository.updateMaterial(idMaterial, updateMaterial)
                            .then(async () => {
                                const NewMaterial = await this.readMaterial(user, event.cd_event, material.cd_material)
                                    if (NewMaterial.acquired > NewMaterial.quantity) {
                                        MaterialRepository.updateStatusMaterial(material.cd_material, "ADQ")
                                        resolve(await this.readMaterial(user, event.cd_event, material.cd_material))
                                    }
                                resolve(NewMaterial)
                            })
                            .catch(err => reject(err));
                    })
                    .catch(() => reject({ status: 401, message: 'You are not allowed to do so' }));
            }
        });
    }

    async updateAcquired(user: User, acquired: number, idEvent: number, idMaterial: number): Promise<MaterialResponse> {

        return new Promise(async (resolve, reject) => {

            const event = await EventRepository.findEventById(idEvent);
            const material = await MaterialRepository.findMaterialById(idMaterial);
            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            if (!material)
                reject({ status: 404, message: 'This material does not exist' });

            if (acquired == null || acquired == undefined) {
                reject({ status: 400, message: 'No field to update' });
            } else{
                await havePermission(user.cd_user, event.cd_event, 'EQP')
                    .then(() => {
                        MaterialRepository.updateAcquired(idMaterial, acquired)
                            .then(async () => {
                                const NewMaterial = await this.readMaterial(user, event.cd_event, material.cd_material)
                                if (NewMaterial.acquired > NewMaterial.quantity) {
                                    MaterialRepository.updateStatusMaterial(material.cd_material, "ADQ")
                                    resolve(await this.readMaterial(user, event.cd_event, material.cd_material))
                                }
                            resolve(NewMaterial)
                                })
                            .catch(err => reject(err));
                        })
                        .catch(() => reject({ status: 401, message: 'You are not allowed to do so' }));
            }
        });
    }

    deleteMaterial(user: User, idEvent: number, idMaterial: number) {
        return new Promise(async (resolve, reject) => {
            const material = await MaterialRepository.findMaterialById(idMaterial);
            const event = await EventRepository.findEventById(idEvent);

            if (!material)
                reject({ status: 404, message: "This material doesn't exist" })
            else {
                if (!await havePermission(user.cd_user, event.cd_event, 'COO'))
                    reject({ status: 401, message: "You are not allowed do so" });
                else {
                        MaterialRepository.deleteMaterialById(idMaterial)
                            .then(() => { resolve() })
                            .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }); })
                }
            }
        });
    }
}

export default MaterialController;