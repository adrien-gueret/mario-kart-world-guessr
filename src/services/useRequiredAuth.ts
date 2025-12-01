import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

export default function useRequiredAuth() {
  const { isAnonymous } = useCurrentUser();

  const location = useLocation();
  // TODO: check location
  const navigate = useNavigate();

  useEffect(() => {
    if (isAnonymous) {
      navigate("/login", {
        state: {
          targetUrl: location.pathname,
        },
      });
    }
  }, [isAnonymous, navigate, location.pathname]);

  return isAnonymous;
}
