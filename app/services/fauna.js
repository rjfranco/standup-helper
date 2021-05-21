import Service from '@ember/service';
import ENV from 'standup-helper/config/environment';

export default class FaunaService extends Service {
  constructor() {
    super(...arguments);

    this.client = new faunadb.Client({ secret: ENV.APP.faunaSecret });
  }
}
