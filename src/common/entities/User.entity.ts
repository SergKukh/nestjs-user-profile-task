import { Column, OneToMany, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { ProfileImage } from './ProfileImage.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ default: null, nullable: true })
  firstName: string;

  @Column({ default: null, nullable: true })
  lastName: string;

  @Column({ default: null, nullable: true, select: false })
  emailConfirmKey: string;

  @Column({ default: false, nullable: false })
  isEmailConfirmed: boolean;

  @OneToMany(() => ProfileImage, (profileImage) => profileImage.user)
  profileImage: ProfileImage[];
}
