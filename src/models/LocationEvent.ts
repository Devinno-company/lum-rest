interface LocationEvent {
    cd_location_event: number,
    nm_street: string,
    nm_neighborhood: string,
    cd_number: number,
    cd_cep: string,
    nm_complement?: string,
    cd_geolocation: number,
    cd_city: number
}

export default LocationEvent;