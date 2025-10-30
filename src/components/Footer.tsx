import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-6 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="link"
            className="px-0 text-sm"
            onClick={() => navigate("/privacy")}
          >
            Privacy Policy
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant="link"
            className="px-0 text-sm"
            onClick={() => navigate("/terms")}
          >
            Terms & Conditions
          </Button>
        </div>
        <p className="text-xs text-muted-foreground/80">
          © {new Date().getFullYear()} API Haven. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
