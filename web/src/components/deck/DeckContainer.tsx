import React from 'react'
import { Container } from 'react-bootstrap'
import DeckCard from './DeckCard'

export default function DeckContainer({decks}: {decks: any}) {
  return (
    <Container>
        {decks.map((deck: {title:string, description:string, categories:[]}, index: React.Key ) => {
            return (
                <DeckCard key={index} deck={deck}/>
            )
        }
        )}
    </Container>
  )
}
