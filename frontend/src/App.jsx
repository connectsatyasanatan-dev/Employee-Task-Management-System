import { useEffect, useState } from "react";
import apiClient from "./api/client";

function App() {
  const [apiStatus, setApiStatus] = useState("Checking API connection...");

  useEffect(() => {
    apiClient
      .get("/health")
      .then((response) => {
      setApiStatus(`Backend response: ${JSON.stringify(response.data)}`);
      })
      .catch(() => {
        setApiStatus("Could not connect to the backend.");
      });
  }, []);

  return (
    <main>
      <h1>Task Management System</h1>
      <p>{apiStatus}</p>
    </main>
  );
}

export default App;