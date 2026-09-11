import { useEffect, useState } from "react";
import { getApiHealth } from "@/services/healthService";

type Status = "checking" | "online" | "offline";

/**
 * Pings the API health endpoint once on mount. Used to give a subtle
 * "connected" signal in the UI without blocking rendering.
 */
export function useApiHealth() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;

    getApiHealth()
      .then(() => {
        if (!cancelled) setStatus("online");
      })
      .catch(() => {
        if (!cancelled) setStatus("offline");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
