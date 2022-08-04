import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";

axios.defaults.baseURL = "http://localhost:8080";
// axios.defaults.baseURL = "http://192.168.1.12:8080";

export const wrapPageElement = ({ element }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>
  );
};
