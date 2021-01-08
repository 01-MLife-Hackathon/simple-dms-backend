import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Extension {

  @PrimaryGeneratedColumn()
  num: number;

  @Column()
  name: string;

  @Column()
  classNum: number;

  @Column()
  seatNum: number;
}