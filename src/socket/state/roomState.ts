// 방 상태를 관리하기 위한 전역 변수
const roomPlayers: { [roomId: number]: Array<string> } = {};

// 특정 룸에 유저 추가
export const addUserToRoom = (roomId: number, userId: string): void => {
  if (!roomPlayers[roomId]) {
    roomPlayers[roomId] = new Array();
  }
  roomPlayers[roomId].push(userId);
};

export const removeUserFromRoom = (roomId: number, userId: string): void => {
  if (roomPlayers[roomId]) {
    const newRoomPlayers = roomPlayers[roomId].filter((id) => id !== userId);
    roomPlayers[roomId] = newRoomPlayers;
    if (!roomPlayers[roomId].length) {
      delete roomPlayers[roomId]; // 방에 유저가 없으면 방 제거
    }
  }
};

export const getUsersInRoom = (roomId: number): string[] => {
  return roomPlayers[roomId] ? roomPlayers[roomId] : [];
};

export const getRoomList = (): string[] => {
  return Object.keys(roomPlayers);
};