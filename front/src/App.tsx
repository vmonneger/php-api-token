import { useState, useEffect } from 'react'
import { FormAuth } from './component/FormAuth'
import { FormPost } from './component/FormPost'
import { Card } from './component/Card'
import './App.css'

interface Articles {
  title: string,
  content: string,
  username: string,
  id: string
}

function App() {
  const [articles, setArticles] = useState<Array<Articles>>([])
  const [isRegistered, setIsRegistered] = useState<boolean>(false)
  const [refetchQuery, setRefetchQuery] = useState<boolean>(false)

  useEffect(() => {
    if (articles.length === 0) {
      fetchArticles()
    }
    if (refetchQuery) {
      fetchArticles()
      setRefetchQuery(false)
    }
  }, [refetchQuery])

  const fetchArticles = () => {
    const optionsFetch: any = {
      method: 'GET',
    }

    fetch('http://localhost:5000/back/articles', optionsFetch)
      .then(resp => resp.json())
      .then((data) => {
        setArticles(data)
      })
  }

  let cardsParsed = []
  for (let i = 0; i < articles.length; i++) {
    cardsParsed.push(
      <Card 
        key={articles[i].id}
        username={articles[i].username} 
        title={articles[i].title}
        content={articles[i].content}
      />
    )
  }
  
  return (
    <div className="App">
      <FormAuth isLogin={setIsRegistered} />
      <div className="content">
        {
          isRegistered ? <FormPost refetchQuery={setRefetchQuery} /> : null
        }
      </div>
        {cardsParsed}
    </div>
  )
}

export default App
