import { Router } from "express";
import {
  getPayout,
  getPayoutReturn,
  getTargetPayout,
  updateBet,
  updateWin
} from "../controllers/roomController";

const roomRoutes = Router();

roomRoutes.get('/:roomNumber/payout-return', getPayoutReturn);
// roomRoutes.get('/Payoutreturn/:roomNumber', (req, res) => {
//   res.send(roomList[req.params.roomNumber].returnEventValue.toString());
// });

roomRoutes.get('/:roomNumber/payout', getPayout);
// roomRoutes.get('/Payout/:roomNumber', (req, res) => {
//   res.send(roomList[req.params.roomNumber].resultplusPercent.toString());
// });

roomRoutes.post('/:roomNumber/win', updateWin);
// roomRoutes.get('/Win/:roomNumber/:betCoin', (req, res) => {
//   roomList[req.params.roomNumber].totalPayout += req.params.betCoin;
// });

roomRoutes.post('/:roomNumber/bet', updateBet);
// roomRoutes.get('/Wheel/:roomNumber/:betCoin', (req, res) => {
//   roomList[req.params.roomNumber].totalBet += req.params.betCoin;
// });

roomRoutes.get('/:roomNumber/target-payout', getTargetPayout);
// roomRoutes.get('/targetPayout/:roomNumber', (req, res) => {
//   res.send(roomList[req.params.roomNumber].targetPayout.toString());
// });

export default roomRoutes;