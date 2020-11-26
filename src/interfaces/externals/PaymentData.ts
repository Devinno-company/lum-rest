import DisbursementsMercadoPago from "./DisbursementsMercadoPago";

interface PaymentData {
    payer: {
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
    },
    payment: {
        payment_method_id: String,
        payment_type_id: String,
        token?: String,
        transaction_amount: Number,
        processing_mode: String,
        installments?: Number,
        issuer_id?: String,
        description: String,
    },
    dispursements: Array<DisbursementsMercadoPago>
}

export default PaymentData;