ember-metrics-matomo-adapter
==============================================================================

An addon that provides a metrics-adapter for [Matomo](https://matomo.org/) for [ember-metrics](https://github.com/adopted-ember-addons/ember-metrics).

## Features (from ember-metrics)
  * Lazy initialization
  * Fastboot aware


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.16 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-metrics-matomo-adapter
```


Usage
------------------------------------------------------------------------------

Configure the adapter in `config/environment.js` as any other adapter for
ember-metrics:

```js
metricsAdapters: [
  {
    name: 'Matomo',
    environments: ['development', 'production'], // see ember-metrics docs
    config: {
      scriptUrl: '//cdn.matomo.cloud/<your-domain>.matomo.cloud',
      trackerUrl: 'https://<your-domain>.matomo.cloud',
      siteId: '<your-site-id>',
      disableCookies: true // <- for GDPR
    }
  }
]
```

You can use the adapter as you would any other `ember-metrics`-metrics-adapter:

```ts
// app/routes/application.ts

import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import MetricsService from 'ember-metrics/services/metrics';

export default class ApplicationRoute extends Route {
  @service declare readonly metrics: MetricsService;

  @service declare readonly router: RouterService;

  constructor() {
    super(...arguments);

    this.setupTracking();
  }

  private setupTracking() {
    this.router.on('routeDidChange', () => {
      const { currentURL, currentRouteName } = this.router;

      this.metrics.trackPage({
        page: currentURL,
        title: currentRouteName,
      });
    });
  }
}
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
