import { H3Event } from 'h3';

export default (event: H3Event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message:
        'You must be logged in to access this resource.',
    });
  }
};
