import Base from 'ember-metrics/metrics-adapters/base';
declare type MatomoTrackPageOptions = {
  page: string;
  title: string;
};
declare type MatomoTrackEventOptions = {
  category: string;
  action: string;
  name?: string;
  value?: number;
};
declare type MatomoTrackSiteSearchOptions = {
  keyword: string;
  category?: string;
  searchCount?: number;
};
declare type MatomoConfig = {
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
  init(): void;
  trackPage({ page, title }: MatomoTrackPageOptions): void;
  trackEvent({ category, action, name, value }: MatomoTrackEventOptions): void;
  trackSiteSearch({
    keyword,
    category,
    searchCount,
  }: MatomoTrackSiteSearchOptions): void;
  willDestroy(): void;
}
export {};
