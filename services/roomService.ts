import { readFile } from "fs";

import { RoomTypes } from "../types/roomInfo";

const modifyValueFilePath = 'data/modifyValue.json';
const roomList: RoomTypes[] = [];

// 수정 가능한 Value들
let minimumTime: number;
let maximumTime: number;
let plusValue: number;
let targetPayoutArray: [];
let basePayoutArray: [];

export const readlocalJson = () => {
  readFile(modifyValueFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('파일 읽기 오류:', err);
      return;
    }
    try {
      // JSON 데이터를 JavaScript 객체로 파싱
      const jsonData = JSON.parse(data);
      basePayoutArray = jsonData.basePayout;
      targetPayoutArray = jsonData.targetPayout;
      minimumTime = jsonData.minimumTime;
      maximumTime = jsonData.maximumTime;
      plusValue = (maximumTime - minimumTime) / minimumTime;

      for (let i = 0; i <= 9; i++) {
        const room = {
          spandTime: 0,
          sum: 1,
          resultplusPercent: 1 / maximumTime,
          totalBet: 0,
          totalPayout: 0,
          targetPayout: targetPayoutArray[i],
          basePayout: basePayoutArray[i],
          returnEventValue: false
        };
        roomList.push(room);
      }
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
    }
  });
}

export const getRoomList = () => {
  return roomList;
}

export const startRoomUpdates = (): void => {
  setTimeout(() => {
    setInterval(increaseRoomTime, 1000);
  }, 1000);
};

function increaseRoomTime(): void {
  for (let i = 0; i < roomList.length; i++) {
    addRandomNumber(roomList[i]);
  }
}

function addRandomNumber(room: RoomTypes): void {
  room.spandTime += 1;
  if ((room.totalBet * 1.1 <= room.totalPayout && room.totalBet > 0) || room.spandTime === maximumTime) {
    resetEvent(room);
  } else if (room.sum < maximumTime) {
    const randomNumber = getRandomNumber();
    room.sum += randomNumber;
    room.resultplusPercent = room.sum / maximumTime;
  }
}

function getRandomNumber(): number {
  return Math.random() * plusValue + 1.0; // 1.0에서 1.0 + plusValue 사이의 랜덤 값
}

function resetEvent(room: RoomTypes): void {
  room.spandTime = 0;
  room.sum = 1;
  room.totalBet = 0;
  room.totalPayout = 0;
  room.returnEventValue = true;
  room.resultplusPercent = 1 / maximumTime;

  setTimeout(() => {
    room.returnEventValue = false;
  }, 5000);
}