import Adapter from '@ember-data/adapter';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends Adapter {
  @service fauna;

  typeNames = {
    person: 'people',
  };

  findAll(store, type) {
    let q = faunadb.query;
    let typeName = this.typeNames[type.modelName];
    return this.fauna.client
      .query(
        q.Map(
          q.Paginate(q.Match(q.Index(`all_${typeName}`))),
          q.Lambda('X', q.Get(q.Var('X')))
        )
      )
      .then((response) => response.data);
  }
}
