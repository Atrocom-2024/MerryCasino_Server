import { Router } from "express";
import {
  getPayout,
  getPayoutReturn,
  getTargetPayout,
  updateBet,
  updateWin
} from "../controllers/roomController";

const roomRoutes = Router();

roomRoutes.get('/:roomNumber/payout', getPayout);
roomRoutes.get('/:roomNumber/payout-return', getPayoutReturn);
roomRoutes.get('/:roomNumber/target-payout', getTargetPayout);
roomRoutes.post('/:roomNumber/win', updateWin);
roomRoutes.post('/:roomNumber/bet', updateBet);

export default roomRoutes;