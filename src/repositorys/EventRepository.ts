import db from "../database/connection";
import InsertEvent from "../interfaces/inputRepository/insertEvent";
import Event from '../models/Event';

class EventRepository {

    public static async insertEvent(newEvent: InsertEvent, privacy: string, category: string, location_id: number): Promise<Event> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedEvent =
                await trx('tb_event')
                    .insert({
                        nm_event: newEvent.name,
                        dt_start: newEvent.start_date,
                        dt_end: newEvent.end_date,
                        ds_event: newEvent.description,
                        hr_start: newEvent.start_time,
                        hr_end: newEvent.end_time,
                        nm_type: newEvent.type,
                        cd_location_event: location_id,
                        sg_privacy: privacy,
                        sg_category: category
                    })
                    .returning('*');

            await trx.commit()
                .then(() => { resolve(insertedEvent[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findEventById(idEvent: number): Promise<Event> {

        return new Promise(async (resolve, reject) => {
            const event = 
                await db('tb_event as e')
                    .select('*')
                    .where('e.cd_event', '=', idEvent);

            resolve(event[0]);
        });
    }

    public static async deleteEventById(idEvent: number): Promise<any> {
        
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            trx('tb_event')
                .delete()
                .where('cd_event', '=', idEvent);

            await trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }
}

export default EventRepository;