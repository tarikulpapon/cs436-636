import { useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient"

const Create = () => {
  const navigate = useNavigate()

  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [address, setAddress] = useState('')
  const [gender, setGender] = useState('')
  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!id || !name || !email || !dob || !address || !gender) {
      setFormError('Please fill in all the fields correctly.')
      return
    }

    const { data, error } = await supabase
      .from('umb_students')
      .insert([{ id, name, email, dob, address, gender }])

    if (error) {
      console.log(error)
      setFormError('Please fill in all the fields correctly.')
    }
    if (data) {
      console.log(data)
      setFormError(null)
      navigate('/')
    }
  }

  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>
        <label htmlFor="id">Student ID:</label>
        <input
          type="text"
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="dob">Date of Birth:</label>
        <input
          type="date"
          id="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <label htmlFor="address">Address:</label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label htmlFor="gender">Gender:</label>
        <input
          type="text"
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />

        <button>Create Student</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}

export default Create