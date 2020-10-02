import { Request } from "express";
import db from "../database/connection";
import NewUser from "../interfaces/request/NewUser";
import UpdateUser from "../interfaces/request/UpdateUser";
import User from "../models/User";

class UserRepository {

    public static insertUser(newUser: NewUser): Promise<User> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            // INSERE AS CREDENCIAIS
            const insertedLogin_ids = await trx('tb_login')
                .insert({
                    nm_email: newUser.email,
                    nm_password: newUser.password
                }).returning('cd_login');

            const login_id = insertedLogin_ids[0];

            // INSERTE AS INFORMAÇÕES DE USUÁRIO 
            const insertedUsers = await trx('tb_user')
                .insert({
                    nm_user: newUser.name,
                    nm_surname_user: newUser.surname,
                    cd_login: login_id
                }).returning('*');

            const user: User = insertedUsers[0];

            try {
                trx.commit();
                resolve(user);
            } catch (err) {
                trx.rollback();
                reject(err);
            }
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

    public static deleteUserByEmail(email: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const user = await trx('tb_user as u')
                .select('*')
                .join('tb_login as l', 'l.cd_login', 'u.cd_login')
                .where('l.nm_email', '=', email);

            const location_user = await trx('tb_location_user as lu')
                .select('*')
                .where('lu.cd_location_user', '=', user[0].cd_location_user);

            await trx('tb_user')
                .delete()
                .where('cd_user', '=', user[0].cd_user);
                
            trx('tb_login')
                .delete()
                .where('cd_login', '=', user[0].cd_login);

            if (user[0].cd_location_user) {
                await trx('tb_location_user')
                    .delete()
                    .where('cd_location_user', '=', user[0].cd_location_user);

                await trx('tb_geolocation')
                    .delete()
                    .where('cd_geolocation', '=', location_user[0].cd_geolocation);
            }

            try {
                trx.commit();
                resolve();
            } catch (err) {
                trx.rollback();
                reject(err);
            }
        });
    }

    public static findUserById(idUser: number): Promise<User> {
        return new Promise(async (resolve, reject) => {
            const users = await db('tb_user as u')
                .select('*')
                .where('u.cd_user', '=', idUser);

            if (users[0])
                resolve(users[0]);
            else
                reject();
        });
    }

    public static findUserByEmail(email: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            const users = await db('tb_user as u')
                .select('*')
                .join('tb_login as l', 'l.cd_login', 'u.cd_login')
                .where('l.nm_email', '=', email);

            if (users[0])
                resolve(users[0]);
            else
                reject();
        });
    }
}

export default UserRepository;