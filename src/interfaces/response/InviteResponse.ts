interface InviteResponse {
    id: number,
    title: string,
    content: string, 
    status: {
        name: string,
        description: string
    },
    role: {
        name: string,
        description: string
    },
    event_id: number
}

export default InviteResponse;