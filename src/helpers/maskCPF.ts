export function maskCPF(value) {
    if (!value) return '';
  
    const onlyNumbers = value.replace(/\D/g, '');
  
    return onlyNumbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  