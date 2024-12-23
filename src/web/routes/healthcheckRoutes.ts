import { Router } from "express";
import { getHealthcheck } from "../controllers/healthcheckController";

const healthcheckRoutes = Router();

healthcheckRoutes.get('/', getHealthcheck);

export default healthcheckRoutes;