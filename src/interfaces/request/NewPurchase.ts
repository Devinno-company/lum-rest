import TicketRequest from "./TicketRequest";

interface NewPurchase {
    tickets: Array<TicketRequest>,
    email: String,
    cpf_payer: string,
    address?: { // Only for billet
        zip_code: String,
        street_name: String,
        street_number: String
    },
    payments: {
        payment_method_id: String,
        payment_type_id: String,
        token?: String, //Only for Credit Card
        installments?: Number, //Only for Credit Card
        issuer_id?: String, //Only for Credit Card
        description: String
    }
}

export default NewPurchase;