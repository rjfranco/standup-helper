import EmberRouter from '@ember/routing/router';
import config from 'standup-helper/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('group', { path: '/' }, function () {
    this.route('show', { path: '/:group_name' }, function () {
      this.route('person', function () {
        this.route('new');
      });
    });
  });
});
