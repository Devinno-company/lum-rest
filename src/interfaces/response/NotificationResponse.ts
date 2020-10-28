interface NotificationResponse {
    id: number,
    title: string,
    content: string,
    isRead: boolean,
    link: {
        idItem: number,
        type: string
    }
}

export default NotificationResponse;