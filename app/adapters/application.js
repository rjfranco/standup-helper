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

  deleteRecord(store, type, snapshot) {
    let { Delete, Ref, Collection } = faunadb.query;
    let ref = snapshot.id;

    return this.fauna.client.query(
      Delete(Ref(Collection(this.typeNames[type.modelName]), ref))
    );
  }

  findAll(store, type) {
    let { Map, Paginate, Match, Index, Lambda, Get, Var } = faunadb.query;
    let typeName = this.typeNames[type.modelName];
    return this.fauna.client
      .query(
        Map(
          Paginate(Match(Index(`all_${typeName}`))),
          Lambda('X', Get(Var('X')))
        )
      )
      .then((response) => {
        return response.data.map((obj) => ({ ...obj.data, id: obj.ref.id }));
      });
  }
}
