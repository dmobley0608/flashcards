import Loader from '../Loader';
// ... existing imports ...

export default function StudyDeck() {
  const { data, loading, error } = useQuery(GET_DECK, {
    variables: { id }
  });

  if (loading) {
    return <Loader progress={25} />;
  }

  if (error) return <p>Error...</p>;

  return (
    // ... existing JSX ...
  );
}
