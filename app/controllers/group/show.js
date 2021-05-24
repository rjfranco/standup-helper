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
    let confirmed = confirm('Are you sure you want to delete this person?');
    if (!confirmed) return;

    let { model: group } = this;
    group.people = group.people.filter(p => p.uuid !== person.uuid);
    group.save();
  }

  @action
  resetPeople() {
    let { model: group } = this;
    for (let person of group.people) {
      person.active = false;
      person.completed = false;
    }
    group.save();
  }

  @action
  toggleCompleted(personId) {
    let { model: group } = this;
    let person = group.people.findBy('uuid', personId);
    person.completed = !person.completed;
    group.save();
  }
}
