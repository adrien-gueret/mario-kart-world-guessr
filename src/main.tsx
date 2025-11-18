import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import Router from "./Router.tsx";

if (!document.startViewTransition) {
  // @ts-ignore
  document.startViewTransition = (callback) => {
    // @ts-ignore
    callback();

    return {
      finished: Promise.resolve(),
    };
  };
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
