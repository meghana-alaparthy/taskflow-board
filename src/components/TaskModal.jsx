import { useEffect, useState } from 'react'
import { COLUMNS, LABELS, PRIORITIES } from '../data/seed'

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export default function TaskModal({ mode, initialTask, defaultColumn = 'backlog', onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    title: initialTask?.title ?? '',
    description: initialTask?.description ?? '',
    label: initialTask?.label ?? 'feature',
    priority: initialTask?.priority ?? 'medium',
    dueDate: initialTask?.dueDate ?? '',
    column: initialTask?.column ?? defaultColumn,
  }))
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Give the task a title.')
      return
    }
    onSave({ ...form, title: form.title.trim(), description: form.description.trim() })
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label={mode === 'add' ? 'Add task' : 'Edit task'}>
        <div className="modal-header">
          <h2>{mode === 'add' ? 'New task' : 'Edit task'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit}>
          <label className="field">
            <span>Title</span>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="What needs doing?"
              autoFocus
              maxLength={120}
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Anything the person picking this up should know."
              rows={4}
              maxLength={2000}
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Label</span>
              <select value={form.label} onChange={set('label')}>
                {LABELS.map((l) => (
                  <option key={l} value={l}>
                    {cap(l)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Priority</span>
              <select value={form.priority} onChange={set('priority')}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {cap(p)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Due date</span>
              <input type="date" value={form.dueDate} onChange={set('dueDate')} />
            </label>
            <label className="field">
              <span>Column</span>
              <select value={form.column} onChange={set('column')}>
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === 'add' ? 'Add task' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
