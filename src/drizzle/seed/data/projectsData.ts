import { projects } from 'src/drizzle/schema';
import { userIds } from './usersData';
import { faker } from '@faker-js/faker';
import { stackIdSets } from './stacksData';

export const projectIdSets = [
  [
    'e3205a1b-71c2-4894-80cd-21b846131b4e',
    '0dcc2ab4-c4ca-4b91-8a30-0b336eff52c9',
    '33248530-fa3d-4c5b-8410-17978ea57422',
    '2fdbc291-8ec3-4168-9d1b-75e939303be1',
  ],
  [
    'c934ed41-e0d6-4226-8b1b-bc9b11d03091',
    '23e2bccb-ab37-4436-9478-f3f626bf26a6',
    'b64c2769-576d-4c41-a22a-0f59ad76fbb1',
  ],
];

type Project = typeof projects.$inferInsert;

export function generateProjectsData(): Project[] {
  const projects: Project[] = [];

  for (let i = 0; i < userIds.length && i < projectIdSets.length; i++) {
    for (let j = 0; j < projectIdSets[i].length; j++) {
      projects.push({
        id: projectIdSets[i][j],
        userId: userIds[i],
        title: faker.company.buzzPhrase(),
        stackOrder: stackIdSets[i][j],
      });
    }
    projectIdSets[i].forEach((id) => {});
  }
  return projects;
}
