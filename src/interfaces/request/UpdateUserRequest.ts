import UpdateLocationUserRequest from "./UpdateLocationUserRequest";

interface UpdateUser {
    name_to?: string,
    surname_to?: string,
    biography_to?: string,
    label_to?: string,
    profission_to?: string,
    company_to?: string,
    website_to?: string,
    location_to?: UpdateLocationUserRequest
}

export default UpdateUser;