import { request } from 'undici';
import type { Deal } from '../types/games-deal-api.type';
import { RedditResponse, RedditResponseSchema } from '../types/reddit.type';

export class RedditClient {
  private readonly gameDealsUrl: string;
  private readonly maxRedirections = 4;

  constructor(baseUrl: string) { 
    this.gameDealsUrl = `${baseUrl}/r/GameDeals/hot/.json?limit=3`
  }

  private async fetchTrendingDeals() {
    const response = await request(this.gameDealsUrl, { maxRedirections: this.maxRedirections });
    const data = await response.body.json();

    return RedditResponseSchema.parse(data);
  }

  public async getTrendingDeals(): Promise<Deal[]> {
    const redditResponse: RedditResponse = await this.fetchTrendingDeals();

    return redditResponse.data.children.map((children) => ({
      id: children.data.id,
      url: children.data.url,
      title: children.data.title,
      author: children.data.author,
      over18: children.data.over_18,
    }));
  };
}
