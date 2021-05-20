import Adapter from '@ember-data/adapter';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends Adapter {
  @service fauna;

  typeNames = {
    person: 'people',
  };

  createRecord(store, type, snapshot) {
    let q = faunadb.query;
    let data = this.serialize(snapshot);
    return this.fauna.client
      .query(q.Create(q.Collection(this.typeNames[type.modelName]), { data }))
      .then((response) => ({ ...response.data, id: response.ref.id }));
  }

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
      .then((response) => {
        return response.data.map((obj) => ({ ...obj.data, id: obj.ref.id }));
      });
  }
}
