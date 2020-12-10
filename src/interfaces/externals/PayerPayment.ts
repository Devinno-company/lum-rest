interface PayerPayment {
    first_name: string,
    last_name: string,
    id: Number | null,
    email: String,
    identification: {
        type: String,
        number: string
    }
}

export default PayerPayment;