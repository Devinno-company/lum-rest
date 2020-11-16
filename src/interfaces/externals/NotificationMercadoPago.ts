interface NotificationMercadoPago {
    id: number,
    live_mode: boolean,
    type: string,
    date_created: string,
    application_id: number,
    user_id: number,
    version: string,
    api_version: string,
    action: string,
    data: {
        id: number
    }
}

export default NotificationMercadoPago;