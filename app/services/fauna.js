import Service from '@ember/service';
import ENV from 'flow-person-list/config/environment';

export default class FaunaService extends Service {
  constructor() {
    super(...arguments);

    this.client = new faunadb.Client({ secret: ENV.APP.faunaSecret });
  }
}
