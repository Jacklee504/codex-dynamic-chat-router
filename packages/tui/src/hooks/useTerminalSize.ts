import { useStdout } from "ink";
import { useEffect, useState } from "react";

export function useTerminalSize() {
  const { stdout } = useStdout(); const read = () => ({ columns: stdout.columns ?? 80, rows: stdout.rows ?? 24 }); const [size, setSize] = useState(read);
  useEffect(() => { const update = () => setSize(read()); stdout.on("resize", update); return () => { stdout.off("resize", update); }; }, [stdout]);
  return size;
}
