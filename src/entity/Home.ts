import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class Home {

  @PrimaryColumn()
  name: string;

  @Column()
  homecoming: number;
}