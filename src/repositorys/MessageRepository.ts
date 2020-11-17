import db from "../database/connection"
import Message from "../models/Message";

class MessageRepository {

    public static async insertMessage(message: string, room_id: number, user_id?: number, event_id?: number): Promise<Message> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedMessage =
                await trx('tb_message as m')
                    .insert({
                        ds_message: message,
                        cd_room: room_id,
                        cd_user: user_id,
                        cd_event: event_id
                    })
                    .returning('*');

            await trx.commit()
                .then(() => { resolve(insertedMessage[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findMessagesByRoomId(room_id: number): Promise<Array<Message>> {
        return new Promise(async (resolve) => {

            const messages =
                await db('tb_message as m')
                    .select('*')
                    .where('m.cd_room', '=', room_id)
                    .orderBy('m.hr_sended', 'desc');

            resolve(messages);
        });
    }

    public static async deleteMessageById(message_id: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_message')
                .where('cd_message', '=', message_id)
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

export default MessageRepository;