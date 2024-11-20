import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity('TB_PLAYER')
export class Player {
  @PrimaryColumn()
  id!: string;

  @Column()
  username!: string;

  @Column({ default: 0 })
  coins!: number;

  @Column({ default: 1 })
  level!: number;

  @Column({ default: 0 })
  experience!: number;

  @Column()
  provider!: string;

  @CreateDateColumn({ type:'timestamp' })
  create_at!: Date;
}