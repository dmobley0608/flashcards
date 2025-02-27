import { LoadingSpinner } from "./LoadingSpinner";
import { useLoader } from "../context/LoaderContext";

export function QuestionComponent() {
  // Remove any local loading state if it exists
  const { isLoading } = useLoader();

  // ...existing code...

  return (
    <div>
      <LoadingSpinner />
      {/* Remove any existing loading indicators and use LoadingSpinner component */}
      // ...existing code...
    </div>
  );
}
