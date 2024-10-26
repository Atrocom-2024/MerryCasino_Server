import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('player_tb')
export class Player {
  @PrimaryColumn()
  id!: string;

  @Column()
  username!: string;

  @Column({ default: 0 })
  coin!: number;
}