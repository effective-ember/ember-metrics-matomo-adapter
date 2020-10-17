ember-metrics-matomo-adapter [![Build Status](https://travis-ci.org/effective-ember/ember-metrics-matomo-adapter.svg?branch=master)](https://travis-ci.org/effective-ember/ember-metrics-matomo-adapter)
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

### Matomo-specific methods

Matomo implements some methods that aren't part of `ember-metrics` [main api](https://github.com/adopted-ember-addons/ember-metrics#api). These methods can be called through `ember-metrics` `invoke`.  
Below is a list of Matomo-specific methods that are implemented by `ember-metrics-matomo-adapter`.

- [`trackSiteSearch`](https://developer.matomo.org/guides/tracking-javascript-guide#internal-search-tracking)
  ```js
  this.metrics.invoke('trackSiteSearch', {
    keyword: 'myKeyWord',
    category: 'myCategory',
    searchCount: 2,
  });

  ```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
