import DisbursementsMercadoPago from "./DisbursementsMercadoPago";
import PayerPayment from "./PayerPayment";
import PaymentBillet from "./PaymentBillet";
import PaymentCreditCard from "./PaymentCreditCard";

interface PaymentData {
    payer: PayerPayment,
    payments: Array<PaymentBillet | PaymentCreditCard>,
    application_id: number,
    disbursements: Array<DisbursementsMercadoPago>,
    external_reference: String
}

export default PaymentData;