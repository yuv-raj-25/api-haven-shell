import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Shield,
  CloudLightning,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

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
                onClick={() => navigate("/settings")}
              >
                View Saved Requests
              </Button>
            </motion.div>
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
