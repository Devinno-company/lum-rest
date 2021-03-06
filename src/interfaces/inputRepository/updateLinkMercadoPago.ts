interface updateLinkMercadoPago {
    authorization_code?: string,
    identification_code?: string,
    refresh_token?: string,
    id_valid?: boolean,
    cd_access_token?: string,
    cd_public_key?: string,
    cd_user_mercado_pago?: number
}

export default updateLinkMercadoPago;