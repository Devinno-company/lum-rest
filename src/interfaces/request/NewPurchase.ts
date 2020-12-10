import TicketRequest from "./TicketRequest";

interface NewPurchase {
    tickets: Array<TicketRequest>,
    email: String,
    cpf_payer: string,   
    credit_card: {
        payment_method_id: String,
        token: String,
        installments: Number,
        issuer_id?: String,
        date_of_expiration: string
    },
    billet: {
        address: {
            zip_code: String,
            street_name: String,
            street_number: String
        },
        description: String
    }
}

export default NewPurchase;