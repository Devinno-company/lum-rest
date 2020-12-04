interface Checkin {
    cd_checkin: number,
    id_valid: boolean,
    cd_qr_code: string,
    cd_token_qr: string,
    nm_buyer: string,
    cd_cpf_buyer: string,
    cd_phone_buyer: string,
    cd_purchase: number,
    cd_ticket: number
}

export default Checkin;