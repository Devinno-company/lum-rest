import db from "../database/connection";
import Uf from "../models/Uf";

class UfRepository {

    public static findUf(uf: string): Promise<Uf> {
        
        return new Promise(async (resolve) => {

            const searchUf = await db('tb_uf as u')
                .select('*')
                .where('u.sg_uf', '=', uf);
            
            resolve(searchUf[0]);
        });
    }
}

export default UfRepository;