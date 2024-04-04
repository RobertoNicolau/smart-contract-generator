import { useState, useEffect } from 'react'
import { validateCNPJ } from './helpers/validateCNPJ'
import { DataModel } from './interfaces/cnpj'
import { maskCNPJ } from './helpers/maskCNPJ'
import { ClientData } from './components/ClientData'
import { SpinnerGap } from 'phosphor-react'
// import { Modal } from './components/Modal'

// https://brasilapi.com.br/api/cnpj/v1/03336489000165

function App() {
  const [cnpj, setCnpj] = useState('')
  const [result, setResult] = useState<DataModel>()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    setLoading(true)
    if (!validateCNPJ(cnpj)) return
    const response = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))

    if (response.status === 404) {
      setError('CNPJ não encontrado')
      setLoading(false)
      setSearch('')
      return
    }

    if (response.status === 429) {
      setError('Limite de requisições atingido')
      setLoading(false)
      setSearch('')
      return
    }

    if (response.status === 500) {
      setError('Erro interno no servidor')
      setLoading(false)
      setSearch('')
      return
    }

    if (response.status === 503) {
      setError('Serviço indisponível')
      setLoading(false)
      setSearch('')
      return
    }

    setResult(response)
    setLoading(false)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const { value } = event.target
    const onlyNumbers = value.replace(/[^\d]+/g, '')

    if (onlyNumbers.length === 14 && !validateCNPJ(onlyNumbers)) {
      setError('CNPJ inválido')
      setSearch('')
      return
    }

    if (onlyNumbers.length === 0 && search.length > 0) {
      setError('')
      setSearch('')
      setLoading(false)
      setResult(undefined)
      setCnpj('')
    }

    setCnpj(onlyNumbers)
    onlyNumbers.length === 14 && setSearch(onlyNumbers)
    setError('')
  }

  useEffect(() => {
    if (search.length === 0) return

    handleSearch()
    return () => {
      setLoading(false)
      // cleanup
    }
  }, [search])

  return (
    <main className="grid grid-cols-2 bg-gradient-to-r from-sky-500 to-indigo-500">
      {/* // <main className="grid grid-cols-2 bg-[url('https://images.unsplash.com/photo-1613310023042-ad79320c00ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]"> */}

      {/* Search */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-5">
        <h1 className="text-5xl font-bold text-slate-50">Smart Generator</h1>
        <div className="w-96">
          <input
            value={maskCNPJ(cnpj)}
            type="text"
            name="search-input"
            id="search-input"
            maxLength={18}
            onChange={handleInputChange}
            className="rounded-lg p-2 border border-gray-300 ring-indigo-500 focus:ring-2 focus:outline-none w-full text-center text-xl font-bold text-slate-700"
          />
        </div>
      </div>

      {/* Result */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-5 p-16">
        <>
          {loading === true ? (
            <SpinnerGap size={164} color="white" className="animate-spin" />
          ) : (
            // <Modal />
            <>{result && <ClientData company={result} />}</>
          )}
        </>
        <div>{error && <p>{error}</p>}</div>
      </div>
    </main>
  )
}

export default App
