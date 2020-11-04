interface Message {
    cd_message: number,
    ds_message: string,
    hr_sended: string,
    cd_room: number,
    cd_user?: number,
    cd_event?: number
}

export default Message;