interface NewPurchase {
    ticket_id: number,
    quantity_ticket: number,
    cpf_payer: string,
    type_payment: string,
    credit_card?: {
        payment_method_id: string,
        token: string,
        installments: number,
        issuer?: string,
    },
    billet?: {
        zip_code: string,
        street_name: string,
        street_number: string,
        neighborhood: string,
        city: string,
        federal_unit: string
    }
}

export default NewPurchase;