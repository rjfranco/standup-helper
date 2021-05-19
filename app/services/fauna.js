import Service from '@ember/service';
import ENV from 'flow-person-list/config/environment';
import faunadb, { query } from 'faunadb';

export default class FaunaService extends Service {
  constructor() {
    super(...arguments);
    // console.log('what is this secret', ENV.APP.faunaSecret)

    this.client = new faunadb.Client({ secret: ENV.APP.faunaSecret });
  }
}
