import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class GroupShowController extends Controller {
  @action
  deletePerson(person) {
    let { model: group } = this;
    group.people = group.people.filter(p => p.uuid !== person.uuid);
    group.save();
  }
}
