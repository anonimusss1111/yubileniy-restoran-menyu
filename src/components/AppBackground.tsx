export default function AppBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <img
        src="/images/bg-restaurant-1280.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(26,7,8,.55) 0%, rgba(26,7,8,.82) 45%, rgba(26,7,8,.94) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.45) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(60% 40% at 50% 0%, rgba(212,165,55,.18), transparent)",
        }}
      />
    </div>
  );
}
