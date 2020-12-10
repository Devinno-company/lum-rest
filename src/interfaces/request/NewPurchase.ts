import TicketRequest from "./TicketRequest";

interface NewPurchase {
    tickets: Array<TicketRequest>,
    email: String,
    cpf_payer: string,   
    credit_card: {
        payment_method_id: string,
        token: string,
        installments: number,
        issuer_id?: string
    },
    billet: {
        address: {
            zip_code: String,
            street_name: String,
            street_number: String,
            neighborhood: string,
            city: string,
            federal_unit: string
        }
    }
}

export default NewPurchase;