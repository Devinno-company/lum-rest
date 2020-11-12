interface LinkMercadoPago {
    cd_link_mercado_pago: number,
    cd_authorization: string,
    cd_identification: string,
    id_valid: boolean,
    dt_issute: string,
    cd_user: number
}

export default LinkMercadoPago;