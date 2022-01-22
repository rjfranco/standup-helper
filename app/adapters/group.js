import ApplicationAdapter from './application';
import { inject as service } from '@ember/service';

export default class GroupAdapter extends ApplicationAdapter {
  @service fauna;
  @service store;

  watchList = {};

  titleize(str) {
    return str
      .replace(/^[a-z]|-[a-z]/g, (str) => str.toUpperCase())
      .replace(/-/g, ' ');
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

  pushRecord(document) {
    let { data, ts } = document;
    let { id } = document.ref.value;
    this.store.push({
      data: {
        id,
        type: 'group',
        attributes: { ...data, ts },
      },
    });
  }

  queryRecord(store, type, { slug }) {
    let { Get, Index, Lambda, Map, Match, Paginate, Var } = faunadb.query;
    let name = this.titleize(slug);
    let query = Match(Index('group_by_name'), name);
    return this.fauna.client
      .query(Map(Paginate(query), Lambda('X', Get(Var('X')))))
      .then((response) => {
        let { id } = response.data[0].ref.value;
        let { ts } = response.data[0];
        this.watchRecord(name, id);
        return { ...response.data[0].data, id, ts };
      });
  }

  updateRecord(store, type, snapshot) {
    let { Get, Index, Match, Select, Update } = faunadb.query;
    let data = this.serialize(snapshot);
    delete data.ts; // don't send ts ref back to the store

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
    let docRef = Ref(Collection('groups'), id);

    this.watchList[name] = this.fauna.client.stream
      .document(docRef)
      .on('version', (version) => {
        this.pushRecord(version.document);
      })
      .on('error', (error) => {
        console.error('Error:', error);
        this.watchList[name].close();
        delete this.watchList[name];
      })
      .start();
  }
}
