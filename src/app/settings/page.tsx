import MainNav from "~/components/navigation/MainNav";

export default function Settings() {
  return (
    <>
      <MainNav />
      <main className="flex min-h-screen flex-col items-center justify-center gap-32 bg-background p-5 text-foreground">
        <div className="text-4xl">Settings</div>
      </main>
    </>
  );
}
