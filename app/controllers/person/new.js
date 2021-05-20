import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class PersonNewController extends Controller {
  @tracked name = '';

  get hasNoName() {
    return !this.name;
  }
}
