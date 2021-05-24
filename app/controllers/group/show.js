import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GroupShowController extends Controller {
  @service fauna;

  constructor() {
    super(...arguments);
  }

  get alphaPeople() {
    return this.model?.people?.sortBy('name');
  }

  @action
  deletePerson(person) {
    let { model: group } = this;
    group.people = group.people.filter(p => p.uuid !== person.uuid);
    group.save();
  }
}
