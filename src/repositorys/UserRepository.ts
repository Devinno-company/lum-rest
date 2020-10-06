import db from "../database/connection";
import NewUser from "../interfaces/request/NewUserRequest";
import UpdateUser from "../interfaces/request/UpdateUserRequest";
import User from "../models/User";
import GeolocationRepository from "./GeolocationRepository";
import LocationUserRepository from "./LocationUserRepository";
import LoginRepository from "./LoginRepository";
class UserRepository {

    public static insertUser(newUser: NewUser): Promise<User> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            // INSERE AS CREDENCIAIS
            await LoginRepository.insertLogin(newUser.email, newUser.password)
                .then(async (result) => {
                    // INSERTE AS INFORMAÇÕES DE USUÁRIO 
                    const insertedUsers = await trx('tb_user')
                        .insert({
                            nm_user: newUser.name,
                            nm_surname_user: newUser.surname,
                            cd_login: result.cd_login
                        }).returning('*');

                    const user: User = insertedUsers[0];

                    try {
                        await trx.commit();
                        resolve(user);
                    } catch (err) {
                        trx.rollback();
                        reject(err);
                    }
                })
                .catch(err => reject(err));
        });
    }

    public static updateUser(idUser: number, updateUser: UpdateUser): Promise<User> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedUsers = await trx('tb_user')
                .update({
                    nm_user: updateUser.name_to,
                    nm_surname_user: updateUser.surname_to,
                    ds_biography: updateUser.biography_to,
                    nm_label: updateUser.label_to,
                    nm_profission: updateUser.profission_to,
                    nm_company: updateUser.company_to,
                    ds_website: updateUser.website_to
                })
                .where('cd_user', '=', idUser)
                .returning('*');

            const user = updatedUsers[0];

            try {
                trx.commit();
                resolve(user);
            } catch (err) {
                trx.rollback();
                reject(err);
            }
        });
    }

    public static updateLocationUser(idUser: number, idLocationUser: number): Promise<User> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();
            console.log(idLocationUser);

            const updatedUsers = await trx('tb_user')
                .update({
                    cd_location_user: idLocationUser
                })
                .where('cd_user', '=', idUser)
                .returning('*');

            const user = updatedUsers[0];

            try {
                trx.commit();
                resolve(user);
            } catch (err) {
                trx.rollback();
                reject(err);
            }
        });
    }

    public static addImageById(idUser: number, linkImage: string): Promise<User> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedUser = await trx('tb_user')
                .update({
                    im_user: linkImage
                })
                .where('cd_user', '=', idUser)
                .returning('*');

            const user = updatedUser[0];

            try {
                trx.commit();
                resolve(user);
            } catch (err) {
                trx.rollback();
                reject(err);
            }
        });
    }

    public static deleteUserByEmail(email: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const user = await this.findUserByEmail(email);

            if (!user)
                reject({ message: "E-mail not found.", status: 404 });
            else {
                await trx('tb_user')
                    .delete()
                    .where('cd_user', '=', user.cd_user);

                await trx('tb_login')
                    .delete()
                    .where('cd_login', '=', user.cd_login);

                if (user.cd_location_user) {
                    const locationUser = await LocationUserRepository.findLocationUserById(user.cd_location_user);

                    await LocationUserRepository.deleteLocationUserById(user.cd_location_user)
                        .catch((err) => reject(err));

                    await GeolocationRepository.deleteGeolocation(locationUser.cd_geolocation)
                        .catch((err) => reject(err));
                }

                try {
                    trx.commit();
                    resolve();
                } catch (err) {
                    trx.rollback();
                    reject(err);
                }
            }
        });
    }

    public static findUserById(idUser: number): Promise<User> {

        return new Promise(async (resolve) => {
            const users = await db('tb_user as u')
                .select('*')
                .where('u.cd_user', '=', idUser);


            resolve(users[0]);
        });
    }

    public static findUserByEmail(email: string): Promise<User> {

        return new Promise(async (resolve) => {
            const users = await db('tb_user as u')
                .select('*')
                .join('tb_login as l', 'l.cd_login', 'u.cd_login')
                .where('l.nm_email', '=', email);


            resolve(users[0]);
        });
    }
}

export default UserRepository;