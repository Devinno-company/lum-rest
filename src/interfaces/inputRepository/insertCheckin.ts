interface InsertCheckin {
    qr_code: string,
    token_qr: string,
    buyer_name?: string,
    buyer_cpf?: string,
    buyer_phone?: string
}

export default InsertCheckin;