import Docxtemplater from 'docxtemplater'
import PizZip, { LoadData } from 'pizzip'
import { saveAs } from 'file-saver'

import { DataModel } from '../interfaces/cnpj'
interface DownloadContractButtonProps {
  company: DataModel
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
}: DownloadContractButtonProps) {
  const generateDocument = () => {
    loadFile(
      'src/templates/modelo.docx',
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
          cnpj: company?.cnpj,
          razao_social: company?.razao_social,
          endereco: `${company?.logradouro}, ${company?.numero}, ${company?.complemento}, ${company?.bairro}`,
          cep: company?.cep || '',
          municipio: company?.municipio || '',
          uf: company?.uf || '',
          ddd_telefone_1: company?.ddd_telefone_1 || '',
          ddd_telefone_2: company?.ddd_telefone_2 || '',
          email: company?.email || '',
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
      className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md"
      onClick={generateDocument}
    >
      Download Contract
    </button>
  )
}
