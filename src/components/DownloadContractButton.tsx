import Docxtemplater from 'docxtemplater'
import PizZip, { LoadData } from 'pizzip'
import { saveAs } from 'file-saver'

import { DataModel } from '../interfaces/cnpj'
import { maskCNPJ } from '../helpers/maskCNPJ'
import { maskCPF } from '../helpers/maskCPF'
interface DownloadContractButtonProps {
  company: DataModel
  data_primeira_assinatura: string
  nome_representante: string
  cpf_representante: string
  cantSubmit: boolean
}

let PizZipUtils: any = null
if (typeof window !== 'undefined') {
  import('pizzip/utils/index.js').then(function (r) {
    PizZipUtils = r
  })
}

function loadFile(
  url: string,
  callback: (error: Error | null, content: LoadData) => void,
) {
  PizZipUtils.getBinaryContent(url, callback)
}

export function DownloadContractButton({
  company,
  data_primeira_assinatura,
  nome_representante,
  cpf_representante,
  cantSubmit,
}: DownloadContractButtonProps) {
  const generateDocument = () => {
    loadFile(
      '/templates/modelo1.docx',
      function (error: Error | null, content: LoadData) {
        if (error) {
          throw error
        }
        const zip = new PizZip(content)
        const doc = new Docxtemplater(zip, {
          linebreaks: true,
          paragraphLoop: true,
        })
        // render the document (replace all occurences of {cnpj} by company?.cnpj, {razao_social} by company?.razao_social, ...)
        doc.render({
          cnpj_imobiliaria: maskCNPJ(company?.cnpj),
          razao_social: company?.razao_social,
          data_primeira_assinatura,
          nome_representante,
          cpf_representante: maskCPF(cpf_representante),
        })
        const blob = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
        // Output the document using Data-URI
        saveAs(blob, company?.cnpj)
      },
    )
  }

  return (
    <button
      className={`${
        cantSubmit ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white'
      } font-semibold px-4 py-2 rounded-md`}
      onClick={generateDocument}
      disabled={cantSubmit}
    >
      Baixar Contrato
    </button>
  )
}
