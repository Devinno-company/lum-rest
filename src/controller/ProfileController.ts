import { PutObjectRequest } from 'aws-sdk/clients/s3';
import bcrypt from 'bcrypt';
import s3 from '../aws/S3';
import Credentials from '../interfaces/request/CredentialsRequest';
import updatePassword from '../interfaces/request/UpdatePasswordRequest';
import UpdateUser from '../interfaces/request/UpdateUserRequest';
import UserResponse from '../interfaces/response/UserResponse';
import User from "../models/User";
import AccessRepository from '../repositorys/AccessRepository';
import CityRepository from '../repositorys/CityRepository';
import GeolocationRepository from '../repositorys/GeolocationRepository';
import InviteRepository from '../repositorys/InviteRepository';
import LocationUserRepository from '../repositorys/LocationUserRepository';
import LoginRepository from '../repositorys/LoginRepository';
import MessageRepository from '../repositorys/MessageRepository';
import NotificationRepository from '../repositorys/NotificationRepository';
import PurchaseRepository from '../repositorys/PurchaseRepository';
import RoomRepository from '../repositorys/RoomRepository';
import TaskRepository from '../repositorys/TaskRepository';
import UserRepository from '../repositorys/UserRepository';
import genNameFile from '../utils/genNameFile';

class ProfileController {

    async updateUser(user: User, updateUser: UpdateUser): Promise<UserResponse> {

        return new Promise(async (resolve, reject) => {

            if (JSON.stringify(updateUser) === '{}') {
                reject({ status: 400, message: 'No field to update' });
            } else {
                let location: any = undefined;
                /* If don't need to make updates to the location */
                if ((!updateUser.location_to) && user.cd_location_user) {
                    location = await LocationUserRepository.findLocationUserById(user.cd_location_user);

                    /* If just need to update localization */
                } else if (updateUser.location_to && user.cd_location_user) {

                    const locationUser = await LocationUserRepository.findLocationUserById(user.cd_location_user);
                    const searchCity = await CityRepository.findCityByNameAndUf(updateUser.location_to.city, updateUser.location_to.uf)

                    if (!searchCity)
                        reject({ status: 400, message: "This city don't exists" });
                    else {
                        await GeolocationRepository.updateGeolocation(locationUser.cd_geolocation, updateUser.location_to.geolocation)
                            .catch(err => { reject({ status: 400, message: "Unknown error. Try again later.", error: err }) });

                        location = await LocationUserRepository.updateCityUser(user.cd_location_user, searchCity.cd_city);
                    }
                    /* If need to insert a new localization */
                } else if (updateUser.location_to && !user.cd_location_user) {

                    if (!updateUser.location_to.city || !updateUser.location_to.geolocation || !updateUser.location_to.uf)
                        reject({ message: "City, uf and geolocation it's required", status: 400 });
                    else {
                        const insertedGeolocation =
                            await GeolocationRepository.insertGeolocation(updateUser.location_to.geolocation)
                                .catch(err => reject({ status: 400, message: 'Unknown error. Try again later', error: err }));

                        const searchCity = await CityRepository.findCityByNameAndUf(updateUser.location_to.city, updateUser.location_to.uf)

                        if (!searchCity)
                            reject({ status: 400, message: 'This city not exists' });
                        else if (insertedGeolocation) {
                            await LocationUserRepository.insertLocationUser(searchCity.cd_city, insertedGeolocation.cd_geolocation)
                                .then((locationUser) => {
                                    UserRepository.updateLocationUser(user.cd_user, locationUser.cd_location_user);
                                })
                                .catch((err) => {
                                    GeolocationRepository.deleteGeolocation(insertedGeolocation.cd_geolocation);
                                    reject({ status: 400, message: 'Unknown error. Try again later', error: err });
                                });
                        }
                    }
                }

                if (location) {
                    const searchCity = await CityRepository.findCityById(location.cd_city);
                    const searchGeolocation = await GeolocationRepository.findGeolocationById(location.cd_geolocation);

                    location = {
                        city: searchCity.nm_city,
                        uf: searchCity.sg_uf,
                        geolocation: {
                            latitude: searchGeolocation.cd_latitude,
                            longitude: searchGeolocation.cd_longitude
                        }
                    }
                }

                UserRepository.updateUser(user.cd_user, updateUser)
                    .then(async (user) =>
                        resolve(await this.readProfile(user)))
                    .catch(err => reject(err));
            }
        });
    }

