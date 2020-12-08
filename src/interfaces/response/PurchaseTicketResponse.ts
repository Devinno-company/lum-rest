interface PurchaseTicketResponse {
    idTicket: number,
    TicketName: string,
    idEvent: number,
    TicketEvent: string,
    EventBanner: string,
    TicketValue: number,
    idValid: boolean,
    QRCode: string,
    payer: {
        name: string, 
        cpf: string
    }
}

export default PurchaseTicketResponse;