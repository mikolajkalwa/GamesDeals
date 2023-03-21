import { z } from 'zod';

export const RedditResponseSchema = z.object({
  data: z.object({
    children: z.array(
      z.object({
        data: z.object({
          id: z.string(),
          url: z.string(),
          title: z.string(),
          author: z.string(),
          over_18: z.boolean(),
        }),
      }),
    ),
  }),
});

export type RedditResponse = z.infer<typeof RedditResponseSchema>;
