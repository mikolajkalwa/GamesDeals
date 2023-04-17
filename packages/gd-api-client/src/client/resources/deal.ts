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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deal),
    });
    return response.statusCode === 202;
  }
}
