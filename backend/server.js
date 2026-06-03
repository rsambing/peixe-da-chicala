import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './docs/swagger.js';
import userRouter from './src/routes/user.route.js';
import categoryRouter from './src/routes/category.route.js';
import productRouter from './src/routes/product.route.js';
import orderRouter from './src/routes/order.route.js';
import orderItemRouter from './src/routes/orderItem.route.js';
import authRouter from './src/routes/auth.route.js';

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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Esta a bumbar ${process.env.PORT}`);
});