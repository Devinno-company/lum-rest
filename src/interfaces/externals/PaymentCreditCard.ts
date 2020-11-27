interface PaymentCreditCard {
    payment_type_id: String,
    payment_method_id: String, 
    token: String,
    transaction_amount: Number,
    processing_mode: String,
    description: String,
    installments: Number,
    issuer_id?: String,
}

export default PaymentCreditCard;