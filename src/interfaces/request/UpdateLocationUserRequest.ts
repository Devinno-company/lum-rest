interface UpdateLocationUserRequest {
    city: string,
    uf: string,
    geolocation: {
        latitude: number,
        longitude: number
    }
}

export default UpdateLocationUserRequest;