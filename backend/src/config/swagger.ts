// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { config } from "./env";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hospital System API",
      version: "1.0.0",
      description: "API para el sistema de gestión hospitalaria con replicación MySQL",
      contact: {
        name: "Soporte Técnico",
        email: "soporte@hospitalsystem.com",
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api`,
        description: "Servidor local",
      },
      {
        url: "https://api.hospitalsystem.com",
        description: "Servidor de producción",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Introduce el token JWT con `Bearer ` precediéndolo",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            data: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Detailed error information",
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/entities/*.ts", "./src/controllers/*.ts", "./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: any) {
  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/api-docs.json", (req: any, res: any) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`📚 Documentación disponible en http://localhost:${config.PORT}/api-docs`);
}

export default swaggerDocs;
