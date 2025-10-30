import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
        <h1 className="text-3xl font-bold">Terms & Conditions</h1>
        <p className="text-muted-foreground">
          Set out how customers can use API Haven, acceptable usage
          guidelines, and the process for resolving disputes. Replace
          this placeholder with the full legal text when ready.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
