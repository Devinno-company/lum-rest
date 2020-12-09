interface TicketResponse {
    id: number,
    name: string,
    description: string,
    price: number,
    quantity_total: number,
    quantity_available: number
}

export default TicketResponse;