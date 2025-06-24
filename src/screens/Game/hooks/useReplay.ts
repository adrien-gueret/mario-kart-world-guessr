import { useState, useCallback } from "react";

export default function useReplay() {
  const [playIndex, setPlayIndex] = useState(0);

  const replay = useCallback(() => {
    setPlayIndex((prevIndex) => prevIndex + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return {
    playIndex,
    replay,
  };
}
