const enter = "\u001B[?1049h";
const leave = "\u001B[?1049l";
let active = false;

export function enterAlternateScreen(stream: NodeJS.WriteStream = process.stdout): () => void {
  if (!stream.isTTY || active) return () => undefined;
  active = true; stream.write(enter);
  return () => { if (active) { active = false; stream.write(leave); } };
}
