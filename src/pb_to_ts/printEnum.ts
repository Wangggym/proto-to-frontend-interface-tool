import type { IEnum } from 'protobufjs';
import type { OptionType } from './interface';

interface IEnumWithComment extends IEnum {
  comment?: string;
  comments?: Record<keyof IEnum['values'], string>;
}

export function printEnum(name: string, enumContent: IEnumWithComment, options: OptionType) {
  const { values: content, comment, comments } = enumContent;
  const item = Object.keys(content)
    .map((key) => ({
      name: key,
      id: content[key],
      comment: comments?.[key],
    }))
    .sort((a, b) => a.id - b.id);
  const strs = item
    .map((s) => {
      const cmt = s.comment ? `/* ${s.comment} */\n` : '';
      return `${cmt} ${s.name} = ${s.id},\n`;
    })
    .join('');
  const prefix = options.isDefinition ? '' : 'export ';
  return `/* ${comment?.trim()} */\n ${prefix}enum ${name} {\n${strs}}\n\n`;
}
