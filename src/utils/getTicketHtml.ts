import Event from "../models/Event";
import Login from "../models/Login";
import Purchase from "../models/Purchase";
import Ticket from "../models/Ticket";
import User from "../models/User";

function getTicketHtml(user: User, login: Login, ticket: Ticket, purchase: Purchase, event: Event, qrcodes: Array<string>) {
    let html =
        `<html>
            <head>
                <style>
                    @media print {
                        .new-page {
                            page-break-before: always;
                        }
                    }
                </style>
            </head>
            <body>
        `;

    for (let i = 0; i < qrcodes.length; i++) {
        let page = '';
        if (i == 0)
            page = 'first'
        else if (i == (qrcodes.length - 1))
            page = 'last'
        else
            page = String(i + 1);

        html +=
            `
            <div id="pageHeader-${page}">Ingresso ${i + 1}</div>
            <div class="${(i != 0 ? 'new-page' : '')}">
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

            <img src="${qrcodes[i]}" />
            </div>
            <div id="pageFooter-${page}">Fim ingresso ${i + 1}</div>
            
    `     
    }
    html += '</body> </html>'
    
    return html;
}

export default getTicketHtml;