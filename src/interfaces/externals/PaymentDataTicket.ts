interface PaymentDataTicket {
    transaction_amount: number,
    description: String,
    payment_method_id: String,
    application_fee: number,
    payer: {
        email: String,
        first_name: String,
        last_name: String,
        identification: {
            type: String,
            number: String
        },
        address: {
            zip_code: String,
            street_name: String,
            street_number: String,
            neighborhood: String,
            city: String,
            federal_unit: String
        }
    }
}

export default PaymentDataTicket;