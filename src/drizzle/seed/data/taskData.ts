import { tasks } from 'src/drizzle/schema';
import { projectIdSets } from './projectsData';
import { stackIdSets } from './stacksData';
import { userIds } from './usersData';
import { faker } from '@faker-js/faker';
import { min } from 'drizzle-orm';

export const taskIdSets = [
  [
    [
      [
        '2bca2fda-dee0-4abe-a8e0-f8b48d5b5b31',
        '0c0740ac-1e23-4d93-8019-9127ec0a197f',
        '24460e72-16cc-4a54-9012-d14b967e3bcf',
      ],
      [
        '672e9654-9b7a-4da7-9237-4b1571766061',
        '82d34556-deab-48ef-a720-86f939f9e1be',
        '3b6f5310-e65a-4e7d-b456-7cf91f0aee7e',
        'e2db8b2f-69a3-4dfb-bb94-972f7256c1ab',
      ],
      [
        '27e44bca-b190-46c2-98d2-4f15a83bf7ef',
        '8479ffac-8e11-4188-8438-de4306660a43',
        'a0022a61-e1c7-4a59-b822-091a9733adf5',
      ],
      ['fe556f8b-6b44-4ff7-940a-54ff77b485eb'],
      [
        '4c5dc127-d73d-47d9-8665-06ee56b2c22d',
        'd3cceb50-6195-4e69-9296-a39a46b19395',
      ],
    ],
    [
      [
        '9685bdaa-5813-483b-984a-d21735ac72ba',
        '5c020796-0039-46d8-aade-2dcae6f79069',
        '393acc32-65ca-48a6-bf41-b94135013711',
        'b7ffa7e0-787f-48f0-9954-4e2da3938240',
      ],
      [
        '28f68d23-b0c5-4599-b25b-ca9b55e89cd6',
        '7698847e-a350-46c6-898a-d474ec920f17',
      ],
      [
        'f27b67fa-7dd6-496c-b760-d850ed0a0f07',
        'f3f5b047-40fc-401c-805a-09fc4d10b878',
        'da02b629-ccdc-4938-a031-7eb10d6d3935',
      ],
      ['0ace60d7-7268-48ca-920c-76e1c674c62d'],
    ],
    [
      [
        'dbcf82d6-492f-4503-a618-bacee6b0443b',
        'bff084a7-5265-4e54-b519-8f61d6fb556a',
        '9d35e66f-4f22-46dc-9cf9-4b7a881484c2',
        '094ce333-484d-44f0-9c75-1b96940ec643',
      ],
      [
        'a7c66bc4-0833-4a2d-b4c3-363c960afc20',
        '6ae8823d-307d-428a-b373-005999d663f8',
      ],
    ],
    [
      [
        'b5d7d29d-de4a-4811-84cd-ae5e6650d190',
        'f39a9684-92fb-4270-97ee-a083b3ccb343',
      ],
      [
        '342d33f3-5ce2-4e31-978d-a88ab85d670e',
        '3d3bca49-db48-4925-8ce4-8e2698a1c3e7',
        'b669e7ec-5b46-46f0-a374-68beba286fb1',
      ],
      ['a33d3332-c31e-4e5d-925b-2beef21eb90b'],
      [
        '4a349382-f39a-4c95-bb81-fea1408d2aef',
        'ce46cc7c-21a9-487a-8389-42d442d60c2b',
        '8f7bc847-b190-4d5e-a558-233008e976ff',
        '9bf8206a-f50d-4c79-907a-8bccc0fe4e4e',
      ],
    ],
    [
      [
        '57e6a92a-8ffa-45ec-ad68-2fe2a97b306a',
        'f3b0c843-9e7b-4a49-bbfe-fac952f3ca82',
        'd6abeebe-7584-4490-a2b0-d3a1d6ea7162',
      ],
    ],
  ],
  [
    [
      [
        '76d09377-f000-4017-954c-e5e4d7a48cc4',
        '0b5bcc92-a2b6-4b59-9607-86d343084bfb',
      ],
      [
        '8bbc679e-c716-4e85-8bb9-ca64bf1d29ff',
        '9decd811-c5f5-4d11-b05b-414d7f4fbfe7',
      ],
      [
        '3ad9a47f-b644-43e8-9c0f-fc7e84337b5c',
        '88ce434a-9ca2-496a-92f1-86d5f657d4e9',
        '4a9df4bc-b284-4c22-9a72-57c9cb384c42',
        'edcfbb06-4886-449d-8b75-fefbb3b1472c',
      ],
      [
        '622bbf96-5532-46d7-a9be-6103b28f8b10',
        '56feeb66-081b-4f5f-832a-1ac44e908348',
        '32c186b8-7bc0-4150-808e-42672b4cb73e',
      ],
      ['0162a2ce-8a69-41f5-b202-ef6504313c62'],
      ['1bc94c58-f00b-4afd-ad84-9125fc03e21a'],
    ],
    [
      ['6e6dc9a0-5ae8-4d2f-ac91-678d53f7a679'],
      ['707c7bef-b545-462b-9d7e-5325b2a0075d'],
      ['5f7013a2-c237-4a51-a243-9b9403039f79'],
    ],
    [
      ['ff135432-7af2-4f12-81cf-063b6ecd7447'],
      ['53d7947c-46b4-4f30-afd3-be6c444681e4'],
    ],
  ],
];

type Task = typeof tasks.$inferInsert;

export function generateTasksData(): Task[] {
  const tasks: Task[] = [];

  for (let i = 0; i < userIds.length && i < projectIdSets.length; i++) {
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
        for (let l = 0; l < taskIdSets[i][j][k].length; l++) {
          tasks.push({
            id: taskIdSets[i][j][k][l],
            userId: userIds[i],
            stackId: stackIdSets[i][j][k],
            title: faker.lorem.words({ min: 1, max: 5 }),
            description: faker.lorem.paragraph({ min: 1, max: 3 }),
          });
        }
      }
    }
  }
  return tasks;
}
