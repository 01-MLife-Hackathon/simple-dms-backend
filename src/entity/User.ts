import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  num: number;

  @Column()
  name: string;

  @Column()
  id: string;

  @Column()
  password: string;
}