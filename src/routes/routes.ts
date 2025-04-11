import { FastifyInstance } from "fastify";
import { register } from "../controllers/users.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
}
