import MainNav from "~/components/navigation/MainNav";

export default function Dashboard() {
  return (
    <>
      <MainNav />
      <main className="flex flex-col items-center justify-center gap-8 bg-background p-5 text-foreground">
        <div className="text-4xl">Dashboard</div>
        <div className="text-2xl">🚧UNDER CONSTRUCTION🚧</div>
      </main>
    </>
  );
}
