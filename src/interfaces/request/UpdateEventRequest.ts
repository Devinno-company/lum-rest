import UpdateLocationEventRequest from "./UpdateLocationEventRequest";

interface UpdateEvent {
    name_to?: string,
    description_to?: string,
    date_start_to?: string,
    date_end_to?: string,
    hour_start_to?: string,
    hour_end_to?: string,
    im_banner_to?: string,
    type_to?: string,
    location_to?: UpdateLocationEventRequest,
    privacy_to?: string,
    category_to?: string
}

export default UpdateEvent;