// 랜덤한 6자리 숫자 생성 함수
export function generateRandomUsername(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6자리 랜덤 숫자 생성
  return `player${randomNum}`;
}