interface Props {
  title: string,
  content: string,
  username: string
}

export const Card = ({title, content, username}: Props) => {

  return (
    <div style={{border: '1px solid black', width: '50%', marginTop: '50px'}}>
      <h1>{title}</h1>
      <p>{content}</p>
      <p>Posté par: {username}</p>
    </div>
  )
}