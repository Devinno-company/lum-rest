import db from "../database/connection";
import InsertEvent from "../interfaces/inputRepository/insertEvent";
import UpdateEvent from "../interfaces/request/UpdateEventRequest";
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

    public static updateEvent(idEvent: number, updateEvent: UpdateEvent): Promise<Event> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedEvents = await trx('tb_event')
                .update({
                    nm_event: updateEvent.name_to,
                    ds_event: updateEvent.description_to,
                    dt_start: updateEvent.date_start_to,
                    dt_end: updateEvent.date_end_to,
                    hr_start: updateEvent.hour_start_to,
                    hr_end: updateEvent.hour_end_to,
                    im_banner: updateEvent.im_banner_to,
                    nm_type: updateEvent.type_to,
                    sg_privacy: updateEvent.privacy_to,
                    sg_category: updateEvent.category_to
                })
                .where('cd_event', '=', idEvent)
                .returning('*');

            const event = updatedEvents[0];

            trx.commit()
                .then(() => { resolve(event); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static updateLocationEvent(idEvent: number, idLocationEvent: number): Promise<Event> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedEvent = await trx('tb_event')
                .update({
                    cd_location_event: idLocationEvent
                })
                .where('cd_event', '=', idEvent)
                .returning('*');

            const event = updatedEvent[0];

            trx.commit()
                .then(() => { resolve(event); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findEventById(idEvent: number): Promise<Event> {

        return new Promise(async (resolve) => {
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

            await trx('tb_event')
                .where('cd_event', '=', idEvent)
                .delete();

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findEventsByNameAndUfAndCity(name: string, uf: string, city: string): Promise<Array<Event>> {
        return new Promise(async (resolve) => {

            const events =
                await db('tb_event as e')
                    .select('*')
                    .join('tb_location_event as le', 'e.cd_location_event', 'le.cd_location_event')
                    .join('tb_city as c', 'le.cd_city', 'c.cd_city')
                    .where('e.sg_privacy', '=', 'PUB')
                    .andWhere('c.sg_uf', '=', uf)
                    .andWhere('c.nm_city', '=', city)
                    .andWhereRaw(`to_tsvector(e.nm_event) @@ to_tsquery('${name}')`);
                    
            resolve(events);
        })
    }

    public static async findEventsByUfAndCity(uf: string, city: string): Promise<Array<Event>> {
        return new Promise(async (resolve) => {

            const events =
                await db('tb_event as e')
                    .select('*')
                    .join('tb_location_event as le', 'e.cd_location_event', 'le.cd_location_event')
                    .join('tb_city as c', 'le.cd_city', 'c.cd_city')
                    .where('e.sg_privacy', '=', 'PUB')
                    .andWhere('c.sg_uf', '=', uf)
                    .andWhere('c.nm_city', '=', city)


            resolve(events);
        })
    }

    public static async findEventsByNameAndCity(name: string, city: string): Promise<Array<Event>> {
        return new Promise(async (resolve) => {

            const events =
                await db('tb_event as e')
                    .select('*')
                    .join('tb_location_event as le', 'e.cd_location_event', 'le.cd_location_event')
                    .join('tb_city as c', 'le.cd_city', 'c.cd_city')
                    .where('e.sg_privacy', '=', 'PUB')
                    .andWhere('c.nm_city', '=', city)
                    .andWhereRaw(`to_tsvector(e.nm_event) @@ to_tsquery('${name}')`);


            resolve(events);
        })
    }

    public static async findEventsByNameAndUf(name: string, uf: string): Promise<Array<Event>> {
        return new Promise(async (resolve) => {

            const events =
                await db('tb_event as e')
                    .select('*')
                    .join('tb_location_event as le', 'e.cd_location_event', 'le.cd_location_event')
                    .join('tb_city as c', 'le.cd_city', 'c.cd_city')
                    .where('e.sg_privacy', '=', 'PUB')
                    .andWhere('c.sg_uf', '=', uf)
                    .andWhereRaw(`to_tsvector(e.nm_event) @@ to_tsquery('${name}')`);

            resolve(events);
        })
    }

    public static async findEventsByUf(uf: string): Promise<Array<Event>> {
        return new Promise(async (resolve) => {

            const events =
                await db('tb_event as e')
                    .select('*')
                    .join('tb_location_event as le', 'e.cd_location_event', 'le.cd_location_event')
                    .join('tb_city as c', 'le.cd_city', 'c.cd_city')
                    .where('e.sg_privacy', '=', 'PUB')
                    .andWhere('c.sg_uf', '=', uf);

            resolve(events);
        });
    }

    public static async findEventsByCity(city: string): Promise<Array<Event>> {
        return new Promise(async (resolve) => {

            const events =
                await db('tb_event as e')
                    .select('*')
                    .join('tb_location_event as le', 'e.cd_location_event', 'le.cd_location_event')
                    .join('tb_city as c', 'le.cd_city', 'c.cd_city')
                    .where('e.sg_privacy', '=', 'PUB')
                    .andWhere('c.nm_city', '=', city);

            resolve(events);
        });
    }

    public static async findEventsByName(name: string): Promise<Array<Event>> {
        return new Promise(async (resolve) => {

            const events =
                await db('tb_event as e')
                    .select('*')
                    .where('e.sg_privacy', '=', 'PUB')
                    .andWhereRaw(`to_tsvector(e.nm_event) @@ to_tsquery('${name}')`)

            resolve(events);
        });
    }
}

export default EventRepository;