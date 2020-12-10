import PayerPayment from "./PayerPayment";

interface PaymentDataCreditCard {
    payer: PayerPayment,
    transaction_amount: number,
    token: string,
    description: string,
    installments: number,
    payment_method_id: string,
    application_fee: number
}

export default PaymentDataCreditCard;