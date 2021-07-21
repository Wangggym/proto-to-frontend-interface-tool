import type { IType, IField, IMapField } from 'protobufjs';
import type { OptionType } from './interface';

interface IFieldWithComment extends IField {
  comment?: string;
}

const TYPES: Record<string, string> = {
  double: 'number',
  float: 'number',
  int32: 'number',
  int64: 'number',
  uint32: 'number',
  uint64: 'string',
  sint32: 'number',
  sint64: 'string',
  fixed32: 'number',
  fixed64: 'string',
  sfixed32: 'number',
  sfixed64: 'string',
  bool: 'boolean',
  string: 'string',
  bytes: 'string',
};

function getKeyType(p: Partial<IMapField>) {
  if (p.keyType) {
    return TYPES[p.keyType] || p.keyType;
  }
  return '';
}

function readField(name: string, content: Record<string, IFieldWithComment>) {
  const params = Object.keys(content).map((paramName) => {
    const paramValue = content[paramName];

    return {
      type: TYPES[paramValue.type] || paramValue.type,
      keyType: getKeyType(paramValue),
      name: paramName,
      rule: paramValue.rule,
      id: paramValue.id,
      commit: paramValue.comment,
    };
  });

  return {
    category: 'fields',
    name,
    params: params.sort((a, b) => a.id - b.id),
  };
}

export function printField(name: string, fieldParams: IType, options: OptionType) {
  const content = fieldParams.fields;

  const item = readField(name, content);

  const strs = item.params.map((param) => {
    const commit = param.commit ? `/* ${param.commit} */\n` : '';
    if (param.rule === 'repeated') {
      return `${commit} ${param.name}?: ${param.type}[];\n`;
    }
    if (param.keyType) {
      return `${commit} ${param.name}?: {[key: ${param.keyType}]: ${param.type}};\n`;
    }
    return `${commit} ${param.name}?: ${param.type};\n`;
  });

  const prefix = options.isDefinition ? '' : 'export ';

  return `${prefix}type ${item.name} = {\n${strs.join('')}}\n\n`;
}
