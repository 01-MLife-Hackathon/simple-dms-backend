import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class Extension {

  @PrimaryColumn()
  name: string;

  @Column()
  classNum: number;

  @Column()
  seatNum: number;
}