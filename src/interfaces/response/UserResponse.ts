interface User{
    id: number,
    user: string,
    surname_user: string,
    biography: string | undefined,
    label: string | undefined,
    image: string | undefined,
    profission: string | undefined,
    company: string | undefined,
    website: string | undefined
}

export default UserResponse;