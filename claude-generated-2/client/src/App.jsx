import React, { useState, useEffect, useCallback } from "react";
import StudentModal from "./StudentModal";
import StudentDetail from "./StudentDetail";

const AVATAR_COLORS = [
  ["#E6F1FB", "#0C447C"],
  ["#E1F5EE", "#085041"],
  ["#EEEDFE", "#3C3489"],
  ["#FAECE7", "#712B13"],
  ["#FBEAF0", "#72243E"],
  ["#EAF3DE", "#27500A"],
];

const PAGE_SIZE = 9;

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function App() {
  const [students, setStudents]     = useState([]);
  const [search, setSearch]         = useState("");
  const [sort, setSort]             = useState("name");
  const [order, setOrder]           = useState("asc");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [page, setPage]             = useState(1);

  // Detail panel
  const [selected, setSelected]     = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [deleting, setDeleting]     = useState(false);

  // Modal
  const [modalOpen, setModalOpen]   = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  const fetchStudents = useCallback(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/students?sort=${sort}&order=${order}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudents(data);
          setError(null);
        } else {
          setError("Server error: " + (data.error || "unexpected response"));
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Could not reach server.");
        setLoading(false);
      });
  }, [sort, order]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { setPage(1); }, [search, sort, order]);

  const filtered = students.filter((s) =>
    (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (col) => {
    if (sort === col) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSort(col); setOrder("asc"); }
  };

  // CRUD handlers
  const handleSave = (saved, isEdit) => {
    if (isEdit) {
      setStudents((prev) => prev.map((s) => s.id === saved.id ? saved : s));
      if (selected?.id === saved.id) setSelected(saved);
    } else {
      setStudents((prev) => [...prev, saved]);
    }
    setModalOpen(false);
    setEditStudent(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm(`Delete ${selected.name}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/students/${selected.id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== selected.id));
        setSelected(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = () => {
    setEditStudent(selected);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditStudent(null);
    setModalOpen(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "system-ui, sans-serif" }}>

      {/* Top bar */}
      <div style={topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Students</span>
          <span style={countBadge}>{filtered.length}</span>
        </div>
        <button onClick={openAdd} style={addBtn}>+ Add student</button>
      </div>

      {/* Controls */}
      <div style={controls}>
        <input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInput}
        />
        <div style={{ display: "flex", gap: 6 }}>
          <SortBtn label="Name" active={sort === "name"} order={order} onClick={() => toggleSort("name")} isSorted={sort === "name"} />
          <SortBtn label="Class" active={sort === "class_of"} order={order} onClick={() => toggleSort("class_of")} isSorted={sort === "class_of"} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "0 24px 32px" }}>
        {loading && <p style={muted}>Loading…</p>}
        {error   && <p style={{ color: "#c0392b", fontSize: 14 }}>{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div style={emptyState}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
            <p style={{ fontWeight: 500, marginBottom: 4 }}>No students found</p>
            <p style={{ ...muted, marginBottom: 16 }}>Try a different search or add a new student.</p>
            <button onClick={openAdd} style={addBtn}>+ Add student</button>
          </div>
        )}

        <div style={grid}>
          {paginated.map((s, i) => {
            const idx = students.indexOf(s);
            const [bg, fg] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            return (
              <div
                key={s.id}
                style={{ ...card, ...(selected?.id === s.id ? cardActive : {}) }}
                onClick={() => { setSelected(s); setSelectedIdx(idx); }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ ...avatar, background: bg, color: fg }}>{getInitials(s.name)}</div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>Class of {s.class_of || "—"}</div>
                  </div>
                </div>
                <hr style={divider} />
                <CardRow label="Email" value={s.email} />
                <CardRow label="Gender" value={s.gender} />
                <CardRow label="Address" value={s.address} />
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={pagination}>
            <button style={pageBtn} disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <span style={{ fontSize: 13, color: "#666" }}>
              Page {page} of {totalPages}
            </span>
            <button style={pageBtn} disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      {/* Detail panel */}
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

      {/* Add/Edit modal */}
      {modalOpen && (
        <StudentModal
          student={editStudent}
          onClose={() => { setModalOpen(false); setEditStudent(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function CardRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
      <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
      <span style={{ fontSize: 12, color: "#111", maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function SortBtn({ label, isSorted, order, onClick }) {
  return (
    <button onClick={onClick} style={{
      ...sortBtnBase,
      background: isSorted ? "#111" : "#fff",
      color: isSorted ? "#fff" : "#444",
      border: isSorted ? "0.5px solid #111" : "0.5px solid #ddd",
    }}>
      {label} {isSorted ? (order === "asc" ? "↑" : "↓") : "↕"}
    </button>
  );
}

// Styles
const topbar = {
  background: "#fff", borderBottom: "0.5px solid #eee",
  padding: "0 24px", height: 54,
  display: "flex", alignItems: "center", justifyContent: "space-between",
};
const countBadge = {
  background: "#E6F1FB", color: "#0C447C",
  fontSize: 11, padding: "3px 8px", borderRadius: 20, fontWeight: 500,
};
const addBtn = {
  background: "#111", color: "#fff", border: "none", borderRadius: 8,
  padding: "8px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
};
const controls = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  flexWrap: "wrap", gap: 8, padding: "16px 24px 12px",
};
const searchInput = {
  border: "0.5px solid #ddd", borderRadius: 8, padding: "8px 12px",
  fontSize: 13, width: 240, fontFamily: "inherit", outline: "none",
};
const sortBtnBase = {
  padding: "7px 12px", borderRadius: 8, fontSize: 12,
  cursor: "pointer", fontFamily: "inherit", fontWeight: 500, transition: "all 0.15s",
};
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 12,
};
const card = {
  background: "#fff", border: "0.5px solid #eee",
  borderRadius: 12, padding: 16, cursor: "pointer",
  transition: "box-shadow 0.15s, border-color 0.15s",
};
const cardActive = {
  border: "1px solid #378ADD", boxShadow: "0 0 0 3px rgba(55,138,221,0.1)",
};
const avatar = {
  width: 40, height: 40, borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontWeight: 500, fontSize: 13, flexShrink: 0,
};
const divider = { border: "none", borderTop: "0.5px solid #f0f0f0", margin: "0 0 10px" };
const muted = { fontSize: 14, color: "#888" };
const emptyState = {
  textAlign: "center", padding: "60px 24px", color: "#555",
};
const pagination = {
  display: "flex", justifyContent: "center", alignItems: "center",
  gap: 16, marginTop: 24,
};
const pageBtn = {
  padding: "7px 14px", borderRadius: 8, border: "0.5px solid #ddd",
  background: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit",
};
