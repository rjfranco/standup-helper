import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  @action
  deletePerson(person) {
    let confirmed = confirm('Are you sure you want to remove this person?');
    if (confirmed) person.destroyRecord();
  }
}
