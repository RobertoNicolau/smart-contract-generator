import { maskCEP } from '../helpers/maskCEP'
import { maskPhone } from '../helpers/maskPhone'
import { DataModel } from '../interfaces/cnpj'
import { DownloadContractButton } from './DownloadContractButton'

interface ClientDataProps {
  company: DataModel
}

export function ClientData({ company }: ClientDataProps) {
  return (
    <div className="bg-white shadow-xl rounded-xl w-full h-full p-16 flex flex-col">
      <header className="pb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
          {company.razao_social}
        </h2>
        <h3 className="text-2xl font-thin text-slate-700 leading-tight">
          {company.nome_fantasia}
        </h3>
      </header>
      {/* Corpo do Contrato */}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div>
            <span className="font-semibold">CNPJ</span>
            <p className="text-slate-500">
              {company.cnpj}
              {' - '}
              {company.identificador_matriz_filial === 1 ? 'Matriz' : 'Filial'}
            </p>
          </div>

          <div>
            <span className="font-semibold">Situação Cadastral</span>
            <p className="text-slate-500">
              {company.descricao_situacao_cadastral} -{' '}
              {new Date(company.data_situacao_cadastral).toLocaleDateString(
                'pt-BR',
              )}
            </p>
          </div>
          <div>
            <span className="font-semibold">Início das atividades</span>
            <p className="text-slate-500">
              {new Date(company.data_inicio_atividade).toLocaleDateString(
                'pt-BR',
              )}
            </p>
          </div>
        </div>

        <div>
          <span className="font-semibold">Natureza Jurídica</span>
          <p className="text-slate-500">{company.natureza_juridica}</p>
        </div>

        <div>
          <span className="font-semibold">CNAE Fiscal</span>
          <p className="text-slate-500">
            {company.cnae_fiscal} - {company.cnae_fiscal_descricao}
          </p>
        </div>

        {/* <div>
          <span className="font-semibold">CNAEs Secundários</span>
          <ul>
            {company.cnaes_secundarios.map((cnae) => (
              <li key={cnae.codigo}>
                {cnae.codigo} - {cnae.descricao}
              </li>
            ))}
          </ul>
        </div> */}
        {/* 
        <div>
          <span className="font-semibold">Capital Social</span>
          <p>
            {company.capital_social.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        </div> */}

        <div>
          <span className="font-semibold">Endereço</span>
          <p className="text-slate-500">
            {company.logradouro}, {company.numero}{' '}
            {company.complemento && `(${company.complemento})`} -{' '}
            {company.bairro} - {maskCEP(company.cep)} - {company.municipio} -{' '}
            {company.uf}
          </p>
        </div>

        <div>
          <span className="font-semibold">Contato</span>
          <p className="text-slate-500">
            {maskPhone(company.ddd_telefone_1)}{' '}
            {company.ddd_telefone_2 && `/ ${maskPhone(company.ddd_telefone_2)}`}{' '}
          </p>
          <p className="text-slate-500">{company.email}</p>
        </div>
        <DownloadContractButton company={company} />
      </div>
    </div>
  )
}
