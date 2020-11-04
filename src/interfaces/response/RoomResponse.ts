import MessageResponse from "./MessageResponse";

interface RoomResponse {
    id: number,
    user_id: number,
    event_id: number,
    messages: Array<MessageResponse>
}

export default RoomResponse;