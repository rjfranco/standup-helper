import ApplicationAdapter from './application';
import { inject as service } from '@ember/service';

export default class GroupAdapter extends ApplicationAdapter {
  @service fauna;

  watchList = {};

  titleize(str) {
    return str.replace(/^[a-z]|-[a-z]/g, (str) => str.toUpperCase());
  }

  findRecord(store, type, id) {
    let { Collection, Get, Lambda, Map, Ref, Var } = faunadb.query;
    return this.fauna.client
      .query(
        Map(Ref(Collection(type.modelName), id), Lambda('X', Get(Var('X'))))
      )
      .then((response) => ({
        ...response.data[0].data,
        id: response.data[0].ref.value.id,
      }));
  }

  queryRecord(store, type, { slug }) {
    let { Get, Index, Lambda, Map, Match, Paginate, Var } = faunadb.query;
    let name = this.titleize(slug);
    let query = Match(Index('group_by_name'), name);
    return this.fauna.client
      .query(Map(Paginate(query), Lambda('X', Get(Var('X')))))
      .then((response) => {
        let id = response.data[0].ref.value.id;
        this.watchRecord(name, id);
        return { ...response.data[0].data, id };
      });
  }

  updateRecord(store, type, snapshot) {
    let { Get, Index, Match, Select, Update } = faunadb.query;
    let data = this.serialize(snapshot);

    return this.fauna.client
      .query(
        Update(Select('ref', Get(Match(Index('group_by_name'), data.name))), {
          data,
        })
      )
      .then((response) => ({ ...response.data, id: response.ref.id }));
  }

  watchRecord(name, id) {
    if (this.watchList[name]) return;

    let { Collection, Ref } = faunadb.query;
    let docRef = Ref(Collection('groups', id));
    this.watchList[name] = this.fauna.client.stream
      .document(docRef)
      .on('snapshot', (snapshot) => {
        console.log('Snapshot came in:', snapshot);
      })
      .on('version', (version) => {
        console.log('version came in:', version);
      })
      .on('error', (error) => {
        console.log('Error:', error);
        this.watchList[name].close();
        setTimeout(() => {
          this.watchRecord(name, docRef);
        }, 1000);
      })
      .start();
  }
}
