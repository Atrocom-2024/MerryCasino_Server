import { Entity, PrimaryColumn, Column, UpdateDateColumn } from "typeorm";

@Entity('tb_room')
export class Room {
  @PrimaryColumn({ name: 'room_id' })
  roomId!: number;

  @Column({ name: 'current_payout' })
  currentPayout!: number;

  @Column({ name: 'target_payout' })
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
}