import DashboardResponse from "../interfaces/response/DashboardResponse";
import TicketSales from "../interfaces/response/TicketSales";
import User from "../models/User";
import EventRepository from "../repositorys/EventRepository";
import PurchaseRepository from "../repositorys/PurchaseRepository";
import TicketRepository from "../repositorys/TicketRepository";
import havePermission from "../utils/havePermission";

class DashboardController {
    async getDashboard(user: User, idEvent: number): Promise<DashboardResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            else {
                await havePermission(user.cd_user, event.cd_event, 'EQP')
                    .then(async () => {
                        const tickets = await TicketRepository.findTicketsByEventId(event.cd_event)
                        
                        let ticketSales: Array<TicketSales> = [];
                        let totalRevenue: number = 0;
                        let ticketsSoldQuantity: number = 0;
                        let totalPendingPurchases:number = 0;
                        let clientTotal:number = 0;
                        let clientCodes: Array<number> = [];
                        
                        for (let i = 0; i < tickets.length; i++) {
                            
                            let quantitySold = tickets[i].qt_ticket - tickets[i].qt_ticket_available;
                            let totalSoldValue = tickets[i].vl_ticket * quantitySold;
                            const approvedPurchases = await PurchaseRepository.findApprovedPurchasesByTicketId(tickets[i].cd_ticket);
                            const pendentPurchases = await PurchaseRepository.findPendentPurchasesByTicketId(tickets[i].cd_ticket);
                            
                            approvedPurchases.forEach(item => {
                                if (!clientCodes.includes(item.cd_user)) {
                                    clientCodes.push(item.cd_user);
                                    clientTotal += 1;
                                }                              
                            });
                            totalRevenue += totalSoldValue;
                            ticketsSoldQuantity += quantitySold;
                            totalPendingPurchases += pendentPurchases.length;
                            ticketSales.push({
                                TicketName: tickets[i].nm_ticket,
                                UnitaryValue: tickets[i].vl_ticket,
                                QuantitySold: quantitySold,
                                TicketsRemaining: tickets[i].qt_ticket_available,
                                TotalSoldValue: totalSoldValue
                            });
                        };
                        let averageRevenuePerUser = (totalRevenue / clientTotal);
                                                
                        resolve({
                            EventName: event.nm_event,
                            TotalRevenue: totalRevenue,
                            TicketsSoldQuantity: ticketsSoldQuantity,
                            TotalPendingPurchases: totalPendingPurchases,
                            ClientTotal: clientTotal,
                            AverageRevenuePerUser: averageRevenuePerUser,
                            ticketSales: ticketSales
                        });
                    })
                    .catch(() => reject({ status: 401, message: 'You are not allowed to do so' }));
            }
        });
    }
}

export default DashboardController;