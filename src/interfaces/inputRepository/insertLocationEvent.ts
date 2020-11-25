interface InsertLocationEvent {
    street: string,
    name_establishment: string,
    neighborhood: string,
    number: number,
    cep: string,
    complement?: string
}

export default InsertLocationEvent;