import DownloadRequest from "../interfaces/request/DownloadRequest";
import Event from "../models/Event";
import Login from "../models/Login";
import Purchase from "../models/Purchase";
import Ticket from "../models/Ticket";
import User from "../models/User";

function getTicketHtml(downloadRequest: DownloadRequest) {
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

    for (let i = 0; i < downloadRequest.checkins.length; i++) {

        let page = '';
        if (i == 0)
        page = 'first'
        else if (i == (downloadRequest.checkins.length - 1))
        page = 'last'
        else
        page = String(i + 1);
    
        html +=
        `
        <div id="pageHeader-${page}">Ingresso ${i + 1}</div>
        <div class="${(i != 0 ? 'new-page' : '')}">
        <h2>Informações do ingresso</h2>
        <ul>
        <li>Código: ${downloadRequest.checkins[i].ticket.cd_ticket} </li>
        <li>Ingresso: ${downloadRequest.checkins[i].ticket.nm_ticket}</li>
        <li>Descrição: ${downloadRequest.checkins[i].ticket.ds_ticket}</li>
        <li>Valor: R$${downloadRequest.checkins[i].ticket.vl_ticket}</li>
        </ul>
        <h2>Informações do evento</h2>
        <ul>
        <li>Código: ${downloadRequest.checkins[i].event.cd_event} </li>
        <li>Nome: ${downloadRequest.checkins[i].event.nm_event}</li>
        <li>Descrição: ${downloadRequest.checkins[i].event.ds_event}</li>
        </ul>
        <h2>Informações da comprador</h2>
        <ul>
        <li>Código: ${downloadRequest.purchase.cd_purchase} </li>
        <li>Email: ${downloadRequest.login.nm_email}</li>
        <li>Nome: ${downloadRequest.user.nm_user} ${downloadRequest.user.nm_surname_user}</li>
        </ul>
        
        <img src="${downloadRequest.checkins[i].qrcode}" />
        </div>
        <div id="pageFooter-${page}">Fim ingresso ${i + 1}</div>
        
        `
    }
    html += '</body> </html>'
    
    return html;
}

export default getTicketHtml;