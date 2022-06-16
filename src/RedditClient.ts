import got from 'got';
import { Deal } from './types/GamesDealsApi';
import { RedditResponse, RedditResponseSchema } from './types/Reddit';

export default class RedditClient {
  constructor(private readonly baseUrl: string) { }

  public getTrendingDeals = async (): Promise<Deal[]> => {
    const redditData = await got.get(`${this.baseUrl}/r/GameDeals/hot/.json?limit=3`).json<RedditResponse>();
    RedditResponseSchema.parse(redditData);

    return redditData.data.children.map((children) => ({
      id: children.data.id,
      url: children.data.url,
      title: children.data.title,
      author: children.data.author,
      over18: children.data.over_18,
    }));
  };
}
