import { request } from 'undici';
import { AnnounceDeal } from '../types';

export class DealResource {
  constructor(private readonly baseUrl: string) { }

  async isNew(redditThreadIdentifier: string) {
    const response = await request(`${this.baseUrl}/deals/reddit/${redditThreadIdentifier}`);
    return response.statusCode === 404;
  }

  async announce(deal: AnnounceDeal) {
    const response = await request(`${this.baseUrl}/deals/announce`, {
      body: JSON.stringify(deal),
      method: 'POST',
    });
    return response.statusCode === 202;
  }
}
