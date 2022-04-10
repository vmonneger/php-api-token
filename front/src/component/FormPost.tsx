import { useState, useEffect } from 'react'

const initialState = {
  title: "",
  content: "",
};

export const FormPost: React.FC<{refetchQuery: any}> = ({refetchQuery}) => {
  const [{ title, content }, setState] = useState(initialState);

  const handleInput = (e: any) => {
    const { name, value } = e.target
    setState(prev => ({...prev, [name]: value }))
  }

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()

    let formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)

    const optionsFetch: any = {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    }
    
    fetch('http://localhost:8000/post', optionsFetch)
    .then(resp => resp.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error)
        alert('token invalide')
      } else {
        refetchQuery(true)
        setState({ ...initialState });
      }
    })
  }


  return (
    <form action="" method="POST">
      <div className="form">
        <div>
          <label htmlFor="title"><b>title</b></label>
          <input type="text" placeholder="Enter title" value={title} name="title" required onChange={handleInput} />
        </div>
        <div>
          <label htmlFor="content"><b>content</b></label>
          <textarea placeholder="Enter content" style={{width: '320px', height: '200px'}} value={content} name="content" required onChange={handleInput} />
        </div>
        <div>
          <button type="button" onClick={submit} style={{backgroundColor: 'blue', color: 'white'}}>Poster</button>
        </div>
      </div>
    </form>
  )
}