import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity('player_tb')
export class Player {
  @PrimaryColumn()
  id!: string;

  @Column()
  username!: string;

  @Column({ default: 0 })
  coin!: number;

  @Column()
  provider!: string;

  @CreateDateColumn({ type:'timestamp' })
  create_at!: Date;
}