require('dotenv-safe').config();
import express from 'express';
import profileRoutes from './routes/profile.routes';
import userRoutes from './routes/user.routes';

const listen = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(profileRoutes);

app.listen(3000, () => {
    console.log(`------RODANDO NA PORTA ${listen}------`);
});