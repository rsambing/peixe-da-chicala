import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './docs/swagger.js';
import authRouter from './src/routes/auth.route.js';
import userRouter from './src/routes/user.route.js';
import categoryRouter from './src/routes/category.route.js';
import productRouter from './src/routes/product.route.js';
import orderRouter from './src/routes/order.route.js';
import orderItemRouter from './src/routes/orderItem.route.js';
import settingRouter from './src/routes/setting.route.js';
import testimonialRouter from './src/routes/testimonial.route.js';
// device routes removed (FCM)

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Registar rotas
app.use(authRouter);
app.use(userRouter);
app.use(categoryRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(orderItemRouter);
app.use(settingRouter);
app.use(testimonialRouter);
// device routes removed (FCM)

app.get('/', (req, res) => {
  res.send('Peixe da Chicala API');
});

// Local dev only — Vercel handles the server in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Esta a bumbar ${process.env.PORT || 3000}`);
  });
}

export default app;