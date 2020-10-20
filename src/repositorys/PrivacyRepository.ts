import db from "../database/connection";
import Privacy from "../models/Privacy";

class PrivacyRepository {
    
    public static findPrivacyByName(privacy: string): Promise<Privacy> {

        return new Promise(async (resolve) => {
            const searchPrivacy = await db('tb_privacy as p')
                .select('*')
                .where('p.nm_privacy', '=', privacy);

            resolve(searchPrivacy[0]);
        });
    }

    public static findPrivacyById(idPrivacy: string): Promise<Privacy> {

        return new Promise(async (resolve) => {
            const searchPrivacy = await db('tb_privacy as p')
                .select('*')
                .where('p.sg_privacy', '=', idPrivacy);

            resolve(searchPrivacy[0]);
        });
    }
}

export default PrivacyRepository;