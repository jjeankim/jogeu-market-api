import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "조그마켓 API",
      version: "1.0.0",
      description: "조그마켓 API 문서",
      contact: {
        name: "API Support",
        email: "support@jogeu-market.com"
      }
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "개발 서버"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/docs/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions); 