import type { IService, IMethod } from 'protobufjs';

const EMPTY = 'google.protobuf.Empty';

function readMethod(name: string, content: Record<string, IMethod>) {
  const params = Object.keys(content).map((paramName) => {
    const paramValue = content[paramName];

    return { name: paramName, ...paramValue };
  });

  return {
    category: 'methods',
    name,
    params,
  };
}

export function printMethod(name: string, methodContent: IService) {
  const content = methodContent.methods;
  const item = readMethod(name, content);

  const strs = item.params.map((param) => {
    const requestType = param.requestType === EMPTY ? 'unknown' : param.requestType;
    const responseType = param.responseType === EMPTY ? 'unknown' : param.responseType;
    const commentRegular = /(POST|GET)(.*)-->(.*)/;
    // eslint-disable-next-line no-sparse-arrays
    const [, method, url, notes] = commentRegular.exec(param.comment!) || [, 'GET', '', ''];
    const paramsName = method === 'POST' ? 'data' : 'params';
    /** 方法名称 */
    const methodName = param.name.slice(0, 1).toLowerCase() + param.name.slice(1);

    return (
      `/* ${notes?.trim()} */\n` +
      `export async function ${methodName}(${paramsName}: API.${requestType}) {\n` +
      `  return request<API.${responseType}>('${url?.trim()}', {\n` +
      `    method: '${method}',\n` +
      `    ${paramsName},\n` +
      ` });\n` +
      `}\n` +
      '\n'
    );
  });

  return `${strs.join('')}`;
}
