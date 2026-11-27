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
          background: "linear-gradient(180deg, rgba(20,5,6,.50) 0%, rgba(20,5,6,.78) 45%, rgba(20,5,6,.94) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,.5) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(60% 40% at 50% 0%, rgba(212,165,55,.16), transparent)",
        }}
      />
    </div>
  );
}
