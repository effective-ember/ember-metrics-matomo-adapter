import Base from 'ember-metrics/metrics-adapters/base';
import removeFromDOM from 'ember-metrics/utils/remove-from-dom';

type MatomoTrackPageOptions = {
  page: string;
  title: string;
};

type MatomoTrackEventOptions = {
  category: string;
  action: string;
  name?: string;
  value?: number;
};

type MatomoConfig = {
  scriptUrl: string;
  trackerUrl: string;
  siteId: string;
  disableCookies: boolean;
};

interface MatomoClient {
  push: (params: any[]) => void;
}

declare global {
  interface Window {
    _paq?: MatomoClient;
  }
}

export default class MatomoAdapter extends Base<MatomoConfig> {
  init(): void {
    const { scriptUrl, trackerUrl, siteId, disableCookies } = this.config;
    const _paq = (window._paq = window._paq || ([] as any[]));

    if (disableCookies) {
      _paq.push(['disableCookies']);
    }

    (function () {
      _paq.push(['setTrackerUrl', `${trackerUrl}/matomo.php`]);
      _paq.push(['setSiteId', siteId]);
      const d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0];
      g.type = 'text/javascript';
      g.async = true;
      g.src = `${scriptUrl}/matomo.js`;
      s.parentNode && s.parentNode.insertBefore(g, s);
    })();
  }

  trackPage({ page, title }: MatomoTrackPageOptions): void {
    const _paq = window._paq;

    if (_paq) {
      _paq.push(['setCustomUrl', `${window.location.origin}${page}`]);
      _paq.push(['trackPageView', title]);
    }
  }

  trackEvent({ category, action, name, value }: MatomoTrackEventOptions): void {
    const _paq = window._paq;

    if (_paq) {
      _paq.push(['trackEvent', category, action, name, value]);
    }
  }

  willDestroy(): void {
    removeFromDOM('script[src*="matomo"]');

    delete window._paq;
  }
}
