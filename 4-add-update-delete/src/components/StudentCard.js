import supabase from "../config/supabaseClient"
import { Link } from 'react-router-dom'

const StudentCard = ({ student, onDelete }) => {

  const handleDelete = async () => {
    const { error } = await supabase
      .from('umb_students')
      .delete()
      .eq('id', student.id)
    
    if (error) {
      console.log(error)
    } else {
      onDelete(student.id)
    }
  }

  return (
    <div className="student-card">
      <h3>{student.name}</h3>
      <p>Email: {student.email}</p>
      <p>DOB: {student.dob}</p>
      <p>Address: {student.address}</p>
      <div className="gender">{student.gender}</div>
      <div className="buttons">
        <Link to={"/" + student.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>delete</i>
      </div>
    </div>
  )
}

export default StudentCard
