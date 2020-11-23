import PurchaseTicketResponse from "./PurchaseTicketResponse";

interface PurchaseResponse {
    id: number,
    idMercadoPago: number,
    PurchaseDate: string,
    PurchaseStatus: string,
    billet?: {
        idBillet: number,
        BilletImage: string,
        BilletPurchaseDate: string
    } | null,
    credit_card?: {
        idCreditCard: number,
        CreditCardPaymentMethod: string,
        CreditCardApprovedDate?: string
    } | null,
    tickets: Array<PurchaseTicketResponse>
}

export default PurchaseResponse;