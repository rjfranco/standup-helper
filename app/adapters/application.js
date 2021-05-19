import Adapter from '@ember-data/adapter';

export default class ApplicationAdapter extends Adapter {
  findAll(store, type) {
    return [{ id: 1, name: 'hi', completed: false, active: false }];
  }
}
