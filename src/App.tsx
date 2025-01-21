import { useState, useEffect } from 'react';
import { validateCNPJ } from './helpers/validateCNPJ';
import { maskCNPJ } from './helpers/maskCNPJ';
import { maskCPF } from './helpers/maskCPF';
import { DataModel } from './interfaces/cnpj';
import { ClientData } from './components/ClientData';
import { SpinnerGap } from 'phosphor-react';
import { parse, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { maskDate } from './helpers/maskDate';

function formatDateToWords(date: string) {
  const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
  return format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

function App() {
  const [cnpj, setCnpj] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [representativeCpf, setRepresentativeCpf] = useState('');
  const [signatureDate, setSignatureDate] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [result, setResult] = useState<DataModel>();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    if (!validateCNPJ(cnpj)) {
      setError('CNPJ inválido');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!data) {
        setError('CNPJ não encontrado');
        setResult(undefined);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar o CNPJ');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const onlyNumbers = value.replace(/[^\d]+/g, '');
  
    if (onlyNumbers.length === 14) {
      if (!validateCNPJ(onlyNumbers)) {
        setError('CNPJ inválido');
        setCnpj(onlyNumbers); // Mantenha o valor para permitir edição
        return;
      }
      setSearch(onlyNumbers); // Apenas busca se for válido
      setError('');
    }
  
    setCnpj(onlyNumbers); // Atualiza o CNPJ, mesmo durante a digitação
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSignatureDate(value);
    if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      setFormattedDate(formatDateToWords(value));
    } else {
      setFormattedDate('');
    }
  };

  // Verifica se todos os campos estão preenchidos:

  const cantSubmit = !cnpj || !representativeName || !representativeCpf || !signatureDate || !!error;

  useEffect(() => {
    if (search.length === 0) return;
    handleSearch();
  }, [search]);

  return (
    <main className="grid grid-cols-2 bg-gradient-to-r from-sky-500 to-indigo-500">
      {/* Input Section */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-5">
        <h1 className="text-5xl font-bold text-slate-50">Smart Generator</h1>

        <div className="w-96 flex flex-col gap-4">
          <input
            value={maskCNPJ(cnpj)}
            type="text"
            placeholder="CNPJ"
            maxLength={18}
            onChange={handleInputChange}
            className="rounded-lg p-2 border border-gray-300 ring-indigo-500 focus:ring-2 focus:outline-none w-full text-center text-xl font-bold text-slate-700"
          />

          <input
            value={representativeName}
            type="text"
            placeholder="Nome do Representante"
            onChange={(e) => setRepresentativeName(e.target.value)}
            className="rounded-lg p-2 border border-gray-300 ring-indigo-500 focus:ring-2 focus:outline-none w-full text-center text-xl font-bold text-slate-700"
          />

          <input
            value={maskCPF(representativeCpf)}
            type="text"
            placeholder="CPF do Representante"
            maxLength={14}
            onChange={(e) => setRepresentativeCpf(e.target.value.replace(/[^\d]+/g, ''))}
            className="rounded-lg p-2 border border-gray-300 ring-indigo-500 focus:ring-2 focus:outline-none w-full text-center text-xl font-bold text-slate-700"
          />

          <input
            value={maskDate(signatureDate)}
            type="text"
            placeholder="Data de Assinatura (DD/MM/AAAA)"
            maxLength={10}
            onChange={handleDateChange}
            className="rounded-lg p-2 border border-gray-300 ring-indigo-500 focus:ring-2 focus:outline-none w-full text-center text-xl font-bold text-slate-700"
          />
          {formattedDate && (
            <p className="text-slate-50 text-center text-lg font-semibold">
              {formattedDate}
            </p>
          )}
        </div>
      </div>

      {/* Result Section */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-5 p-16">
        {loading ? (
          <SpinnerGap size={164} color="white" className="animate-spin" />
        ) : (
          result && <ClientData company={result}
                                data_primeira_assinatura={formattedDate}
                                nome_representante={representativeName}
                                cpf_representante={representativeCpf}
                                cantSubmit={cantSubmit}
           />
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </main>
  );
}

export default App;
