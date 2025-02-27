import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Particles from "./components/Particles";
import DeckPage from "./pages/DeckPage";
import ManageDecks from "./pages/ManageDecks";
import MultipleChoicePage from "./pages/MultipleChoicePage";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useSession } from "@clerk/clerk-react";
import { LoaderProvider } from "./context/LoaderContext";

const App = () => {
  const { session } = useSession();

  const httpLink = createHttpLink({
    uri: "https://fcapi.tccs.tech/graphql",
  });

  const authLink = setContext(async (_, { headers }) => {
    // Get the token from Clerk session
    const token = await session?.getToken();

    // Return the headers to the context
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "network-only",
      },
    },
  });

  return (
    <LoaderProvider>
      <ApolloProvider client={client}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/deck/:id" element={<DeckPage />} />
          <Route path="/manage" element={<ManageDecks />} />
          <Route path="/ai-questions" element={<MultipleChoicePage />} />
        </Routes>
        <Particles />
      </ApolloProvider>
    </LoaderProvider>
  );
};

export default App;
