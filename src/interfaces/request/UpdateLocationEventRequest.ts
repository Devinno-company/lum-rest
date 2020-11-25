interface UpdateLocationEventRequest {
    street_to: string,
    neighborhood_to: string,
    complement_to?: string,
    establishment_to: string,
    number_to: number,
    cep_to: number,
    city: string,
    uf: string,
    geolocation: {
        latitude: number,
        longitude: number
    }
}

export default UpdateLocationEventRequest;