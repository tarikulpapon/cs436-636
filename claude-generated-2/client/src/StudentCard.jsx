import React from "react";

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

const COLORS = ["#E6F1FB:#0C447C", "#E1F5EE:#085041", "#EEEDFE:#3C3489", "#FAECE7:#712B13"];

export default function StudentCard({ student, index }) {
  const [bg, fg] = COLORS[index % COLORS.length].split(":");
  const dob = student.dob
    ? new Date(student.dob).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div style={{
      background: "#fff", border: "0.5px solid #e5e5e5",
      borderRadius: 12, padding: 16, fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", background: bg, color: fg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 500, fontSize: 13, flexShrink: 0
        }}>
          {getInitials(student.name)}
        </div>
        <div>
          <div style={{ fontWeight: 500, fontSize: 14 }}>{student.name}</div>
          <div style={{ fontSize: 12, color: "#888" }}>Class of {student.class_of}</div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "0.5px solid #eee", marginBottom: 12 }} />

      {[
        ["Email",   student.email],
        ["DOB",     dob],
        ["Gender",  student.gender],
        ["Address", student.address],
      ].map(([label, value]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
          <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
          <span style={{ fontSize: 12, color: "#111", maxWidth: "60%", textAlign: "right" }}>{value || "—"}</span>
        </div>
      ))}
    </div>
  );
}