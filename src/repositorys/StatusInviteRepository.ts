import db from "../database/connection";
import Status from "../models/Status";

class StatusInvite {

    public static findStatusInvite(status_id: string): Promise<Status> {

        return new Promise(async (resolve) => {
            const status = await
            db('tb_status_invite as si')
                .select('*')
                .where('si.sg_status', '=', status_id);

            resolve(status[0]);
        });
    }
}

export default StatusInvite;