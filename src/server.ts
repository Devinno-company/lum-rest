require('dotenv-safe').config();
import express from 'express';
import db from './database/connection';
import eventRoutes from './routes/eventRoutes';
import inviteRoutes from './routes/inviteRoutes';
import notificationRoutes from './routes/notificationRoutes';
import materialRoutes from './routes/materialRoutes';
import profileRoutes from './routes/profileRoutes';
import teamRoutes from './routes/teamRoutes';
import userRoutes from './routes/userRoutes';

const listen = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(profileRoutes);
app.use(eventRoutes);
app.use(teamRoutes);
app.use(inviteRoutes);
app.use(notificationRoutes);
app.use(materialRoutes);

app.listen(listen, () => {
    console.log(`------RODANDO NA PORTA ${listen}------`);
});