export const getDateByName = (name: string, type: 'string' | 'number' | 'boolean') => {
  if (!name || name.length < 1) {
    return 'string';
  }
  if (/id|code|key/.test(name)) {
    return 'uuid';
  }
  if (/date|_at/.test(name)) {
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
  if (/status/.test(name) && type === 'number') {
    return 'status';
  }
  if (type === 'number') {
    return 'status';
  }
  if (name.toLocaleLowerCase().endsWith('authority')) {
    return 'authority';
  }
  return 'csentence';
};
