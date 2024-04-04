export function maskCEP(cep: string) {
  return cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(\d{3})(\d)/, '$1$2')
}
// Compare this snippet from src/helpers/maskCNPJ.ts
