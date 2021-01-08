import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Homecoming {

  @PrimaryGeneratedColumn()
  num: number;

  @Column()
  name: string;

  @Column()
  homecoming: number;
}