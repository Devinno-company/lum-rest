interface Purchase {
    cd_purchase: number,
    cd_purchase_mercado_pago: number,
    qt_ticket: number,
    dt_purchase: string,
    cd_status: string,
    cd_user: number,
    cd_ticket: number
    cd_purchase_billet?: number,
    cd_purchase_credit_card?: number
}

export default Purchase;