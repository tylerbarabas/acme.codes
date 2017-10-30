(function (app) {
  'use strict';

  app.registerModule('coderunner', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('coderunner.admin', ['core.admin']);
  app.registerModule('coderunner.admin.routes', ['core.admin.routes']);
  app.registerModule('coderunner.services');
  app.registerModule('coderunner.routes', ['ui.router', 'core.routes', 'coderunner.services']);
}(ApplicationConfiguration));
