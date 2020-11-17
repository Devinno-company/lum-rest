import db from "../database/connection";
import Room from "../models/Room";

class RoomRepository {

    public static async insertRoom(event_id: number, user_id: number): Promise<Room> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedRoom =
                await trx('tb_room')
                    .insert({
                        nm_room: `chat-${event_id}-${user_id}`,
                        cd_event: event_id,
                        cd_user: user_id
                    })
                    .returning('*');

            await trx.commit()
                .then(() => { resolve(insertedRoom[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findRoomById(idRoom: number): Promise<Room> {

        return new Promise(async (resolve) => {

            const room =
                await db('tb_room as r')
                    .select('r.cd_room', 'r.nm_room', 'r.cd_event', 'r.cd_user') 
                    .where('r.cd_room', '=', idRoom);
            
            resolve(room[0]);
        });
    }

    public static async findRoomsByUserId(user_id: number): Promise<Array<Room>> {

        return new Promise(async (resolve) => {

            const rooms =
                await db('tb_room as r')
                    .select('r.cd_room', 'r.nm_room', 'r.cd_event', 'r.cd_user') 
                    .where('r.cd_user', '=', user_id);
            
            resolve(rooms);
        });
    }

    public static async findRoomsByEventId(event_id: number): Promise<Array<Room>> {

        return new Promise(async (resolve) => {

            const rooms =
                await db('tb_room as r')
                    .select('r.cd_room', 'r.nm_room', 'r.cd_event', 'r.cd_user') 
                    .where('r.cd_event', '=', event_id);
            
            resolve(rooms);
        });
    }

    public static async findRoomByEventIdAndUserId(event_id: number, user_id: number): Promise<Room> {

        return new Promise(async (resolve) => {
            
            const room =
                await db('tb_room as r')
                    .select('r.cd_room', 'r.nm_room', 'r.cd_event', 'r.cd_user')
                    .where('r.cd_event', '=', event_id)
                    .andWhere('r.cd_user', '=', user_id);

            resolve(room[0]);
        });
    }

    public static async deleteRoomById(room_id: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_room')
                .where('cd_room', '=', room_id)
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

export default RoomRepository;