    async deleteUser(user: User, credentials: Credentials) {

        return new Promise(async (resolve, reject) => {

            const login = await LoginRepository.findLoginById(user.cd_login);
            let valid = false;

            if (!login)
                reject({ message: 'Incorrect credentials', status: 409 });
            else {
                valid = bcrypt.compareSync(credentials.password, login.nm_password);

                if (!valid)
                    reject({ message: 'Incorrect credentials', status: 409 });
                else {
                    if (user.cd_login != login.cd_login)
                        reject({ message: 'Is necessary be logged with user for delete your account' })
                    else {
                        if ((await PurchaseRepository.findPurchasesByUserId(user.cd_user)).length > 0) {
                            reject({ status: 403, message: "You can't delete a user that already has purchases."});
                        }
                        else {
                            /* Deleta todos convites (invites) relacionados ao usuário */
                            const invites = await InviteRepository.findInvitesByUserId(user.cd_user);
                            if (invites) {
                                invites.map(async item => {
                                    await InviteRepository.deleteInviteById(item.cd_invite)
                                });
                            }
                            /* Deleta todas salas de conversa (rooms) relacionadas ao usuário */
                            const rooms = await RoomRepository.findRoomsByUserId(user.cd_user);
                            if (rooms) {
                                rooms.map(async item => {
                                    const messages = await MessageRepository.findMessagesByRoomId(item.cd_room);
                                    if (messages) {
                                        messages.map(async item => {
                                            await MessageRepository.deleteMessageById(item.cd_message)
                                        });
                                }
                                    await RoomRepository.deleteRoomById(item.cd_room)
                                });
                            }
                            /* Deleta todas notificações (notifications) relacionadas ao usuário */
                            const notifications = await NotificationRepository.findNotificationByUserId(user.cd_user);
                            if (notifications) {
                                notifications.map(async item => {
                                    await NotificationRepository.deleteNotificationById(item.cd_notification)
                                });
                            }
                            /* Deleta todos acessos (accesses) relacionados ao usuário */
                            const accesses = await AccessRepository.findAccessByUserId(user.cd_user);
                            if (accesses) {
                                accesses.map(async item => {
                                    const tasks = await TaskRepository.findTaskByAccessId(item.cd_access)
                                    if (tasks.length > 0) {
                                        tasks.map(async item => {
                                            await TaskRepository.removeUserFromTask(item.cd_task)
                                        })
                                    }
                                    await AccessRepository.deleteAccessById(item.cd_access)
                                });
                            }

                            UserRepository.deleteUserById(user.cd_user)
                                .then(async () => {
                                    if (user.cd_location_user) {
                                        const locationUser = await LocationUserRepository.findLocationUserById(user.cd_location_user);
                                        LocationUserRepository.deleteLocationUserById(user.cd_location_user);
                                        GeolocationRepository.deleteGeolocation(locationUser.cd_geolocation);
                                    }
                                    await LoginRepository.deleteLoginById(user.cd_login);
                                    resolve();
                                })
                                .catch((err) => {
                                    reject({ status: 400, message: 'Unknown error. Try again later.', error: err });
                                });
                        }
                    }
                }
            }
        });
    }

    async updatePassword(user: User, updatePassword: updatePassword) {

        return new Promise(async (resolve, reject) => {

            const login = await LoginRepository.findLoginById(user.cd_login);

            let valid = false;

            if (!login)
                reject({ message: 'Invalid token. Renew it.', status: 401 });
            else {
                valid = bcrypt.compareSync(updatePassword.password, login.nm_password);

                if (!valid)
                    reject({ message: 'Invalid password', status: 401 });
                else {
                    const hash = bcrypt.hashSync(updatePassword.newPassword, bcrypt.genSaltSync());

                    LoginRepository.updatePassword(user.cd_login, hash)
                        .then(() => { resolve() })
                        .catch(err => reject(err));
                }
            }
        });
    }

    async updateImage(user: User, image: Express.Multer.File): Promise<UserResponse> {

        return new Promise((resolve, reject) => {
            let type = '';
            // Verifica se o formato está certo
            if (image.mimetype == 'image/png')
                type = '.png';
            else
                type = '.jpg';

            // Gera o nome do arquivo e o link que o arquivo será disponibilizado
            const fileName: string = genNameFile('profile', user.cd_user, type);
            const link = `https://${process.env.BUCKET_NAME}.s3-${process.env.BUCKET_REGION}.amazonaws.com/image/profile/${fileName}`;

            // Configura a request de upload
            const putObjectRequest: PutObjectRequest =
            {
                Bucket: process.env.BUCKET_NAME as string + '/image/profile',
                Key: fileName,
                Body: image.buffer,
                ContentLength: image.size,
                ACL: 'public-read',
                ContentType: (type == 'image/jpeg') ? 'image/jpeg' : 'image/png'
            };

            // Faz o upload o arquivo
            s3.upload(putObjectRequest, async (err: Error) => {
                if (err) {
                    reject({ message: 'Unknown error. Try again later.', error: err });
                } else {
                    // Persiste o link no banco e retorna o link para o usuário
                    UserRepository.addImageById(user.cd_user, link)
                        .then(async (user) => {
                            resolve(await this.readProfile(user));
                        })
                        .catch(e => {
                            reject({ message: 'Unknown error. Try again later.', error: e })
                        });
                }
            });
        });
    }

    async readProfile(user: User): Promise<UserResponse> {

        return new Promise(async (resolve) => {
            const login = await LoginRepository.findLoginById(user.cd_login);
            let location;

            if (user.cd_location_user)
                location = await LocationUserRepository.findLocationUserById(user.cd_location_user);

            if (location) {
                const searchCity = await CityRepository.findCityById(location.cd_city);
                const searchGeolocation = await GeolocationRepository.findGeolocationById(location.cd_geolocation);

                location = {
                    city: searchCity.nm_city,
                    uf: searchCity.sg_uf,
                    geolocation: {
                        latitude: searchGeolocation.cd_latitude,
                        longitude: searchGeolocation.cd_longitude
                    }
                }
            } else {
                location = null;
            }

            resolve({
                id: user.cd_user,
                name: user.nm_user,
                surname: user.nm_surname_user,
                email: login.nm_email,
                biography: user.ds_biography,
                label: user.nm_label,
                profission: user.nm_profission,
                website: user.ds_website,
                image: user.im_user,
                company: user.nm_company,
                location: location
            });
        });
    }
}

export default ProfileController;