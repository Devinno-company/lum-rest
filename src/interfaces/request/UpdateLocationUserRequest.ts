interface UpdateLocationUserRequest {
    city: string,
    geolocation: {
        latitude: number,
        longitude: number
    }
}

export default UpdateLocationUserRequest;