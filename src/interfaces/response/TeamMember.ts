interface TeamMember {
    id: number,
    name: string,
    surname: string,
    profission?: string,
    image?: string,
    role: {
        name: string,
        description: string
    }
}

export default TeamMember;