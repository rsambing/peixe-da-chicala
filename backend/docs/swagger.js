import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API',
      version: '1.0.0',
      description: 'Documentação da API'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },

apis: ['./server.js', './src/routes/*.js', './src/controllers/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);