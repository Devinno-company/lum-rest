import { rejects } from "assert";
import db from "../database/connection";
import Login from "../models/Login";
import User from "../models/User";

class LoginRepository {

    public static insertLogin(email: string, hash: string): Promise<number | null> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            // INSERE AS CREDENCIAIS
            const insertedLogin = await trx('tb_login')
                .insert({
                    nm_email: email,
                    nm_password: hash
                }).returning('*');

            const login_id = insertedLogin[0];

            try {
                trx.commit();
                resolve(login_id);
            } catch (error) {
                trx.rollback();
                reject(error);
            }
        });
    }

    public static deleteLoginById(idLogin: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            trx('tb_login')
                .delete()
                .where('cd_login', '=', idLogin);

            try {
                trx.commit();
                resolve();
            } catch (error) {
                trx.rollback();
                reject();
            }
        });
    }

    public static updatePassword(idLogin: number, newPassword: string) {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_login')
                .update({
                    nm_password: newPassword
                })
                .where('cd_login', '=', idLogin);

            try {
                trx.commit();
                resolve();
            } catch (err) {
                trx.rollback();
                reject(err);
            }
        });
    }

    public static findLoginById(idLogin: number): Promise<Login> {
        return new Promise(async (resolve, reject) => {
            const login = await db('tb_login as l')
                .select('*')
                .where('l.cd_login', '=', idLogin);

            if (login[0])
                resolve(login[0]);
        });
    }

    public static findLoginByEmail(email: string): Promise<Login> {
        return new Promise(async (resolve, reject) => {
            const login = await db('tb_login as l')
                .select('*')
                .where('l.nm_email', '=', email);

            if (login[0])
                resolve(login[0]);
            else
                reject({ message: 'E-mail não registrado no nosso banco', status: 404 });
        });
    }
}

export default LoginRepository;