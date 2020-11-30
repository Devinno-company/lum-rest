interface PayerPayment {
    first_name: string,
    last_name: string,
    id: Number,
    email: String,
    identification: {
        type: String,
        number: string
    },
    address?: {
        zip_code: String,
        street_name: String,
        street_number: String
    }
}

export default PayerPayment;