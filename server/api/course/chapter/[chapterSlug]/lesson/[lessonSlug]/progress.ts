import { PrismaClient } from '@prisma/client';
import protectRoute from '@/server/utils/protectRoute';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  assertMethod(event, ['POST', 'PATCH', 'PUT']);
  protectRoute(event);

  const { chapterSlug, lessonSlug } = event.context.params;

  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      // Filter by related Chapter using the correct relation field name
      // as defined in prisma/schema.prisma ("Chapter")
      Chapter: {
        is: {
          slug: chapterSlug,
        },
      },
    },
  });
  if (!lesson) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lesson not found',
    });
  }

  const { completed } = await readBody(event);

  const {
    user: { email: userEmail },
  } = event.context;

  return prisma.lessonProgress.upsert({
    where: {
      lessonId_userEmail: {
        lessonId: lesson.id,
        userEmail,
      },
    },
    update: {
      completed,
    },
    create: {
      Lesson: {
        connect: {
          id: lesson.id,
        },
      },
      userEmail,
      completed,
    },
  });
});
