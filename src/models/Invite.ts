interface Invite {
    cd_invite: number,
    nm_title: string,
    ds_content: string,
    cd_user: number,
    cd_event: number,
    sg_role: 'COO' | "EQP",
    sg_status: 'PEN' | 'ACE' | 'REC'
}

export default Invite;