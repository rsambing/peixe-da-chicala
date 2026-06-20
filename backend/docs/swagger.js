import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Peixe da Chicala API',
      version: '1.0.0',
      description: 'Documentação da API REST do Peixe da Chicala'
    },
    servers: [
      { url: 'https://backend-peixe-da-chicala.onrender.com', description: 'Produção (Render)' },
      { url: 'http://localhost:3000', description: 'Local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },

apis: ['./server.js', './src/routes/*.js', './src/controllers/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);