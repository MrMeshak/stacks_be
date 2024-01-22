import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { UniqueEnforcer } from 'enforce-unique';
import { users } from 'src/drizzle/schema';

const uniqueEnforcerEmail = new UniqueEnforcer();

export const userIds = [
  '5dfbdfcf-6ff8-4f3e-a10c-8ebe822ee6ab',
  'e97f783a-8527-4a15-b693-0ff6068296d1',
];

type User = typeof users.$inferInsert;

export async function generateUsersData(): Promise<User[]> {
  const users: User[] = [];
  const password = await bcrypt.hash('password', 10);

  userIds.forEach((id) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = uniqueEnforcerEmail.enforce(() =>
      faker.internet.email({ firstName: firstName, lastName: lastName }),
    );

    users.push({
      id,
      email,
      firstName,
      lastName,
      password,
    });
  });

  return users;
}
