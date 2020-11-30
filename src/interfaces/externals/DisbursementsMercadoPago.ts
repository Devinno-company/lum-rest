interface DisbursementsMercadoPago {
    id: number,
    amount: number,
    external_reference: string,
    collector_id: number,
    application_fee: number,
    money_release_days: number
}

export default DisbursementsMercadoPago;