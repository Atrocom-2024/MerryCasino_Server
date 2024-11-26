import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne
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

  @Column({ name: 'current_payout', default: 0.00 })
  currentPayout!: number;

  @Column({ name: 'bet_amount', default: 0 })
  betAmount!: number; // 배팅 금액

  @CreateDateColumn({ name: 'update_at', type:'timestamp' })
  updateAt!: Date; // 배팅 시간

  // 유저와의 관계 설정 (ManyToOne)
  @ManyToOne(() => Player, (player) => player.id, { onDelete: 'CASCADE' })
  player!: Player;

  // 룸과의 관계 설정 (ManyToOne)
  @ManyToOne(() => Room, (room) => room.roomId, { onDelete: 'CASCADE' })
  room!: Room;
}