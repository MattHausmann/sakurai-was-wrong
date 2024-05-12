import { useState, useEffect } from "react";

function getDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useDimensions() {
  const [_windowDimensions, _setDimensions] = useState(getDimensions());

  useEffect(() => {
    function handleResize() {
      _setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return _windowDimensions;
}
