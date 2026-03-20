export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeStyle: 'short',
    dateStyle: 'short',
  };
  return Intl.DateTimeFormat('ru-RU', options).format(date);
}
