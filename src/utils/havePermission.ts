import AccessRepository from "../repositorys/AccessRepository";

function havePermission(user_id: number, event_id: number, minimumRole: 'CRI' | 'COO' | 'EQP'): Promise<true> {

    return new Promise(async (resolve, reject) => {
        const access = await AccessRepository.findAccessByEventIdAndUserId(event_id, user_id);
        if(!access)
            reject(false);
        else {
            if(minimumRole == 'EQP')
                resolve(true);
            else if(minimumRole == 'COO' && access.sg_role == 'COO')
                resolve(true);
            else if(minimumRole == 'CRI' && access.sg_role == 'CRI')
                resolve(true);
            else
                reject(false);
        }
    });
}

export default havePermission;