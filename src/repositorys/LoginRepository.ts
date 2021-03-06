import db from "../database/connection";
import Login from "../models/Login";

class LoginRepository {

    public static insertLogin(email: string, hash: string): Promise<Login> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedLogin = await trx('tb_login')
                .insert({
                    nm_email: email,
                    nm_password: hash
                }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedLogin[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static deleteLoginById(idLogin: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_login')
                .where('cd_login', '=', idLogin)
                .delete();

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updatePassword(idLogin: number, newPassword: string): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_login')
                .update({
                    nm_password: newPassword
                })
                .where('cd_login', '=', idLogin);

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static findLoginById(idLogin: number): Promise<Login> {

        return new Promise(async (resolve) => {
            const login = await db('tb_login as l')
                .select('*')
                .where('l.cd_login', '=', idLogin);

            resolve(login[0]);
        });
    }

    public static findLoginByEmail(email: string): Promise<Login> {

        return new Promise(async (resolve) => {
            const login = await db('tb_login as l')
                .select('*')
                .where('l.nm_email', '=', email);

            resolve(login[0]);
        });
    }
}

export default LoginRepository;