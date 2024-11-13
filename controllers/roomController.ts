import { Request, Response } from "express";
import { getRoomList } from "../services/roomService";

const roomList = getRoomList(); // 또는 외부에서 import하는 방식으로 사용할 수도 있음

// 특정 room의 returnEventValue 조회
export const getPayoutReturn = (req: Request, res: Response) => {
  console.log("특정 room payout return 조회");

  const roomNumber = parseInt(req.params.roomNumber, 10);

  if (!roomList[roomNumber]) {
    res.status(404).send('Room not found');
    return;
  }

  res.send(roomList[roomNumber].returnEventValue.toString());
  return;
};

// 특정 room의 resultplusPercent 조회
export const getPayout = (req: Request, res: Response) => {
  console.log("특정 room payout 조회");

  const roomNumber = parseInt(req.params.roomNumber, 10);

  if (!roomList[roomNumber]) {
    res.status(404).send('Room not found');
    return;
  }

  res.send(roomList[roomNumber].resultplusPercent.toString());
  return;
};

// 특정 room의 targetPayout 조회
export const getTargetPayout = (req: Request, res: Response) => {
  console.log("특정 room targetPayout 조회");

  const roomNumber = parseInt(req.params.roomNumber, 10);

  if (!roomList[roomNumber]) {
    res.status(404).send('Room not found');
    return;
  }

  res.send(roomList[roomNumber].targetPayout.toString());
  return;
};

// 특정 room의 totalPayout 갱신
export const updateWin = (req: Request, res: Response) => {
  console.log("특정 room totalPayout 설정 요청");

  const roomNumber = parseInt(req.params.roomNumber, 10);
  const betCoin = parseFloat(req.body.betCoin);

  if (!roomList[roomNumber]) {
    res.status(404).send('Room not found');
    return;
  }

  roomList[roomNumber].totalPayout += betCoin;
  res.send(`Total payout updated for room ${roomNumber}`);
  return;
};

// 특정 room의 totalBet 갱신
export const updateBet = (req: Request, res: Response) => {
  console.log("특정 room totalBet 설정 요청");

  const roomNumber = parseInt(req.params.roomNumber, 10);
  const betCoin = parseFloat(req.body.betCoin);

  if (!roomList[roomNumber]) {
    res.status(404).send('Room not found');
    return;
  }

  roomList[roomNumber].totalBet += betCoin;
  res.send(`Total bet updated for room ${roomNumber}`);
  return;
};