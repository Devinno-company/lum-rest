interface TeamMember {
    id: number,
    name: string,
    surname: string,
    image?: string,
    role: {
        name: string,
        description: string
    }
}

export default TeamMember;