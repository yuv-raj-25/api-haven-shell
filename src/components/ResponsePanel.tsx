import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const ResponsePanel = () => {
  const statusCode = 200;
  const responseTime = 234;
  const responseSize = 1.2;
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const mockResponse = {
    users: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "Admin",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "User",
      },
    ],
    total: 2,
    page: 1,
  };

  const formattedResponse = JSON.stringify(mockResponse, null, 2);

  const handleCopyBody = async () => {
    try {
      await navigator.clipboard.writeText(formattedResponse);
      toast({
        title: "Response body copied",
        description: "The JSON payload is ready to paste.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description:
          "We couldn't copy the response. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isExpanded]);

  return (
    <>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className={cn(
          "flex min-h-0 flex-col",
          isExpanded
            ? "fixed inset-0 z-50 h-screen border border-border bg-background shadow-2xl"
            : "h-[40vh] border-t border-border bg-card"
        )}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <h3 className="text-sm font-semibold">Response</h3>
          <div className="flex items-center gap-3 text-xs">
            <Badge
              variant={statusCode === 200 ? "default" : "destructive"}
              className="font-mono"
            >
              {statusCode} OK
            </Badge>
            <span className="text-muted-foreground">
              Time: {responseTime}ms
            </span>
            <span className="text-muted-foreground">
              Size: {responseSize}KB
            </span>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  Exit full view
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  Full view
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="body"
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            isExpanded ? "p-6" : ""
          )}
        >
          <TabsList className="mx-4 mt-2 w-fit gap-2">
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="cookies">Cookies</TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 px-4 pb-4">
            <TabsContent
              value="body"
              className="relative mt-0 h-full overflow-hidden rounded-lg border border-border bg-code-bg"
            >
              <div className="absolute right-4 top-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">Pretty JSON</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyBody}
                >
                  Copy
                </Button>
              </div>
              <div className="h-full overflow-auto p-4 pt-14">
                <pre className="min-w-full whitespace-pre font-mono text-sm text-foreground">
                  {formattedResponse}
                </pre>
              </div>
            </TabsContent>

            <TabsContent
              value="headers"
              className="mt-0 h-full overflow-hidden rounded-lg border border-border bg-code-bg"
            >
              <div className="h-full overflow-auto p-4">
                <dl className="space-y-3 font-mono text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <dt className="text-primary font-semibold">
                      Content-Type
                    </dt>
                    <dd className="text-foreground">
                      application/json
                    </dd>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <dt className="text-primary font-semibold">
                      Content-Length
                    </dt>
                    <dd className="text-foreground">1245</dd>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <dt className="text-primary font-semibold">
                      Server
                    </dt>
                    <dd className="text-foreground">nginx/1.18.0</dd>
                  </div>
                </dl>
              </div>
            </TabsContent>

            <TabsContent
              value="cookies"
              className="mt-0 h-full overflow-hidden rounded-lg border border-border bg-code-bg"
            >
              <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                No cookies in this response
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </>
  );
};
