import React from 'react'
import { AVATAR_COLORS } from '../App'

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function formatDob(dob) {
  if (!dob) return '—'
  return new Date(dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function calcAge(dob) {
  if (!dob) return null
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
}

export default function StudentDetail({ student, index, onClose, onEdit, onDelete, deleting }) {
  if (!student) return null
  const [bg, fg] = AVATAR_COLORS[index % AVATAR_COLORS.length]
  const age = calcAge(student.dob)

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 50,
      }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 360,
        background: '#fff', boxShadow: '-4px 0 30px rgba(0,0,0,0.12)',
        zIndex: 51, overflowY: 'auto', fontFamily: 'system-ui, sans-serif',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14, background: 'none',
          border: 'none', cursor: 'pointer', fontSize: 16, color: '#999', padding: 4,
        }}>✕</button>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '48px 24px 24px', borderBottom: '0.5px solid #eee', textAlign: 'center',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: bg, color: fg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 600,
          }}>
            {getInitials(student.name)}
          </div>
          <h2 style={{ margin: '12px 0 2px', fontSize: 20, fontWeight: 600 }}>{student.name}</h2>
          <span style={{
            display: 'inline-block', background: '#f1f1ef', color: '#555',
            fontSize: 12, padding: '3px 10px', borderRadius: 20, marginTop: 6,
          }}>
            Class of {student.class_of || '—'}
          </span>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <Row label="ID"           value={student.id} />
          <Row label="Email"        value={<a href={`mailto:${student.email}`} style={{ color: '#185FA5' }}>{student.email}</a>} />
          <Row label="Date of birth" value={age ? `${formatDob(student.dob)} (age ${age})` : formatDob(student.dob)} />
          <Row label="Gender"       value={student.gender || '—'} />
          <Row label="Address"      value={student.address || '—'} />
        </div>

        <div style={{ padding: '8px 24px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={onEdit} style={{
            padding: 10, borderRadius: 8, border: '0.5px solid #ddd',
            background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}>Edit</button>
          <button onClick={onDelete} disabled={deleting} style={{
            padding: 10, borderRadius: 8, border: '0.5px solid #fcc',
            background: '#fff8f8', color: '#c0392b', cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}>
            {deleting ? 'Deleting…' : 'Delete student'}
          </button>
        </div>
      </div>
    </>
  )
}

function Row({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '10px 0', borderBottom: '0.5px solid #f0f0f0',
    }}>
      <span style={{ fontSize: 12, color: '#888', fontWeight: 500, paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#111', maxWidth: '60%', textAlign: 'right' }}>{value}</span>
    </div>
  )
}
