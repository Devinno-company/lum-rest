import db from "../database/connection";
import Role from "../models/Role";

class RoleRepository {

    public static findRole(role: string): Promise<Role> {
        
        return new Promise(async (resolve) => {
            const searchRole = await db('tb_role as r')
                .select('*')
                .where('r.sg_role', '=', role);
            
            resolve(searchRole[0]);
        });
    }
}

export default RoleRepository;