import Service from '@ember/service';
import ENV from 'standup-helper/config/environment';

export default class FaunaService extends Service {
  constructor() {
    super(...arguments);

    this.client = new faunadb.Client({ secret: ENV.APP.faunaSecret });
  }

  // watchGroup() {
  //   let { Get, Index, Match, Select } = faunadb.query;
  //   console.log('this is saying the model is ... not there?', this.model)
  //   let docRef = Select(
  //     'ref',
  //     Get(Match(Index('group_by_name'), this.model.name))
  //   );
  //   this.faunadb.client.stream
  //     .document(docRef)
  //     .on('snapshot', (snapshot) => console.log('Snapshot is', snapshot))
  //     .on('version', (version) => console.log('Version is', version))
  //     .on('error', (error) => console.error('Error was', error));
  // }
}
