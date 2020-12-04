interface TicketRequest {
    id: number,
    quantity: number,
    buyers: Array<{
        name: string,
        cpf: string,
        phone: string
    }>
}

export default TicketRequest;