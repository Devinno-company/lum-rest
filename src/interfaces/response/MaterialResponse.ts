interface MaterialResponse {
    id: number,
    name: string,
    quantity: number,
    acquired: number,
    observation?: string,
    status: string
}

export default MaterialResponse;