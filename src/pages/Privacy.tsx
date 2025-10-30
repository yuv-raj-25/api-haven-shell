import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Your privacy matters. This placeholder content can be
          replaced with the full privacy policy for API Haven. Outline
          what data you collect, how it is used, and the rights
          available to your users.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
