import React, { useState, useEffect } from "react";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 2 + i);

const EMPTY = { id: "", name: "", email: "", address: "", dob: "", gender: "", class_of: "" };

export default function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!(student && student.id);

  useEffect(() => {
    if (student) {
      setForm({
        id: student.id || "",
        name: student.name || "",
        email: student.email || "",
        address: student.address || "",
        dob: student.dob ? student.dob.slice(0, 10) : "",
        gender: student.gender || "",
        class_of: student.class_of || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [student]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.id.toString().trim()) {
      setError("Student ID is required.");
      return;
    }
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const url = isEdit
        ? `http://localhost:3001/api/students/${student.id}`
        : "http://localhost:3001/api/students";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      onSave(data, isEdit);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={modalHeader}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>
            {isEdit ? "Edit student" : "Add student"}
          </span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <div style={body}>
          {error && <div style={errorBox}>{error}</div>}

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Student ID *</label>
            <input
              type="text"
              value={form.id}
              onChange={set("id")}
              placeholder="e.g. STU-001"
              readOnly={isEdit}
              style={{ ...input, ...(isEdit ? readonlyStyle : {}) }}
            />
            {isEdit && (
              <span style={{ fontSize: 11, color: "#999", marginTop: 3, display: "block" }}>
                ID cannot be changed after creation
              </span>
            )}
          </div>

          <div style={grid2}>
            <Field label="Full name *" value={form.name} onChange={set("name")} placeholder="Jane Smith" />
            <Field label="Email *" value={form.email} onChange={set("email")} placeholder="jane@school.edu" type="email" />
          </div>
          <div style={grid2}>
            <Field label="Date of birth" value={form.dob} onChange={set("dob")} type="date" />
            <div>
              <label style={labelStyle}>Gender</label>
              <select value={form.gender} onChange={set("gender")} style={input}>
                <option value="">— select —</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
          <div style={grid2}>
            <div>
              <label style={labelStyle}>Class of</label>
              <select value={form.class_of} onChange={set("class_of")} style={input}>
                <option value="">— select —</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <Field label="Address" value={form.address} onChange={set("address")} placeholder="123 Main St" />
          </div>
        </div>

        <div style={footer}>
          <button onClick={onClose} style={cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving} style={saveBtn}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add student"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={input} />
    </div>
  );
}

const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
};
const modal = {
  background: "#fff", borderRadius: 14, width: "100%", maxWidth: 540,
  margin: "0 16px", fontFamily: "system-ui, sans-serif", overflow: "hidden",
  boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
};
const modalHeader = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "16px 20px", borderBottom: "0.5px solid #eee",
};
const closeBtn = {
  background: "none", border: "none", cursor: "pointer", fontSize: 16,
  color: "#888", lineHeight: 1, padding: 4,
};
const body = { padding: "20px 20px 8px" };
const footer = {
  display: "flex", justifyContent: "flex-end", gap: 8,
  padding: "12px 20px", borderTop: "0.5px solid #eee",
};
const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 };
const labelStyle = { display: "block", fontSize: 12, color: "#666", marginBottom: 4, fontWeight: 500 };
const input = {
  width: "100%", boxSizing: "border-box", border: "0.5px solid #ddd",
  borderRadius: 8, padding: "8px 10px", fontSize: 13, outline: "none",
  fontFamily: "inherit", background: "#fafafa",
};
const readonlyStyle = {
  background: "#f1f1ef", color: "#888", cursor: "not-allowed",
};
const errorBox = {
  background: "#fff0f0", border: "0.5px solid #f5c6c6", borderRadius: 8,
  padding: "10px 12px", fontSize: 13, color: "#c0392b", marginBottom: 12,
};
const cancelBtn = {
  padding: "8px 16px", borderRadius: 8, border: "0.5px solid #ddd",
  background: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit",
};
const saveBtn = {
  padding: "8px 18px", borderRadius: 8, border: "none",
  background: "#111", color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit",
};
