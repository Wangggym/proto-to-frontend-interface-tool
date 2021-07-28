import protobuf, { Service, MapField, Enum } from 'protobufjs';
import { getDateByName } from './getDateByName';
import primitives from './primitives';
import { TYPES } from './types';

// eslint-disable-next-line no-underscore-dangle
function _getAllMethods(root: protobuf.Root) {
  const service = root.nestedArray.find((s) => s instanceof Service);
  const firstService = root.lookupService(service!.name);

  return firstService.methods;
}

export function getAllMethods(source: string) {
  const res = protobuf.parse(source, {
    keepCase: true,
    alternateCommentMode: true,
  });
  if (res.package) {
    const reflect = res.root.lookup(res.package) as protobuf.Root;
    return _getAllMethods(reflect);
  }
  return _getAllMethods(res.root);
}

const typeReg =
  /string|number|bool|int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|double|float|bytes/;

function mockScalar(type: string, name: string): any {
  if (/bool/.test(type)) return primitives.boolean;
  if (!typeReg.test(type)) return null;
  return primitives[`string_${getDateByName(name, TYPES[type])}`];
}

// eslint-disable-next-line @typescript-eslint/ban-types
function mockType(root: protobuf.Root, typeName: string): Object {
  const type = root.lookupTypeOrEnum(typeName);

  if (type instanceof Enum) {
    const values = Object.values(type.values);
    return values[0];
  }

  const fieldMock =
    type.fieldsArray &&
    type.fieldsArray.reduce((a, b) => {
      if (b instanceof MapField) {
        const mockKey = mockScalar(b.keyType, b.name);
        const mockData = mockScalar(b.type, b.name);
        const val = mockData
          ? { [b.name]: { [mockKey]: mockData } }
          : { [b.name]: { [mockKey]: mockType(root, b.type) } };
        return { ...a, ...val };
      }
      if (b.rule === 'repeated') {
        const mockData = mockScalar(b.type, b.name);
        const repeatedKey = `${b.name}|10-20`;
        const val = mockData
          ? { [repeatedKey]: [mockData] }
          : { [repeatedKey]: [mockType(root, b.type)] };
        return { ...a, ...val };
      }
      const mockData = mockScalar(b.type, b.name);
      const val = mockData ? { [b.name]: mockData } : { [b.name]: mockType(root, b.type) };
      return { ...a, ...val };
    }, {});

  // const enumMock =
  //   type.nestedArray &&
  //   type.nestedArray.reduce((a, b) => {
  //     if (b instanceof Enum) {
  //       const values = Object.values(b.values);
  //       if (values.length) {
  //         const val = { [b.name]: values[0] };
  //         return { ...a, ...val };
  //       }
  //       return a;
  //     }
  //     return a;
  //   }, {});

  return fieldMock;
}

// eslint-disable-next-line no-underscore-dangle
function _mockResponse(root: protobuf.Root, methodName: string) {
  const service = root.nestedArray.find((s) => s instanceof Service);
  const firstService = root.lookupService(service!.name);
  const { responseType } = firstService.methods[methodName];
  const res = mockType(root, responseType);
  return res;
}

export function mockResponse(source: string, methodName: string) {
  const res = protobuf.parse(source, {
    keepCase: true,
    alternateCommentMode: true,
  });
  if (res.package) {
    const reflect = res.root.lookup(res.package) as protobuf.Root;
    return _mockResponse(reflect, methodName);
  }
  return _mockResponse(res.root, methodName);
}
