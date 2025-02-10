
import { Card } from 'react-bootstrap'



export default function DeckCard({deck}: {deck: {title:string, description:string, categories: {name:string}[]}}) {
    const categories = deck.categories.map((category => category.name))
  return (
   <Card style={{ width: '18rem' }}>
    <Card.Body>
        <Card.Title>{deck?.title}</Card.Title>
        <Card.Text>
        {deck?.description}
        </Card.Text>
    </Card.Body>
    <Card.Footer>
        <small className="text-muted">{categories.join(", ")}</small>
    </Card.Footer>
    </Card>

  )
}
