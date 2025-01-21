export function maskDate(value) {
  if (!value) return '';

  const onlyNumbers = value.replace(/\D/g, '');

  return onlyNumbers                                // Output: 12/12/2021
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
    
}