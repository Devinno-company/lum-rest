interface PurchaseTicketResponse {
    idTicket: number,
    TicketName: string,
    TicketEvent: string,
    TicketValue: number,
    idValid: boolean,
    QRCode: string,
    payer: {
        name: string, 
        cpf: string,
        phone: string
    }
}

export default PurchaseTicketResponse;