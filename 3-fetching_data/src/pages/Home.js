import supabase from '../config/supabaseClient'
import { useEffect, useState } from 'react'

// components
import StudentCard from '../components/StudentCard'

const Home = () => {
  const [fetchError, setFetchError] = useState(null)
  const [students, setStudents] = useState(null)

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('umb_students')
        .select()
      
      if (error) {
        setFetchError('Could not fetch the students')
        setStudents(null)
      }
      if (data) {
        setStudents(data)
        setFetchError(null)
      }
    }

    fetchStudents()

  }, [])

  return (
    <div className="page home">
      {fetchError && (<p>{fetchError}</p>)}
      {students && (
        <div className="students">
          {/* order-by buttons */}
          <div className="student-grid">
            {students.map(student => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home