import { Entity, PrimaryColumn, Column, UpdateDateColumn, OneToMany } from "typeorm";
import { RoomPlayer } from "./roomPlayer";

@Entity('tb_room')
export class Room {
  @PrimaryColumn({ name: 'room_id' })
  roomId!: number;

  @Column({ name: 'target_payout', type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  targetPayout!: number;

  @Column({ name: 'total_bet' })
  totalBet!: number;

  @Column({ name: 'total_user' })
  totalUser!: number;

  @Column({ name: 'max_bet' })
  maxBet!: number;

  @Column({ name: 'max_user' })
  maxUser!: number;

  @UpdateDateColumn({ name: 'updated_at', type:'timestamp' })
  updatedAt!: Date; // 배팅 시간

  // RoomPlayer와의 관계 설정
  @OneToMany(() => RoomPlayer, (roomPlayer) => roomPlayer.room)
  roomPlayers!: RoomPlayer[]; // 이 룸에 연결된 RoomPlayer들
}