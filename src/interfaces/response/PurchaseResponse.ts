import TicketPurchase from "./TicketPurchase";

interface PurchaseResponse {
    cd_purchase: number,
    sg_status: string,
    tickets: Array<TicketPurchase>
}

export default PurchaseResponse;