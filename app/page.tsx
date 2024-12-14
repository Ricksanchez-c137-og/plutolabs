'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function XMLUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'text/xml' || selectedFile.name.endsWith('.xml')) {
        setFile(selectedFile)
        setError('')
      } else {
        setFile(null)
        setError('Please upload a valid XML file.')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    const formData = new FormData()
    formData.append('xmlFile', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setResult(data.result)
      setError('')
    } catch (err) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`)
      } else {
        setError('An unexpected error occurred while uploading the file.')
      }
      setResult('')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">File Uploader v.1.0</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <Input
            type="file"
            accept=".xml,text/xml"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
        <Button type="submit" disabled={!file}>
          Upload
        </Button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Parsed Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}