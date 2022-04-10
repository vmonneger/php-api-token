import React, { useState } from 'react'

const initialState = {
  username: "",
  password: "",
};

export const FormAuth: React.FC<{isLogin: any, getUsername: any}> = ({isLogin, getUsername}) => {
  const [{ username, password }, setState] = useState(initialState);
  const [isRegistered, setIsRegistered] = useState<boolean>(false)
  const [logoutButton, setLogoutButton] = useState<boolean>(false)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState(prev => ({...prev, [name]: value }))
  }

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()

    let formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    const optionsFetch = {
      method: 'POST',
      body: formData,
      headers: new Headers()
    }
    
    if (isRegistered) {
      fetch('http://localhost:8000/login', optionsFetch)
      .then(resp => resp.json())
      .then((data) => {
        if (data.error) {
          alert(data.error)
        } else {
          console.log(data)
          localStorage.setItem('token', data.token)
          isLogin(true)
          getUsername(data.username)
          setLogoutButton(true)
          setState({ ...initialState });
        }
      })
    } else {
      fetch('http://localhost:8000/signup', optionsFetch)
      .then(resp => resp.json())
      .then((data) => {
        if (data.error) {
          alert('Ce pseudo est déjà utilisé')
        } else {
          console.log(data)
          setState({ ...initialState });
          setIsRegistered(true)
        }
      })
    }
  }

  const displayButton = () => {
    if (isRegistered) {
      return <button type="button" onClick={submit} style={{backgroundColor: 'green', color: 'white'}}>Se connecter</button>
    } else {
      return <button type="button" onClick={submit} style={{backgroundColor: 'blue', color: 'white'}}>Créer un compte</button>
    }
  }

  const logout = () => {
    localStorage.clear()
    isLogin(false)
    setLogoutButton(false)
    setIsRegistered(false)
  }


  return (
    <form action="" method="POST">
      <div className="form">
        <div>
          <label htmlFor="username"><b>Username</b></label>
          <input type="text" placeholder="Enter Username" value={username} name="username" required onChange={handleInput} />
        </div>
        <div>
          <label htmlFor="password"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" value={password} name="password" required onChange={handleInput} />
        </div>
        <div>
          {displayButton()}
          {
            logoutButton ?
              <button type="button" onClick={logout} style={{backgroundColor: 'red', color: 'white', marginLeft: '60px'}}>Se déconnecter</button>
            : null
          }
        </div>
      </div>
    </form>
  )
}