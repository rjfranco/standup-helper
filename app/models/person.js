import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr completed;
  @attr active;
  @attr name;
}
