export const fetchToken = async (username: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }
  
      const data = await response.json(); // Access token data
      return {
        access: data.access,
        refresh: data.refresh,
      };
    } catch (error) {
      console.error("Error fetching token:", error);
      throw error;
    }
  };
  