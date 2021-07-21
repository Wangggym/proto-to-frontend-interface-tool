import type { IService, IType, IEnum, Root } from 'protobufjs';
import protobuf from 'protobufjs';
import { printField } from './printField';
import { printMethod } from './printMethod';
import { printEnum } from './printEnum';
import { getAllMethods, mockResponse } from './mock';
import type { OptionType } from './interface';

const defaultOptions: OptionType = {
  isDefinition: true,
};

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

export function parseProtoRoot(root: Root, options: OptionType, packageName?: string) {
  if (packageName) {
    // eslint-disable-next-line no-underscore-dangle
    const _root = root.lookup(packageName) as Root;
    return printTypescript(_root!.toJSON({ keepComments: true }), options);
  }
  return printTypescript(root.toJSON({ keepComments: true }), options);
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
