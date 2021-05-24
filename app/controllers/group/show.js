import Controller from '@ember/controller';
import { action } from '@ember/object';
import { sort } from '@ember/object/computed';

export default class GroupShowController extends Controller {
  @sort('model.people', function(a, b) {
    if (a.name > b.name) {
      return 1;
    } else if (b.name > a.name) {
      return -1;
    }

    return 0;
  })
  alphaPeople;

  @action
  deletePerson(person) {
    let { model: group } = this;
    group.people = group.people.filter(p => p.uuid !== person.uuid);
    group.save();
  }
}
