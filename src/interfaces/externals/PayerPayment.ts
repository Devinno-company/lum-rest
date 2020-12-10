interface PayerPayment {
    first_name: string,
    last_name: string,
    id: Number,
    email: String,
    identification: {
        type: String,
        number: string
    },
    type: string
}

export default PayerPayment;