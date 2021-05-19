import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('boolean') completed;
  @attr('boolean') active;
  @attr('string') name;
}
