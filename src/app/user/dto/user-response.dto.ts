import { Exclude } from 'class-transformer';
import { users } from 'src/drizzle/schema';

type User = typeof users.$inferSelect;

export class UserResponseDto implements User {
  id: string;
  email: string;
  @Exclude()
  password: string;
  @Exclude()
  userStatus: string;
  firstName: string;
  lastName: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
}
