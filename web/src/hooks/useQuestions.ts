import { useLoader } from "../context/LoaderContext";

export function useQuestions() {
  const { setIsLoading } = useLoader();

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      // ...existing fetch logic...
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    return () => {
      setIsLoading(false); // Cleanup on unmount
    };
  }, []);

  // ...existing code...
}
