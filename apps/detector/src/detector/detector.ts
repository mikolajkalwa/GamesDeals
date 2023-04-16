import { GamesDealsApiClient } from 'gd-api-client';
import { RedditClient } from '../reddit/reddit.client';
import { Deal } from '../reddit/reddit.type';
import { isFree } from './detector.utils';

export class Detector {
  constructor(
    private readonly gdApiClient: GamesDealsApiClient,
    private readonly redditClient: RedditClient,
  ) { }

  private getDealsToAnnounce = async (deals: Deal[]) => (
    await Promise.all(deals.map(async (deal) => {
      if (deal.over18) {
        return null;
      }

      if (isFree(deal.title)) {
        const isNew = await this.gdApiClient.deal.isNew(deal.id);
        if (isNew) {
          return deal;
        }
      }

      return null;
    }))).filter(Boolean) as Deal[];

  public detect = async () => {
    const trending = await this.redditClient.getTrendingDeals();
    const toAnnounce = await this.getDealsToAnnounce(trending);

    await Promise.allSettled(toAnnounce.map(async (deal) => await this.gdApiClient.deal.announce({
      author: deal.author,
      gameUrl: deal.url,
      redditId: deal.id,
      redditTitle: deal.title,
    })));
  };
}
