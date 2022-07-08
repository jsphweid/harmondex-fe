import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";

axios.defaults.baseURL = "http://localhost:8080";

export const wrapPageElement = ({ element }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>
  );
};
