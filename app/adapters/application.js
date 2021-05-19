import Adapter from '@ember-data/adapter';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends Adapter {
  @service fauna;

  findAll(store, type) {
    console.log('do I have a client?', this.fauna.client, this.fauna);
    return [{ id: 1, name: 'hi', completed: false, active: false }];
  }
}
