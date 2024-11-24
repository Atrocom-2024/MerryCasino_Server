import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { BetRecord } from "./bet_record";

@Entity('tb_player')
export class Player {
  @PrimaryColumn({ name: 'id' })
  id!: string;

  @Column({ name: 'username' })
  userName!: string;

  @Column({ name: 'coins', default: 0 })
  coins!: number;

  @Column({ name: 'level', default: 1 })
  level!: number;

  @Column({ name: 'experience', default: 0 })
  experience!: number;

  @Column({ name: 'provider' })
  provider!: string;

  @CreateDateColumn({ type:'timestamp' })
  create_at!: Date;

  @OneToMany(() => BetRecord, (betRecord) => betRecord.player)
  bet_record!: BetRecord[];
}