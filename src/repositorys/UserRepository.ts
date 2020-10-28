import db from "../database/connection";
import NewUser from "../interfaces/request/NewUserRequest";
import UpdateUser from "../interfaces/request/UpdateUserRequest";
import UserResponse from "../interfaces/response/UserResponse";
import User from "../models/User";

class UserRepository {

    public static insertUser(newUser: NewUser, login_id: number): Promise<User> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedUsers = await trx('tb_user')
                .insert({
                    nm_user: newUser.name,
                    nm_surname_user: newUser.surname,
                    cd_login: login_id
                }).returning('*');

            const user: User = insertedUsers[0];

            await trx.commit()
                .then(() => { resolve(user); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
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

            trx.commit()
                .then(() => { resolve(user); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updateLocationUser(idUser: number, idLocationUser: number): Promise<User> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedUsers = await trx('tb_user')
                .update({
                    cd_location_user: idLocationUser
                })
                .where('cd_user', '=', idUser)
                .returning('*');

            const user = updatedUsers[0];

            trx.commit()
                .then(() => { resolve(user); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
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

            trx.commit()
                .then(() => { resolve(user); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static deleteUserByEmail(email: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const user = await this.findUserByEmail(email);

            if (!user)
                reject();
            else {
                await trx('tb_user')
                    .where('cd_user', '=', user.cd_user)
                    .delete();

                trx.commit()
                    .then(() => { resolve(); })
                    .catch((err) => {
                        trx.rollback();
                        reject(err);
                    });
            }
        });
    }

    public static deleteUserById(idUser: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_user')
                .where('cd_user', '=', idUser)
                .delete();

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
}

public static findUserById(idUser: number): Promise < User > {

    return new Promise(async (resolve) => {
        const users = await db('tb_user as u')
            .select('*')
            .where('u.cd_user', '=', idUser);


        resolve(users[0]);
    });
}

    public static findUserByEmail(email: string): Promise < User > {

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