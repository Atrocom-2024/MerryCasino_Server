import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";

import { Player } from "./player";
import { Room } from "./room";

@Entity('tb_room_player')
export class RoomPlayer {
  @PrimaryGeneratedColumn({ name: 'room_user_id' })
  roomUserId!: number; // 배팅 기록 ID

  @Column({ name: 'user_id' })
  userId!: string; // 배팅한 유저 ID

  @Column({ name: 'room_id' })
  roomId!: number; // 배팅이 발생한 룸 ID

  @Column({ name: 'current_payout', type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  currentPayout!: number;

  @Column({ name: 'bet_amount', default: 0 })
  betAmount!: number; // 배팅 금액

  @CreateDateColumn({ name: 'update_at', type:'timestamp' })
  updateAt!: Date; // 배팅 시간

  // Player와의 관계 설정
  @ManyToOne(() => Player, (player) => player.roomPlayer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // 이 부분이 중요한데, 데이터베이스 컬럼명과 맞춰야 합니다
  player!: Player;

  // Room과의 관계 설정 (room_id)
  @ManyToOne(() => Room, (room) => room.roomPlayers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' }) // room_id를 외래 키로 설정
  room!: Room;
}