import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

export default class CustomSimpleSchema2Bridge extends SimpleSchema2Bridge {


  // eslint-disable-next-line complexity
  getProps(name: string, props: Record<string, any> = {}) {
    const { optional, type, uniforms, ...contextField } = this.getField(name);
    let field = { ...contextField, required: !optional };

    if (uniforms) {
      if (typeof uniforms === 'string' || typeof uniforms === 'function') {
        field = { ...field, component: uniforms };
      } else {
        field = { ...field, ...uniforms };
      }
      if (field.placeholder && typeof field.placeholder === 'function') {
        field.placeholder = field.placeholder();
      }
      if (field.help && typeof field.help === 'function') {
        field.help = field.help();
      }
      if (field.extra && typeof field.extra === 'function') {
        field.extra = field.extra();
      }
    }

    if (type === Array) {
      try {
        const itemProps = this.getProps(`${name}.$`, props);
        if (itemProps.allowedValues && !props.allowedValues) {
          field.allowedValues = itemProps.allowedValues;
        }

        if (itemProps.transform && !props.transform) {
          field.transform = itemProps.transform;
        }
      } catch (_) {
        /* ignore it */
      }
    } else if (type === Number) {
      field = { ...field, decimal: true };
    }

    let options = props.options || field.options;
    if (options) {
      if (typeof options === 'function') {
        options = options();
      }

      if (!Array.isArray(options)) {
        field = {
          ...field,
          transform: (value: any) => options[value],
          allowedValues: Object.keys(options),
        };
      } else {
        field = {
          ...field,
          transform: (value: any) =>
            (options as any[]).find(option => option.value === value).label,
          allowedValues: options.map(option => option.value),
        };
      }
    }

    return field;
  }

}
