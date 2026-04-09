import React from 'react'
import { AVATAR_COLORS } from '../App'

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function StudentCard({ student, index, isSelected, onClick }) {
  const [bg, fg] = AVATAR_COLORS[index % AVATAR_COLORS.length]

  return (
    <div onClick={onClick} style={{
      background: '#fff',
      border: isSelected ? '1.5px solid #378ADD' : '0.5px solid #eee',
      boxShadow: isSelected ? '0 0 0 3px rgba(55,138,221,0.1)' : 'none',
      borderRadius: 12, padding: 16, cursor: 'pointer',
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: bg, color: fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 500, fontSize: 13, flexShrink: 0,
        }}>
          {getInitials(student.name)}
        </div>
        <div>
          <div style={{ fontWeight: 500, fontSize: 14 }}>{student.name}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Class of {student.class_of || '—'}</div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '0.5px solid #f0f0f0', marginBottom: 10 }} />

      <Row label="Email"   value={student.email} />
      <Row label="Gender"  value={student.gender} />
      <Row label="Address" value={student.address} />
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
      <span style={{ fontSize: 12, color: '#888' }}>{label}</span>
      <span style={{
        fontSize: 12, color: '#111', maxWidth: '60%',
        textAlign: 'right', overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {value || '—'}
      </span>
    </div>
  )
}
