import Message from './Message';

interface RoomJoinMessages {
    cd_room: number,
    cd_event: number,
    cd_user: number,
    tb_message: Array<Message>
}

export default RoomJoinMessages;