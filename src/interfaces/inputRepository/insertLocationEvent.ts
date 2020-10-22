interface InsertLocationEvent {
    street: string,
    neighborhood: string,
    number: number,
    cep: string,
    complement?: string
}

export default InsertLocationEvent;