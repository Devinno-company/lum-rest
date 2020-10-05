interface UpdateLocationUser {
    city?: string,
    geolocation?: {
        latitude: number,
        longitude: number
    }
}

export default UpdateLocationUser;