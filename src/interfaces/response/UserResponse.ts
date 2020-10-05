interface User{
    id: number,
    user: string,
    surname_user: string,
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
    }
}

export default UserResponse;