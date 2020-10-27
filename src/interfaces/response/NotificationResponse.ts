interface NotificationResponse {
    id: number,
    title: string,
    content: string,
    isRead: boolean,
    link: {
        idItem: number,
        type: string
    },
    idUser: number
}

export default NotificationResponse;