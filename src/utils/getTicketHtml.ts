import Event from "../models/Event";
import Login from "../models/Login";
import Purchase from "../models/Purchase";
import Ticket from "../models/Ticket";
import User from "../models/User";

function getTicketHtml(user: User, login: Login, ticket: Ticket, purchase: Purchase, event: Event, qrcode: string) {
    const html =
        `
    <html>
        <head>
        </head>
        <body>
            <h2>Informações do ingresso</h2>
            <ul>
                <li>Código: ${ticket.cd_ticket} </li>
                <li>Ingresso: ${ticket.nm_ticket}</li>
                <li>Descrição: ${ticket.ds_ticket}</li>
                <li>Valor: R$${ticket.vl_ticket}</li>
            </ul>
            <h2>Informações do evento</h2>
            <ul>
                <li>Código: ${event.cd_event} </li>
                <li>Nome: ${event.nm_event}</li>
                <li>Descrição: ${event.ds_event}</li>
            </ul>
            <h2>Informações da comprador</h2>
            <ul>
                <li>Código: ${purchase.cd_purchase} </li>
                <li>Email: ${login.nm_email}</li>
                <li>Nome: ${user.nm_user} ${user.nm_surname_user}</li>
            </ul>

            <img src="${qrcode}" />
        </body>
    </html>
    `

    return html;
}

export default getTicketHtml;