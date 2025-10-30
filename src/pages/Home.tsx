import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Shield,
  CloudLightning,
  Download,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const platform = navigator.platform.toLowerCase();
    const isMac = platform.includes("mac");
    const isWindows = platform.includes("win");

    // For now, we have a macOS build
    if (isMac) {
      window.location.href =
        "/release/build/api-haven-setup-0.0.0.dmg";
    } else if (isWindows) {
      alert(
        "Windows version coming soon! Use the web version for now."
      );
    } else {
      alert(
        "Linux version coming soon! Use the web version for now."
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden px-6 py-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold sm:text-5xl md:text-6xl"
            >
              Build, test, and manage APIs without friction
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 max-w-2xl text-lg text-muted-foreground"
            >
              API Haven combines a powerful workspace, reusable
              collections, and collaboration-ready tooling so your
              team can ship reliable integrations faster.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => navigate("/workspace")}
              >
                Launch Workspace
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download for Desktop
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold">Desktop & Web</h2>
              <p className="mt-3 text-muted-foreground">
                Choose your preferred way to work with API Haven
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col gap-4 px-6 py-8">
                  <Download className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold">
                      Desktop App
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Native performance with offline support.
                      Download the standalone application for macOS,
                      Windows, or Linux.
                    </p>
                  </div>
                  <Button
                    onClick={handleDownload}
                    className="mt-2 w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Now
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Available for macOS (Apple Silicon & Intel)
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col gap-4 px-6 py-8">
                  <CloudLightning className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold">
                      Web Version
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Access from anywhere without installation.
                      Perfect for quick testing and collaboration.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/workspace")}
                    variant="outline"
                    className="mt-2 w-full"
                  >
                    Launch Web App
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Works in all modern browsers
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-card/40 px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="border-border/60 bg-card/80"
              >
                <CardContent className="flex flex-col gap-4 px-6 py-8">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl border border-border bg-card/70 p-10 text-center">
            <h2 className="text-3xl font-semibold">
              Ready to explore API Haven?
            </h2>
            <p className="text-muted-foreground">
              Run requests, capture responses, and document best
              practices all in one place. Jump into the workspace and
              start building today.
            </p>
            <Button
              size="lg"
              className="mx-auto"
              onClick={() => navigate("/workspace")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const FEATURES = [
  {
    title: "Dynamic collections",
    description:
      "Group requests, sync with your backend, and reuse them across environments.",
    icon: Sparkles,
  },
  {
    title: "Secure by default",
    description:
      "Store credentials safely and manage access with granular permissions.",
    icon: Shield,
  },
  {
    title: "Always up to date",
    description:
      "Track response history, share insights, and spot regressions instantly.",
    icon: CloudLightning,
  },
];

export default Home;
