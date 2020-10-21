interface UserResponse{
    id: number,
    name: string,
    surname: string,
    email: string,
    biography?: string,
    label?: string,
    image?: string,
    profission?: string,
    company?: string,
    website?: string,
    location?: {
        city: string,
        uf: string,
        geolocation: {
            latitude: number,
            longitude: number
        }
    } | null
}

export default UserResponse;