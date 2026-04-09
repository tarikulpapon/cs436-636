import React, { useState, useEffect, useCallback } from 'react'
import supabase from './config/supabaseClient'
import StudentCard from './components/StudentCard'
import StudentDetail from './components/StudentDetail'
import StudentModal from './components/StudentModal'

const TABLE = 'umb_students'
const PAGE_SIZE = 9

const AVATAR_COLORS = [
  ['#E6F1FB', '#0C447C'],
  ['#E1F5EE', '#085041'],
  ['#EEEDFE', '#3C3489'],
  ['#FAECE7', '#712B13'],
  ['#FBEAF0', '#72243E'],
  ['#EAF3DE', '#27500A'],
]

export { TABLE, AVATAR_COLORS }

export default function App() {
  const [students, setStudents]       = useState([])
  const [search, setSearch]           = useState('')
  const [sort, setSort]               = useState('name')
  const [order, setOrder]             = useState('asc')
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [page, setPage]               = useState(1)

  const [selected, setSelected]       = useState(null)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [deleting, setDeleting]       = useState(false)

  const [modalOpen, setModalOpen]     = useState(false)
  const [editStudent, setEditStudent] = useState(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order(sort, { ascending: order === 'asc' })

    if (error) {
      setError('Could not fetch students: ' + error.message)
    } else {
      setStudents(data)
      setError(null)
    }
    setLoading(false)
  }, [sort, order])

  useEffect(() => { fetchStudents() }, [fetchStudents])
  useEffect(() => { setPage(1) }, [search, sort, order])

  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSort = (col) => {
    if (sort === col) setOrder(o => o === 'asc' ? 'desc' : 'asc')
    else { setSort(col); setOrder('asc') }
  }

  const handleSave = (saved, isEdit) => {
    if (isEdit) {
      setStudents(prev => prev.map(s => s.id === saved.id ? saved : s))
      if (selected?.id === saved.id) setSelected(saved)
    } else {
      setStudents(prev => [...prev, saved])
    }
    setModalOpen(false)
    setEditStudent(null)
  }

  const handleDelete = async () => {
    if (!selected) return
    if (!window.confirm(`Delete ${selected.name}? This cannot be undone.`)) return
    setDeleting(true)
    const { error } = await supabase.from(TABLE).delete().eq('id', selected.id)
    if (!error) {
      setStudents(prev => prev.filter(s => s.id !== selected.id))
      setSelected(null)
    }
    setDeleting(false)
  }

  const openEdit = () => { setEditStudent(selected); setModalOpen(true) }
  const openAdd  = () => { setEditStudent(null);     setModalOpen(true) }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5' }}>

      {/* Top bar */}
      <div style={styles.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Students</span>
          <span style={styles.countBadge}>{filtered.length}</span>
        </div>
        <button onClick={openAdd} style={styles.addBtn}>+ Add student</button>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <input
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          <SortBtn label="Name"  isSorted={sort === 'name'}     order={order} onClick={() => toggleSort('name')} />
          <SortBtn label="Class" isSorted={sort === 'class_of'} order={order} onClick={() => toggleSort('class_of')} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 24px 32px' }}>
        {loading && <p style={styles.muted}>Loading…</p>}
        {error   && <p style={{ color: '#c0392b', fontSize: 14 }}>{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
            <p style={{ fontWeight: 500, marginBottom: 4 }}>No students found</p>
            <p style={{ ...styles.muted, marginBottom: 16 }}>Try a different search or add a new student.</p>
            <button onClick={openAdd} style={styles.addBtn}>+ Add student</button>
          </div>
        )}

        <div style={styles.grid}>
          {paginated.map((s, i) => {
            const idx = students.indexOf(s)
            return (
              <StudentCard
                key={s.id}
                student={s}
                index={idx}
                isSelected={selected?.id === s.id}
                onClick={() => { setSelected(s); setSelectedIdx(idx) }}
              />
            )
          })}
        </div>

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span style={{ fontSize: 13, color: '#666' }}>Page {page} of {totalPages}</span>
            <button style={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      {selected && (
        <StudentDetail
          student={selected}
          index={selectedIdx}
          onClose={() => setSelected(null)}
          onEdit={openEdit}
          onDelete={handleDelete}
          deleting={deleting}
        />
      )}

      {modalOpen && (
        <StudentModal
          student={editStudent}
          onClose={() => { setModalOpen(false); setEditStudent(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function SortBtn({ label, isSorted, order, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
      background: isSorted ? '#111' : '#fff',
      color:      isSorted ? '#fff' : '#444',
      border:     isSorted ? '0.5px solid #111' : '0.5px solid #ddd',
    }}>
      {label} {isSorted ? (order === 'asc' ? '↑' : '↓') : '↕'}
    </button>
  )
}

const styles = {
  topbar: {
    background: '#fff', borderBottom: '0.5px solid #eee',
    padding: '0 24px', height: 54,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  countBadge: {
    background: '#E6F1FB', color: '#0C447C',
    fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 500,
  },
  addBtn: {
    background: '#111', color: '#fff', border: 'none', borderRadius: 8,
    padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 500,
  },
  controls: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 8, padding: '16px 24px 12px',
  },
  searchInput: {
    border: '0.5px solid #ddd', borderRadius: 8, padding: '8px 12px',
    fontSize: 13, width: 240, outline: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 12,
  },
  muted: { fontSize: 14, color: '#888' },
  emptyState: { textAlign: 'center', padding: '60px 24px', color: '#555' },
  pagination: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: 16, marginTop: 24,
  },
  pageBtn: {
    padding: '7px 14px', borderRadius: 8, border: '0.5px solid #ddd',
    background: '#fff', cursor: 'pointer', fontSize: 13,
  },
}
