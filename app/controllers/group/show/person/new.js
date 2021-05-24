import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { v4 } from 'uuid';

export default class PersonNewController extends Controller {
  @service router;
  @service store;
  @tracked name = '';

  get hasNoName() {
    return !this.name;
  }

  @action
  savePerson(event) {
    event.preventDefault();
    let { model: group, name } = this;
    let person = {
      name,
      active: false,
      completed: false,
      uuid: v4()
    };
    group.people = [...(group.people || []), person];
    group.save();
    this.router.transitionTo('group.show');
  }
}
