// Types for compiled templates
declare module 'ember-metrics-matomo-adapter/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
