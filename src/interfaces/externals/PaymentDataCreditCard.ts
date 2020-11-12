interface PaymentDataCreditCard {
    transaction_amount: Number,
    token: String,
    description: String,
    installments: Number,
    payment_method_id: String,
    issuer_id?: String,
    application_fee: number,
    payer: {
        email: String,
        identification: {
            type: String,
            number: string
        }
    }
}

export default PaymentDataCreditCard;