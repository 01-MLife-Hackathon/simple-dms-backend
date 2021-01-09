import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class Homecoming {

  @PrimaryColumn()
  name: string;

  @Column()
  homecoming: number;
}