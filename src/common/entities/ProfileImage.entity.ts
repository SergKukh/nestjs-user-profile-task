import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProfileImageSizes } from '@constants/files';
import { User } from './User.entity';

@Entity()
export class ProfileImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ProfileImageSizes,
    nullable: false,
    default: ProfileImageSizes.ORIGINAl,
  })
  size: ProfileImageSizes;

  @Column({ default: null, nullable: true })
  link: string;

  @ManyToOne(() => User, (user) => user.profileImage)
  user: User;
}
