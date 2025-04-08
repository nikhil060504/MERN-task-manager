import { useEffect, useState } from "react";
import useFetch from "./useFetch";
const { stats, loading } = useTaskStats(token);

const useTaskStats = (token) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchData] = useFetch();

  useEffect(() => {
    if (!token) return;

    const config = {
      url: "/tasks/stats",
      method: "get",
      headers: { Authorization: `Bearer ${token}` }
    };

    fetchData(config, { showSuccessToast: false })
      .then((data) => {
        setStats(data);
      })
      .finally(() => setLoading(false));
  }, [token, fetchData]);

  return { stats, loading };
};

export default useTaskStats;
