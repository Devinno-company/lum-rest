interface LinkMercadoPago {
    cd_link_mercado_pago: number,
    cd_authorization: string,
    cd_identification: string,
    cd_public_key: string,
    cd_access_token: string,
    id_valid: boolean,
    dt_issue: string,
    cd_user: number
}

export default LinkMercadoPago;