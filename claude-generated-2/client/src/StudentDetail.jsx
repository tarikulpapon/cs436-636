import React from "react";

const AVATAR_COLORS = [
  ["#E6F1FB", "#0C447C"],
  ["#E1F5EE", "#085041"],
  ["#EEEDFE", "#3C3489"],
  ["#FAECE7", "#712B13"],
  ["#FBEAF0", "#72243E"],
  ["#EAF3DE", "#27500A"],
];

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDob(dob) {
  if (!dob) return "—";
  return new Date(dob).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function calcAge(dob) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function StudentDetail({ student, index, onClose, onEdit, onDelete, deleting }) {
  if (!student) return null;
  const [bg, fg] = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const age = calcAge(student.dob);

  return (
    <>
      <div style={backdrop} onClick={onClose} />
      <div style={panel}>
        <button onClick={onClose} style={closeBtn}>✕</button>

        <div style={avatarWrap}>
          <div style={{ ...avatarCircle, background: bg, color: fg }}>
            {getInitials(student.name)}
          </div>
          <h2 style={{ margin: "12px 0 2px", fontSize: 20, fontWeight: 600 }}>{student.name}</h2>
          <span style={classPill}>Class of {student.class_of || "—"}</span>
        </div>

        <div style={section}>
          <Row label="Email" value={<a href={`mailto:${student.email}`} style={{ color: "#185FA5" }}>{student.email}</a>} />
          <Row label="Date of birth" value={age ? `${formatDob(student.dob)} (age ${age})` : formatDob(student.dob)} />
          <Row label="Gender" value={student.gender || "—"} />
          <Row label="Address" value={student.address || "—"} />
        </div>

        <div style={actions}>
          <button onClick={onEdit} style={editBtn}>Edit</button>
          <button onClick={onDelete} disabled={deleting} style={deleteBtn}>
            {deleting ? "Deleting…" : "Delete student"}
          </button>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div style={row}>
      <span style={rowLabel}>{label}</span>
      <span style={rowValue}>{value}</span>
    </div>
  );
}

const backdrop = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 50,
};
const panel = {
  position: "fixed", top: 0, right: 0, bottom: 0, width: 360,
  background: "#fff", boxShadow: "-4px 0 30px rgba(0,0,0,0.12)",
  zIndex: 51, overflowY: "auto", fontFamily: "system-ui, sans-serif",
};
const closeBtn = {
  position: "absolute", top: 14, right: 14, background: "none", border: "none",
  cursor: "pointer", fontSize: 16, color: "#999", padding: 4,
};
const avatarWrap = {
  display: "flex", flexDirection: "column", alignItems: "center",
  padding: "48px 24px 24px", borderBottom: "0.5px solid #eee", textAlign: "center",
};
const avatarCircle = {
  width: 72, height: 72, borderRadius: "50%", display: "flex",
  alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 600,
};
const classPill = {
  display: "inline-block", background: "#f1f1ef", color: "#555",
  fontSize: 12, padding: "3px 10px", borderRadius: 20, marginTop: 6,
};
const section = { padding: "20px 24px" };
const row = {
  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
  padding: "10px 0", borderBottom: "0.5px solid #f0f0f0",
};
const rowLabel = { fontSize: 12, color: "#888", fontWeight: 500, paddingTop: 1 };
const rowValue = { fontSize: 13, color: "#111", maxWidth: "60%", textAlign: "right" };
const actions = {
  padding: "8px 24px 32px", display: "flex", flexDirection: "column", gap: 8,
};
const editBtn = {
  padding: "10px", borderRadius: 8, border: "0.5px solid #ddd",
  background: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 500,
};
const deleteBtn = {
  padding: "10px", borderRadius: 8, border: "0.5px solid #fcc",
  background: "#fff8f8", color: "#c0392b", cursor: "pointer",
  fontSize: 13, fontFamily: "inherit", fontWeight: 500,
};
