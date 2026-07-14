export default function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-accent/30 border-t-accent"
      style={{ width: size, height: size }}
    />
  );
}
