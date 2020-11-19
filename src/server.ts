require('dotenv-safe').config();
import express from 'express';
import eventRoutes from './routes/eventRoutes';
import inviteRoutes from './routes/inviteRoutes';
import notificationRoutes from './routes/notificationRoutes';
import materialRoutes from './routes/materialRoutes';
import profileRoutes from './routes/profileRoutes';
import teamRoutes from './routes/teamRoutes';
import timeRoutes from './routes/timeRoutes';
import userRoutes from './routes/userRoutes';
import noticeRoutes from './routes/noticeRoutes';
import taskRoutes from './routes/taskRoutes';
import chatEventRoutes from './routes/chatEventRoutes';
import chatUserRoutes from './routes/chatUserRoutes';
import ticketRoutes from './routes/ticketRoutes';
import purchaseRoutes from './routes/purchaseRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import bodyparser from 'body-parser';
const cors = require('cors');

const listen = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(userRoutes);
app.use(profileRoutes);
app.use(eventRoutes);
app.use(teamRoutes);
app.use(timeRoutes);
app.use(inviteRoutes);
app.use(notificationRoutes);
app.use(materialRoutes);
app.use(noticeRoutes);
app.use(taskRoutes);
app.use(chatEventRoutes);
app.use(chatUserRoutes);
app.use(ticketRoutes);
app.use(purchaseRoutes);
app.use(dashboardRoutes);

app.listen(listen, () => {
    console.log(`------RODANDO NA PORTA ${listen}------`);
});