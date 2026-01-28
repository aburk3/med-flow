import { useEffect, useState } from "react";
import { fetchDashboard } from "@/lib/api";
import type { DashboardPayload } from "@/types/api";
import { DASHBOARD_TEXT } from "@/pages/Dashboard/constants";

const useDashboardData = () => {
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchDashboard({ fromDate: new Date() })
      .then((payload) => {
        if (isMounted) {
          setDashboard(payload);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(DASHBOARD_TEXT.error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { dashboard, error };
};

export { useDashboardData };
