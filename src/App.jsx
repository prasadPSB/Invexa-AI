import { useState } from 'react'
import './App.css'
import Merger from './Components/Meger'
import Auth from './Components/Auth'

function App() {
  const [user, setUser] = useState(null)

  if (!user) {
    return <Auth onAuth={setUser} />
  }

  return <Merger user={user} onSignOut={() => setUser(null)} />
}

export default App
