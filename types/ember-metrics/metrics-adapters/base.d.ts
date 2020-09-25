declare module 'ember-metrics/metrics-adapters/base' {
  export default class BaseAdapter<Config extends Record<string, unknown>> {
    config: Config;
  }
}
