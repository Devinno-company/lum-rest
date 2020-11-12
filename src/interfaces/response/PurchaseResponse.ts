interface PurchaseResponse {
    id: number,
    idMercadoPago: number,
    PurchaseDate: string,
    PurchaseStatus: string,
    ticket: {
        idTicket: number,
        TicketName: string,
        TicketEvent: string,
        TicketQuantity: number,
        TicketValue: number
    }
    billet?: {
        idBillet: number,
        BilletImage: string,
        BilletPurchaseDate: string
    } | null,
    credit_card?: {
        idCreditCard: number,
        CreditCardPaymentMethod: string,
        CreditCardApprovedDate: string
    } | null
}

export default PurchaseResponse;