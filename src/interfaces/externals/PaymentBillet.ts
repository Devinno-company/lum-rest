interface PaymentBillet {
    payment_type_id: String,
    payment_method_id: String, 
    transaction_amount: Number,
    processing_mode: String,
    date_of_expiration: string,
}

export default PaymentBillet;