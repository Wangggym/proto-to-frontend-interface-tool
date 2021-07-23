import type { IService, IType, IEnum, Root } from 'protobufjs';
import protobuf from 'protobufjs';
import { printField } from './printField';
import { printMethod } from './printMethod';
import { printEnum } from './printEnum';
import { getAllMethods, mockResponse } from './mock';
import type { OptionType } from './interface';
import { get } from 'lodash';

const defaultOptions: OptionType = {
  isDefinition: true,
};

function printTS(j: protobuf.INamespace, opt: OptionType) {
  const allMethods: (string | undefined)[] = [];
  const allTypes: (string | undefined)[] = [];

  function dfsProtobuf(json: protobuf.INamespace, options: OptionType) {
    const { nested } = json;
    if (nested) {
      Object.keys(nested).forEach((name) => {
        const value = nested[name];
        Object.keys(value).forEach((category) => {
          if (category === 'methods') {
            allMethods.push(printMethod(name, value as IService));
          }
          if (category === 'fields') {
            allTypes.push(printField(name, value as IType, options));
          }
          if (category === 'values') {
            allTypes.push(printEnum(name, value as IEnum, options));
          }
          if (category === 'nested') printTypescript(value, options);
        });
      });
    }
  }
  dfsProtobuf(j, opt);
  const [, , packageName] = /(.*)\/(.*)/.exec(get(j, ['options', 'go_package'])) || [];
  const createInfo = `/* ${packageName} ${new Date().toLocaleDateString()} */\n`;
  return {
    allMethods: createInfo + allMethods.reduce((a, b) => a.concat(b), []).join(''),
    allTypes: createInfo + allTypes.reduce((a, b) => a.concat(b), []).join(''),
  };
}

export function printTypescript(json: protobuf.INamespace, options: OptionType): string {
  const { nested } = json;
  if (nested) {
    const output = Object.keys(nested)
      .map((name) => {
        const value = nested[name];
        const res = Object.keys(value).map((category) => {
          if (category === 'fields') return printField(name, value as IType, options);
          if (category === 'methods') return printMethod(name, value as IService);
          if (category === 'values') return printEnum(name, value as IEnum, options);
          if (category === 'nested') return printTypescript(value, options);
          return undefined;
        });
        return res;
      })
      .reduce((a, b) => a.concat(b), [])
      .join('');

    return output;
  }
  return '';
}

export function printMethods(json: protobuf.INamespace, options: OptionType): string {
  const { nested } = json;
  if (nested) {
    const output = Object.keys(nested)
      .map((name) => {
        const value = nested[name];
        const res = Object.keys(value).map((category) => {
          if (category === 'methods') return printMethod(name, value as IService);
          if (category === 'nested') return printTypescript(value, options);
          return undefined;
        });
        return res;
      })
      .reduce((a, b) => a.concat(b), [])
      .join('');

    return output;
  }
  return '';
}

export function printTypes(json: protobuf.INamespace, options: OptionType): string {
  const { nested } = json;
  if (nested) {
    const output = Object.keys(nested)
      .map((name) => {
        const value = nested[name];
        const res = Object.keys(value).map((category) => {
          if (category === 'fields') return printField(name, value as IType, options);
          if (category === 'values') return printEnum(name, value as IEnum, options);
          if (category === 'nested') return printTypescript(value, options);
          return undefined;
        });
        return res;
      })
      .reduce((a, b) => a.concat(b), [])
      .join('');

    return output;
  }
  return '';
}

export function parseProtoRoot(root: Root, options: OptionType, packageName?: string) {
  if (packageName) {
    // eslint-disable-next-line no-underscore-dangle
    const _root = root.lookup(packageName) as Root;
    return printTS(_root!.toJSON({ keepComments: true }), options);
  }
  return printTS(root.toJSON({ keepComments: true }), options);
}

export function parseProto(source: string, _options?: OptionType) {
  const options = { ...defaultOptions, ..._options };
  const res = protobuf.parse(source, {
    keepCase: true,
    alternateCommentMode: true,
  });
  return parseProtoRoot(res.root, options, res.package);
}

export { getAllMethods, mockResponse };

export default {
  parseProto,
  parseProtoRoot,
  getAllMethods,
  mockResponse,
};
