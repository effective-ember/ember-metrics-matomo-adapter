import { waitUntil } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

const MY_TRACKER_URL = 'https://<your-matomo-account>.matomo.cloud';
const MY_SITE_ID = '1';

const DEFAULT_INIT_COMMANDS = [
  ['disableCookies'],
  ['setTrackerUrl', `${MY_TRACKER_URL}/matomo.php`],
  ['setSiteId', MY_SITE_ID],
];

module('Integration | Component | matomo', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('config:metrics', {
      metricsAdapters: [
        {
          name: 'Matomo',
          environments: ['all'],
          config: {
            scriptUrl: '//cdn.matomo.cloud/<your-matomo-account>.matomo.cloud',
            trackerUrl: MY_TRACKER_URL,
            siteId: MY_SITE_ID,
            disableCookies: true,
          },
        },
      ],
      environment: 'test',
    });
  });

  module('#initialization', function () {
    test('`_paq`-global is registered properly', async function (assert) {
      assert.notOk(
        window._paq,
        'without accessing `metrics`-service `_paq`-global is not present'
      );

      const metrics = this.owner.lookup('service:metrics');

      assert.ok(
        window._paq,
        'after accessing `metrics`-service `_paq`-global is present'
      );

      metrics.destroy();

      await waitUntil(() => !window._paq);

      assert.notOk(
        window._paq,
        '_paq global is cleaned up properly when service is destroyed'
      );
    });

    module('matomo configuration', function () {
      test('with `disableCookies` set to true', async function (assert) {
        this.owner.lookup('service:metrics');

        assert.deepEqual(
          window._paq,
          DEFAULT_INIT_COMMANDS,
          'cookies are disabled via matomo api'
        );
      });

      test('with `disableCookies` set to true', async function (assert) {
        this.owner.register('config:metrics', {
          metricsAdapters: [
            {
              name: 'Matomo',
              environments: ['all'],
              config: {
                scriptUrl:
                  '//cdn.matomo.cloud/<your-matomo-account>.matomo.cloud',
                trackerUrl: MY_TRACKER_URL,
                siteId: MY_SITE_ID,
                disableCookies: false,
              },
            },
          ],
          environment: 'test',
        });

        this.owner.lookup('service:metrics');

        assert.deepEqual(
          window._paq,
          [
            ['setTrackerUrl', `${MY_TRACKER_URL}/matomo.php`],
            ['setSiteId', MY_SITE_ID],
          ],
          'cookies are not disabled via matomo api'
        );
      });
    });

    test('#trackPage - tracks page hits via matomo api', async function (assert) {
      const metrics = this.owner.lookup('service:metrics');

      metrics.trackPage({ page: '/page', title: 'custom-title' });

      assert.deepEqual(
        window._paq,
        [
          ...DEFAULT_INIT_COMMANDS,
          ['setCustomUrl', `${window.location.origin}/page`],
          ['trackPageView', `custom-title`],
        ],
        'page was tracked with `setCustomUrl` and `trackPageView`'
      );
    });

    test('#trackEvent - tracks events via matomo api', async function (assert) {
      const metrics = this.owner.lookup('service:metrics');

      metrics.trackEvent({
        category: 'category',
        action: 'action',
        name: 'name',
        value: 9001,
      });

      assert.deepEqual(window._paq, [
        ...DEFAULT_INIT_COMMANDS,
        ['trackEvent', 'category', 'action', 'name', 9001],
      ]);
    });
  });
});
