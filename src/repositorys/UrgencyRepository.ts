import db from "../database/connection";
import Urgency from "../models/Urgency";

class UrgencyRepository {
    
    public static findUrgencyByName(urgency: string): Promise<Urgency> {

        return new Promise(async (resolve) => {
            const searchUrgency = await db('tb_urgency as u')
                .select('*')
                .where('u.nm_Urgency', '=', urgency)
                .orderBy('u.qt_priority', 'desc');

            resolve(searchUrgency[0]);
        });
    }

    public static findUrgencyById(idUrgency: string): Promise<Urgency> {

        return new Promise(async (resolve) => {
            
            const searchUrgency = await db('tb_urgency as u')
                .select('*')
                .where('u.sg_urgency', '=', idUrgency)
                .orderBy('u.qt_priority', 'desc');

            resolve(searchUrgency[0]);
        });
    }
}

export default UrgencyRepository;