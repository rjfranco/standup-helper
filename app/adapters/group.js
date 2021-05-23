import ApplicationAdapter from './application';
import { inject as service } from '@ember/service';


export default class GroupAdapter extends ApplicationAdapter {
  @service fauna;
  
  titleize(str) {
    return str.replace(/^[a-z]|-[a-z]/g, (str) => str.toUpperCase());
  }

  findRecord(store, type, id) {
    let { Get, Index, Lambda, Map, Match, Paginate, Var } = faunadb.query;
    let name = this.titleize(id);
    return this.fauna.client.query(
      Map(
        Paginate(Match(Index('group_by_name'), name)),
        Lambda('X', Get(Var('X')))
      )
    ).then(response => ({ ...response.data[0].data, id: response.data[0].ref.value.id }))
  }
}
