'use client'

import React, { useState, useRef, useEffect } from 'react'

export default function Page() {
  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [formMessage, setFormMessage] = useState<string | null>(null)

  // Prompt / confirm / alert
  const [promptResult, setPromptResult] = useState<string | null>(null)
  const [confirmResult, setConfirmResult] = useState<string | null>(null)

  // Todo list
  const [todoText, setTodoText] = useState('')
  const [todos, setTodos] = useState<Array<{ id: number; text: string }>>([])
  const idRef = useRef(1)

  // File upload preview
  const [fileName, setFileName] = useState<string | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  // Modal
  const [showModal, setShowModal] = useState(false)

  // Async / fake fetch
  const [remoteData, setRemoteData] = useState<string | null>(null)
  const [loadingRemote, setLoadingRemote] = useState(false)

  // Checkbox / radio / select
  const [agreed, setAgreed] = useState(false)
  const [color, setColor] = useState('red')
  const [delivery, setDelivery] = useState('standard')

  useEffect(() => {
    // seed some todos
    setTodos([
      { id: idRef.current++, text: 'Buy coffee' },
      { id: idRef.current++, text: 'Write Cypress tests' },
    ])
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    //setFormMessage(`Form submitted: ${name} <${email}>\`)
    //small UX: clear fields
    setName('')
    setEmail('')
  }

  function openPrompt() {
    const result = window.prompt('Enter something for the prompt test', 'hello world')
    setPromptResult(result)
  }

  function openConfirm() {
    const ok = window.confirm('Do you confirm this action?')
    setConfirmResult(ok ? 'User confirmed' : 'User cancelled')
  }

  function addTodo() {
    if (!todoText.trim()) return
    setTodos((t) => [...t, { id: idRef.current++, text: todoText.trim() }])
    setTodoText('')
  }

  function removeTodo(id: number) {
    setTodos((t) => t.filter((x) => x.id !== id))
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setFilePreview(String(reader.result))
    reader.readAsDataURL(file)
  }

  async function loadRemote() {
    setLoadingRemote(true)
    // fake remote fetch with timeout so tests can stub / intercept
    await new Promise((r) => setTimeout(r, 700))
    setRemoteData('This is fake remote content loaded after 700ms')
    setLoadingRemote(false)
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6" data-cy="page-title">Next.js Cypress Prompt Sandbox</h1>

      <section className="mb-8 p-4 border rounded" aria-labelledby="forms">
        <h2 id="forms" className="font-semibold mb-2">Form (classic interaction)</h2>
        <form onSubmit={handleSubmit} data-cy="sample-form">
          <label className="block mb-2">
            Name
            <input
              data-cy="input-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full border p-2 mt-1"
              placeholder="Type name"
            />
          </label>

          <label className="block mb-2">
            Email
            <input
              data-cy="input-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full border p-2 mt-1"
              placeholder="you@example.com"
            />
          </label>

          <button data-cy="submit-form" type="submit" className="px-3 py-2 bg-slate-800 text-white rounded">
            Submit
          </button>
        </form>

        {formMessage && <p className="mt-2" data-cy="form-message">{formMessage}</p>}
      </section>

      <section className="mb-8 p-4 border rounded">
        <h2 className="font-semibold mb-2">Native dialogs (prompt / confirm / alert)</h2>
        <div className="flex gap-2">
          <button data-cy="btn-prompt" onClick={openPrompt} className="px-3 py-2 border rounded">Open prompt</button>
          <button data-cy="btn-confirm" onClick={openConfirm} className="px-3 py-2 border rounded">Open confirm</button>
          <button data-cy="btn-alert" onClick={() => window.alert('This is an alert for testing')} className="px-3 py-2 border rounded">Open alert</button>
        </div>
        <p data-cy="prompt-result" className="mt-2">Prompt result: {promptResult ?? '<empty>'}</p>
        <p data-cy="confirm-result">Confirm result: {confirmResult ?? '<empty>'}</p>
      </section>

      <section className="mb-8 p-4 border rounded">
        <h2 className="font-semibold mb-2">Todo list (dynamic DOM)</h2>
        <div className="flex gap-2">
          <input
            data-cy="input-todo"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            className="border p-2 flex-1"
            placeholder="New todo"
          />
          <button data-cy="btn-add-todo" onClick={addTodo} className="px-3 py-2 border rounded">Add</button>
        </div>
        <ul data-cy="todo-list" className="mt-3 space-y-2">
          {todos.map((t) => (
            <li key={t.id} className="flex items-center justify-between" data-cy={`todo-${t.id}`}>
              <span>{t.text}</span>
              <button data-cy={`btn-remove-${t.id}`} onClick={() => removeTodo(t.id)} className="text-sm text-red-600">Remove</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 p-4 border rounded">
        <h2 className="font-semibold mb-2">File upload & preview</h2>
        <input data-cy="input-file" type="file" onChange={handleFile} />
        {fileName && <p data-cy="file-name">Uploaded: {fileName}</p>}
        {filePreview && (
          <div className="mt-2" data-cy="file-preview">
            <img alt="preview" src={filePreview} style={{ maxWidth: 200, maxHeight: 200 }} />
          </div>
        )}
      </section>

      <section className="mb-8 p-4 border rounded">
        <h2 className="font-semibold mb-2">Modal (toggles / overlay)</h2>
        <button data-cy="btn-open-modal" onClick={() => setShowModal(true)} className="px-3 py-2 border rounded">Open Modal</button>
        {showModal && (
          <div data-cy="modal" role="dialog" aria-modal="true" className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <h3 className="font-semibold mb-2">Modal title</h3>
              <p className="mb-4">This is a modal body. Try testing focus and closing behavior.</p>
              <button data-cy="btn-close-modal" onClick={() => setShowModal(false)} className="px-3 py-2 border rounded">Close</button>
            </div>
          </div>
        )}
      </section>

      <section className="mb-8 p-4 border rounded">
        <h2 className="font-semibold mb-2">Select / checkbox / radio</h2>
        <label className="block mb-2">Color
          <select data-cy="select-color" value={color} onChange={(e) => setColor(e.target.value)} className="block mt-1 border p-2">
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </select>
        </label>

        <label className="block mb-2">
          <input data-cy="checkbox-agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} /> I agree
        </label>

        <fieldset className="mb-2">
          <legend>Delivery</legend>
          <label>
            <input data-cy="radio-standard" type="radio" name="delivery" value="standard" checked={delivery === 'standard'} onChange={(e) => setDelivery(e.target.value)} /> Standard
          </label>
          <label className="ml-4">
            <input data-cy="radio-fast" type="radio" name="delivery" value="fast" checked={delivery === 'fast'} onChange={(e) => setDelivery(e.target.value)} /> Fast
          </label>
        </fieldset>

        <p data-cy="current-selection">Selected color: {color} — Agreed: {String(agreed)} — Delivery: {delivery}</p>
      </section>

      <section className="mb-8 p-4 border rounded">
        <h2 className="font-semibold mb-2">Async / remote (stub-able)</h2>
        <button data-cy="btn-load-remote" onClick={loadRemote} className="px-3 py-2 border rounded">Load remote content</button>
        {loadingRemote ? <p data-cy="remote-loading">Loading...</p> : remoteData && <p data-cy="remote-content">{remoteData}</p>}
      </section>

      <section className="mb-8 p-4 border rounded">
        <h2 className="font-semibold mb-2">Misc: contentEditable and hidden toggles</h2>
        <div data-cy="editable" contentEditable suppressContentEditableWarning className="border p-2">Editable text — try typing here</div>
        <div className="mt-2">
          <button data-cy="btn-toggle-hidden" onClick={() => {
            const el = document.getElementById('hidden-section')
            if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none'
          }} className="px-3 py-2 border rounded">Toggle hidden section</button>
          <div id="hidden-section" data-cy="hidden-section" style={{ marginTop: 8 }}>
            This section can be hidden/shown
          </div>
        </div>
      </section>

      <footer className="text-sm text-slate-500 mt-12">This sandbox is designed for experimenting with Cypress and cy.prompt. Each interactable element has a <code>data-cy</code> attribute to make selection explicit for tests.</footer>
    </main>
  )
}
