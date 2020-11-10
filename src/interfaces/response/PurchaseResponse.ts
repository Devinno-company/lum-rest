import TicketPurchase from "./TicketPurchase";

interface PurchaseResponse {
    cd_purchase: number,
    sg_status: string,
    cd_user: number,
    tickets: Array<TicketPurchase>
}

export default PurchaseResponse;