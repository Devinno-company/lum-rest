interface NoticeResponse {
    id: number,
    name: string,
    description: string,
    priority: number,
    urgency: {
        name: string,
        priority: number
    }
}

export default NoticeResponse;