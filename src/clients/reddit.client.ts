import { request } from 'undici';

import type { Deal } from '../types/games-deal-api.type';
import { RedditResponse, RedditResponseSchema } from '../types/reddit.type';

export class RedditClient {
  constructor(private readonly baseUrl: string) { }

  public getTrendingDeals = async (): Promise<Deal[]> => {
    const response = await request(`${this.baseUrl}/r/GameDeals/hot/.json?limit=3`, { maxRedirections: 4 });
    const data = await response.body.json() as unknown;
    const redditData: RedditResponse = RedditResponseSchema.parse(data);

    return redditData.data.children.map((children) => ({
      id: children.data.id,
      url: children.data.url,
      title: children.data.title,
      author: children.data.author,
      over18: children.data.over_18,
    }));
  };
}
