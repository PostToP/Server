import path from "node:path";
import swaggerJSDoc from "swagger-jsdoc";

const routeDocGlobs = [path.resolve(process.cwd(), "src/api/docs/**/*.ts")];

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "postToP API",
      version: "1.0.0",
    },
  },
  apis: routeDocGlobs,
});
