import { useState, useEffect } from 'react'
import { WEEKDAY_DISPLAY } from '../lib/dateUtils'

export function TaskModal({ task, onSave, onClose, onDelete }) {
  const isEditing = !!task
  const [name, setName] = useState(task?.name || '')
  const [description, setDescription] = useState(task?.description || '')
  const [allDays, setAllDays] = useState(task ? task.days === 'all' : true)
  const [selectedDays, setSelectedDays] = useState(
    task && task.days !== 'all' ? task.days : []
  )

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const canSave = name.trim() && (allDays || selectedDays.length > 0)

  const handleSave = () => {
    if (!canSave) return
    onSave({
      name: name.trim(),
      description: description.trim(),
      days: allDays ? 'all' : selectedDays,
    })
  }

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const inputStyle = {
    width: '100%',
    border: '1.5px solid #e5e7eb',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '15px',
    color: '#111827',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          animation: 'fadeSlideIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 16px', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#111827' }}>
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            style={{ color: '#9ca3af', padding: '4px', cursor: 'pointer', display: 'flex', lineHeight: 1 }}
            onMouseOver={e => e.currentTarget.style.color = '#374151'}
            onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Task Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
              placeholder="e.g. Morning workout"
              autoFocus
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Description <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Any notes..."
              rows={2}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>
              Schedule
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={allDays}
                  onChange={() => setAllDays(true)}
                  style={{ accentColor: '#6366f1' }}
                />
                <span style={{ fontSize: '14px', color: '#374151' }}>Every day</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={!allDays}
                  onChange={() => setAllDays(false)}
                  style={{ accentColor: '#6366f1' }}
                />
                <span style={{ fontSize: '14px', color: '#374151' }}>Specific days</span>
              </label>

              {!allDays && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingLeft: '24px' }}>
                  {WEEKDAY_DISPLAY.map(({ key, label }) => {
                    const active = selectedDays.includes(key)
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleDay(key)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 600,
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          background: active ? '#6366f1' : '#f3f4f6',
                          color: active ? '#fff' : '#6b7280',
                        }}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px 20px', gap: '8px' }}>
          {isEditing && (
            <button
              onClick={() => onDelete(task.id)}
              style={{ color: '#ef4444', fontWeight: 600, fontSize: '14px', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', border: 'none', background: 'none' }}
              onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >
              Delete
            </button>
          )}
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            <button
              onClick={onClose}
              style={{ color: '#6b7280', fontWeight: 600, fontSize: '14px', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', border: 'none', background: 'none' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              style={{
                background: canSave ? '#6366f1' : '#c7d2fe',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                padding: '10px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: canSave ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
              }}
              onMouseOver={e => { if (canSave) e.currentTarget.style.background = '#4f46e5' }}
              onMouseOut={e => { if (canSave) e.currentTarget.style.background = '#6366f1' }}
            >
              {isEditing ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
