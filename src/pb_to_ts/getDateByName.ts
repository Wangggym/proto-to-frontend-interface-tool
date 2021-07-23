export const getDateByName = (name: string) => {
  if (!name || name.length < 1) {
    return 'string';
  }
  if (/id|code|key/.test(name)) {
    return 'uuid';
  }
  if (/date/.test(name)) {
    return 'date-time';
  }
  if (/email/.test(name)) {
    return 'email';
  }
  if (/password/.test(name)) {
    return 'string(16)';
  }
  if (/phone/.test(name)) {
    return 'phone';
  }
  if (/page_index/.test(name)) {
    return 'page_index';
  }
  if (/page_size/.test(name)) {
    return 'page_size';
  }
  if (/total_records/.test(name)) {
    return 'total_records';
  }
  if (/nickname|name|owner|firstName|lastName|username/.test(name)) {
    return 'name';
  }
  if (['avatar'].includes(name)) {
    return 'avatar';
  }
  if (['group'].includes(name)) {
    return 'group';
  }

  if (['province'].includes(name)) {
    return 'province';
  }
  if (['city'].includes(name)) {
    return 'city';
  }
  if (['addr', 'address'].includes(name)) {
    return 'county';
  }
  if (['country'].includes(name)) {
    return 'country';
  }
  if (
    ['url', 'imageUrl', 'href'].includes(name) ||
    name.toLocaleLowerCase().endsWith('url') ||
    name.toLocaleLowerCase().endsWith('urls') ||
    name.toLocaleLowerCase().endsWith('image') ||
    name.toLocaleLowerCase().endsWith('link')
  ) {
    return 'href';
  }
  if (name.toLocaleLowerCase().endsWith('errorcode')) {
    return 'errorCode';
  }
  if (
    ['type', 'status'].includes(name) ||
    name.toLocaleLowerCase().endsWith('status') ||
    name.toLocaleLowerCase().endsWith('type')
  ) {
    return 'status';
  }
  if (name.toLocaleLowerCase().endsWith('authority')) {
    return 'authority';
  }
  return 'csentence';
};
