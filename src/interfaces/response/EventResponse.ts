import TeamMember from "./TeamMember";

interface EventResponse {
    id: number,
    name: string,
    description?: string,
    banner?: string,
    start_date: string,
    end_date: string,
    start_time?: string,
    end_time?: string,
    type?: string,
    location: {
        street: string,
        neighborhood: string,
        name_establishment: string,
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
    privacy: {
        name: string,
        description: string
    },
    category: {
        name: string,
        description: string
    },
    team: Array<TeamMember>
}

export default EventResponse;