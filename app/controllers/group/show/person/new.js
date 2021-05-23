import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

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
    let { name } = this;
    let person = this.store.createRecord('person', { name });
    person.save().then(this.router.transitionTo('index'));
  }
}
