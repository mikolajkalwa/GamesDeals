import got from 'got';
import { inject, injectable } from 'tsyringe';
import { RedditResponse } from './types/Reddit';

export interface RedditDealData {
  id: string;
  url: string;
  title: string;
  author: string;
  over18: boolean;
}

export interface IRedditClient {
  getTrendingDeals(): Promise<RedditDealData[]>;
}

@injectable()
export class RedditClient implements IRedditClient {
  constructor(@inject('redditBaseUrl') private readonly baseUrl: string) { }

  private fetchReddit = async () => await got.get(`${this.baseUrl}/r/GameDeals/hot/.json?limit=3`).json() as RedditResponse;

  public getTrendingDeals = async (): Promise<RedditDealData[]> => {
    const redditData = await this.fetchReddit();
    return redditData.data.children.map((c) => {
      const {
        data: {
          id, url, title, author, over_18: over18,
        },
      } = c;
      return {
        id, url, title, author, over18,
      };
    });
  };
}
