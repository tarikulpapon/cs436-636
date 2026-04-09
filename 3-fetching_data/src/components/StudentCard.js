const StudentCard = ({ student }) => {
  return (
    <div className="student-card">
      <h3>{student.id}</h3>
      <p>Name: {student.name}</p>
      <p>Email: {student.email}</p>
      <p>DOB: {student.dob}</p>
      <p>Address: {student.address}</p>
      <div className="rating">{student.gender}</div>
    </div>
  )
}

export default StudentCard