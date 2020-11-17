import db from '../database/connection';
import Event from '../models/Event';
import Invite from '../models/Invite';

class InviteRepository {

    public static async insertInvite(user_id: number, event: Event, role_id: 'COO' | 'EQP'): Promise<Invite> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedInvite = await trx('tb_invite')
                .insert({
                    nm_title: 'Você foi convidado para participar da equipe de organização de um evento',
                    ds_content: `O evento ${event.nm_event} está te convidado para você atuar como ${role_id == 'COO' ? 'coordenador' : 'membro da equipe'} do evento.`,
                    cd_user: user_id,
                    cd_event: event.cd_event,
                    sg_role: role_id
                })
                .returning('*');

            await trx.commit()
                .then(() => { resolve(insertedInvite[0]) })
                .catch((err) => { reject(err) });
        });
    }

    public static async findInviteById(idInvite: number): Promise<Invite> {

        return new Promise(async (resolve) => {

            const invite =
                await db('tb_invite as i')
                    .select('*')
                    .where('i.cd_invite', '=', idInvite);

            resolve(invite[0]);
        });
    }

    public static async findInvitesByUserId(user_id: number): Promise<Array<Invite>> {

        return new Promise(async (resolve) => {

            const invites: Array<Invite> =
                await db('tb_invite as i')
                    .select('*')
                    .where('i.cd_user', '=', user_id);

            resolve(invites);
        });
    }

    public static async findInvitesByEventId(event_id: number): Promise<Array<Invite>> {

        return new Promise(async (resolve) => {

            const invites: Array<Invite> =
                await db('tb_invite as i')
                    .select('*')
                    .where('i.cd_event', '=', event_id);

            resolve(invites);
        });
    }

    public static async updateStatusInvite(idInvite: number, status_id: 'ACE' | 'REC'): Promise<Invite> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedInvite =
                await trx('tb_invite')
                    .update({
                        sg_status: status_id
                    })
                    .where('cd_invite', '=', idInvite)
                    .returning('*');

            await trx.commit()
                .then(() => resolve(updatedInvite[0]))
                .catch((err) => reject(err));
        });
    }

    public static async deleteInviteById(idInvite: number): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_invite')
                .delete()
                .where('cd_invite', '=', idInvite);

            await trx.commit()
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }
}

export default InviteRepository;