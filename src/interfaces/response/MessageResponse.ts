interface MessageResponse {
    id: number,
    message: string,
    author: {
        id: number
        type: "USR" | "EVT"
    },
    sended_at: string
}

export default MessageResponse;