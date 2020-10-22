interface NewEvent {
    name: string,
    start_date: string,
    end_date: string,
    description?: string,
    start_time?: string,
    end_time?: string,
    type?: string,
    location: {
        street: string,
        neighborhood: string,
        number: number,
        cep: string,
        complement?: string,
        geolocation: {
            latitude: number,
            longitude: number,
        },
        city: string,
        uf: string
    }
    privacy: string,
    category: string
}

export default NewEvent;