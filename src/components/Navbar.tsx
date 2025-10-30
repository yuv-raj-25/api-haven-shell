import {
  Settings,
  Moon,
  Sun,
  Code2,
  LayoutDashboard,
  Star,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/yuv-raj-25/api-haven-shell")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStarCount(data.stargazers_count);
        }
      })
      .catch((err) =>
        console.error("Failed to fetch GitHub stars:", err)
      );
  }, []);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-14 border-b border-border bg-card flex items-center justify-between px-4"
    >
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md border border-transparent px-1 py-1 transition hover:border-border focus:outline-none focus-visible:border-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            API Haven
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() =>
            window.open(
              "https://github.com/yuv-raj-25/api-haven-shell",
              "_blank"
            )
          }
        >
          <Github className="h-4 w-4" />
          <Star className="h-3.5 w-3.5" />
          {starCount !== null && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
              {starCount.toLocaleString()}
            </span>
          )}
        </Button>
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => navigate("/workspace")}
        >
          <LayoutDashboard className="h-4 w-4" />
          Workspace
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
          className="h-9 w-9"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </motion.nav>
  );
};
