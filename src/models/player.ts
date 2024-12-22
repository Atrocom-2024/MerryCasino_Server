import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { RoomPlayer } from "./roomPlayer";

@Entity('tb_player')
export class Player {
  @PrimaryColumn({ name: 'id' })
  id!: string;

  @Column({ name: 'username' })
  userName!: string;

  @Column({ name: 'coins' })
  coins!: number;

  @Column({ name: 'level', default: 1 })
  level!: number;

  @Column({ name: 'experience', default: 0 })
  experience!: number;

  @Column({ name: 'provider' })
  provider!: string;

  @CreateDateColumn({ type:'timestamp' })
  create_at!: Date;

  @OneToMany(() => RoomPlayer, (roomPlayer) => roomPlayer.player)
  roomPlayer!: RoomPlayer[];
}