import { stacks } from 'src/drizzle/schema';
import { projectIdSets } from './projectsData';
import { userIds } from './usersData';
import { faker } from '@faker-js/faker';
import { taskIdSets } from './taskData';

export const stackIdSets = [
  [
    [
      'd6e1dd90-c96b-4dba-b0bd-f932323f31b5',
      '388c9b16-3e42-44d5-a565-e88b77beab21',
      '98df3629-14e7-4050-a157-fccb28b73966',
      'd90ac156-b5da-4e3b-8a62-65dbb2761ea4',
      '12825389-15dc-4a09-babc-b96d1c0e3b93',
    ],
    [
      'fa417f17-1bdd-4bb5-92b9-3d3c34192fb8',
      '991e9652-df09-4306-bb93-275ebfdff909',
      '5254ec9f-aae8-4172-ba96-01c768c2eaac',
      '43d9b004-5d38-43e5-8a1c-f38da1716667',
    ],
    [
      'a2998779-7331-4aaf-8abe-5407093ed16f',
      'ded3015c-67e5-430c-8ca0-505239ba29ff',
    ],
    [
      'fbcfaf7e-44d8-4300-87f5-bbbc7d9f3e50',
      'ee672f3a-d62f-4166-9272-a745cf8d9fd6',
      '1a1992e0-9247-4a68-92c0-753fa2f26ed2',
      '8465a0f7-e7ae-4240-8ec1-f6484116a7f1',
    ],
    ['26ac870c-410f-4f9c-8199-ed0a96c8b585'],
  ],
  [
    [
      '30884337-85ed-4a25-988d-0f727b08e7b1',
      'a2a6c81f-660e-499a-b86e-e9fe585f524d',
      '60e7995a-d9de-4304-86e4-d37614959e68',
      '6a6f86a3-4377-416c-86a3-12852758f38c',
      'cf8f4756-0507-42b9-9d91-c54e4deb0b2b',
      'eccc69e3-0099-4151-8565-419812239f1c',
    ],
    [
      'd07b87a5-11e9-4a06-a989-bc608a9d9cdb',
      '89f69111-7ce9-4e50-b797-269554f6570a',
      '6ff4681b-a4fa-4752-8515-9453d35db790',
    ],
    [
      '7276fefc-52dd-4e37-b220-ed8da3d57f9f',
      'd612082e-fdad-47f8-a817-eff48e877eee',
    ],
  ],
];

type Stack = typeof stacks.$inferInsert;

export function generateStacksData(): Stack[] {
  const stacks: Stack[] = [];

  for (let i = 0; i < userIds.length && i < stackIdSets.length; i++) {
    for (
      let j = 0;
      j < projectIdSets[i].length && j < stackIdSets[i].length;
      j++
    ) {
      for (
        let k = 0;
        k < stackIdSets[i][j].length && k < taskIdSets[i][j].length;
        k++
      ) {
        stacks.push({
          id: stackIdSets[i][j][k],
          userId: userIds[i],
          projectId: projectIdSets[i][j],
          title: faker.commerce.department(),
          color: faker.color.rgb(),
          taskOrder: taskIdSets[i][j][k],
        });
      }
    }
  }
  return stacks;
}
