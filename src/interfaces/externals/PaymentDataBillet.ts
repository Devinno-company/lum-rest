import PayerPayment from "./PayerPayment";

interface PaymentDataBillet {
    payer: PayerPayment,
    transaction_amount: number,
    description: string,
    payment_method_id: 'bolbradesco',
    date_of_expiration: string,
    address: {
        zip_code: String,
        street_name: String,
        street_number: String,
        neighborhood: string,
        city: string,
        federal_unit: string
    },
    application_fee: number
}

export default PaymentDataBillet;