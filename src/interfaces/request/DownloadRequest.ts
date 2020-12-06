import Login from "../../models/Login";
import Event from "../../models/Event";
import Purchase from "../../models/Purchase";
import Ticket from "../../models/Ticket";
import User from "../../models/User";

interface DownloadRequest {
    user: User,
    login: Login,
    purchase: Purchase,
    checkins: Array<{
        ticket: Ticket,
        event: Event,
        qrcode: string
    }>
}

export default DownloadRequest;