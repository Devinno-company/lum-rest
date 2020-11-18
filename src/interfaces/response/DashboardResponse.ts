import TicketSales from "./TicketSales";

interface DashboardResponse {
    EventName: string,
    TotalRevenue: number,
    TicketsSoldQuantity: number,
    TotalPendingPurchases: number,
    ClientTotal: number,
    AverageRevenuePerUser: number,
    ticketSales: Array<TicketSales>
}

export default DashboardResponse;