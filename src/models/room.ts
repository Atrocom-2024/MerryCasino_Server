import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('tb_room')
export class Room {
  @PrimaryColumn()
  room_id!: number;

  @Column()
  current_payout!: number;

  @Column()
  target_payout!: number;

  @Column()
  total_bet!: number;

  @Column()
  total_user!: number;

  @Column()
  max_bet!: number;

  @Column()
  max_user!: number;
}