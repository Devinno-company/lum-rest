import TicketSales from "./TicketSales";

interface DashboardCheckinResponse {
    EventName: string,
    CheckinsDone: number,
    CheckinsRemaining: number,
    CheckinsTotal: number
}

export default DashboardCheckinResponse;