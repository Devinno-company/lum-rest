interface User {
    cd_user: number;
    nm_user: string;
    nm_surname_user: string;
    ds_biography?: string;
    nm_label?: string;
    im_user?: string;
    nm_profission?: string;
    nm_company?: string;
    ds_website?: string; 
    cd_login: number;
    cd_location_user?: number;
}

export default User;