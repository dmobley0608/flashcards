import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { GET_DECKS } from '../Queries/DeckQueries'
import DeckContainer from '../components/deck/DeckContainer'

export default function Homepage() {
    const {data, loading, error} = useQuery(GET_DECKS)

    useEffect(() => { }, [data])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error...</p>

  return (
    <div>
        <p>searchbar</p>
        <DeckContainer decks={data.decks}/>
    </div>
  )
}
