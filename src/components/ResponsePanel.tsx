import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { ExecutionResult } from "@/types/execution";

interface ResponsePanelProps {
  response: ExecutionResult | null;
  isLoading: boolean;
  error: string | null;
}

const formatSize = (bytes: number | undefined) => {
  if (bytes === undefined || bytes === null) {
    return "—";
  }
  if (!Number.isFinite(bytes)) {
    return "—";
  }
  const value = bytes;
  if (value <= 0) {
    return "0 B";
  }
  if (value < 1024) {
    return `${value} B`;
  }
  const kb = value / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
};

export const ResponsePanel = ({
  response,
  isLoading,
  error,
}: ResponsePanelProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const bodyContent = useMemo(() => {
    if (error) {
      return error;
    }
    if (!response) {
      return "Send a request to view the response body.";
    }
    if (!response.body) {
      return "The response did not include a body.";
    }
    if (response.bodyFormat === "json") {
      try {
        const parsed = JSON.parse(response.body);
        return JSON.stringify(parsed, null, 2);
      } catch (parseError) {
        console.warn("Failed to format JSON response", parseError);
      }
    }
    return response.body;
  }, [response, error]);

  const copyPayload = response?.body ?? bodyContent ?? "";

  const statusCode = response?.status ?? (error ? 0 : undefined);
  const statusText =
    response?.statusText ??
    (error ? "Request Failed" : "No response yet");
  const responseTime = response?.timeMs;
  const responseSize = response?.size;
  const headerEntries = response?.headers ?? [];

  const handleCopyBody = async () => {
    try {
      await navigator.clipboard.writeText(copyPayload);
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
              variant={
                response?.ok
                  ? "default"
                  : error
                  ? "destructive"
                  : "secondary"
              }
              className="font-mono"
            >
              {statusCode !== undefined
                ? `${statusCode} ${statusText}`
                : "No response"}
            </Badge>
            <span className="text-muted-foreground">
              Time:{" "}
              {responseTime !== undefined ? `${responseTime}ms` : "—"}
            </span>
            <span className="text-muted-foreground">
              Size: {formatSize(responseSize)}
            </span>
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
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
                  disabled={!copyPayload || copyPayload.length === 0}
                >
                  Copy
                </Button>
              </div>
              <div className="h-full overflow-auto p-4 pt-14">
                <pre className="min-w-full whitespace-pre font-mono text-sm text-foreground">
                  {bodyContent}
                </pre>
              </div>
            </TabsContent>

            <TabsContent
              value="headers"
              className="mt-0 h-full overflow-hidden rounded-lg border border-border bg-code-bg"
            >
              <div className="h-full overflow-auto p-4">
                {headerEntries.length > 0 ? (
                  <dl className="space-y-3 font-mono text-sm">
                    {headerEntries.map((header) => (
                      <div
                        key={header.key}
                        className="flex flex-wrap items-center gap-3"
                      >
                        <dt className="text-primary font-semibold">
                          {header.key}
                        </dt>
                        <dd className="text-foreground">
                          {header.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    {response
                      ? "No headers returned"
                      : "Send a request to inspect response headers."}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="cookies"
              className="mt-0 h-full overflow-hidden rounded-lg border border-border bg-code-bg"
            >
              <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                Cookie parsing is not implemented yet.
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </>
  );
};
