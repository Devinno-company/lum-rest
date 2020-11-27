import NotificationMercadoPago from "../interfaces/externals/NotificationMercadoPago";
import AccessRepository from "../repositorys/AccessRepository";
import EventRepository from "../repositorys/EventRepository";
import ItemTicketPurchaseRepository from "../repositorys/ItemTicketPurchaseRepository";
import LinkNotificationRepository from "../repositorys/LinkNotificationRepository";
import NotificationRepository from "../repositorys/NotificationRepository";
import PurchaseCreditCardRepository from "../repositorys/PurchaseCreditCardRepository";
import PurchaseRepository from "../repositorys/PurchaseRepository";
import TicketRepository from "../repositorys/TicketRepository";
import UserRepository from "../repositorys/UserRepository";

class NotificationsMercadoPagoController {

    whatIsAction(notificationMercadoPago: NotificationMercadoPago) {

        switch (notificationMercadoPago.action) {
            case 'payment.created':
                this.paymentCreated(notificationMercadoPago);
        }
    }

    paymentCreated(notificationMercadoPago: NotificationMercadoPago) {
        PurchaseRepository.findPurchaseByMercadoPagoId(notificationMercadoPago.data.id)
            .then(async (purchase) => {
                const itens = await ItemTicketPurchaseRepository.findItemByPurchaseId(purchase.cd_purchase)
                for (let i = 0; i < itens.length; i++) {
                    
                    TicketRepository.findTicketById(itens[i].cd_ticket)
                    .then(async (ticket) => {
                        const accesses = AccessRepository.findAccessByEventId(ticket.cd_event);
                        const event = EventRepository.findEventById(ticket.cd_event);
                        let creator_id: number = 0;

                        (await accesses).forEach((item) => {
                            if (item.sg_role == "CRI")
                            creator_id = item.cd_user;
                        });

                        const creator = UserRepository.findUserById(creator_id);
                        LinkNotificationRepository.insertLinkNotification(ticket.cd_event, 'NCI')
                        .then(async (link) => {
                            NotificationRepository.insertNotification({
                                notification_title: 'Nova compra de ingresso no seu evento!',
                                notification_content: `O evento "${(await event).nm_event}" realizou uma venda!`,
                                notification_read: false
                            }, (await creator).cd_user, link.cd_link)
                            
                            TicketRepository.updateTicketById(ticket.cd_ticket, { quantity_available_to: ticket.qt_ticket_available-- });
                        });
                            
                    });
                }
                if (purchase.cd_purchase_credit_card) {
                    PurchaseCreditCardRepository.updateApprovedPurchaseCreditCard(purchase.cd_purchase_credit_card, String(new Date()));
                }
            });
    }
}

export default NotificationsMercadoPagoController;