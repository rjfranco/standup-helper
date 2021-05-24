import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GroupShowRoute extends Route {
  @service store;

  model(params) {
    return this.store.queryRecord('group', { slug: params.group_name });
  }
}
