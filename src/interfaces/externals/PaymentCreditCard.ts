interface PaymentCreditCard {
    payment_type_id: String,
    payment_method_id: String, 
    token: String,
    date_of_expiration: string,
    transaction_amount: Number,
    description: String,
    processing_mode: String,
    installments: Number,
    issuer_id?: String,
}

export default PaymentCreditCard;