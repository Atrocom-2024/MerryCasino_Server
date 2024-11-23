import { Router } from "express";
import {
  getPayout,
  getPayoutReturn,
  getTargetPayout,
  updateTotalBet,
  updateTotalPayout
} from "../controllers/roomController";

const roomRoutes = Router();

roomRoutes.get('/:roomNumber/payout', getPayout);
roomRoutes.get('/:roomNumber/payout-return', getPayoutReturn);
roomRoutes.get('/:roomNumber/target-payout', getTargetPayout);
roomRoutes.post('/:roomNumber/bet', updateTotalBet);
roomRoutes.post('/:roomNumber/win', updateTotalPayout);

export default roomRoutes;