import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const ResponsePanel = () => {
  const [responseTime] = useState(234);
  const [responseSize] = useState(1.2);
  const [statusCode] = useState(200);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="h-[40vh] border-t border-border bg-card flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h3 className="text-sm font-semibold">Response</h3>
        <div className="flex items-center gap-3 text-xs">
          <Badge variant={statusCode === 200 ? "default" : "destructive"} className="font-mono">
            {statusCode} OK
          </Badge>
          <span className="text-muted-foreground">Time: {responseTime}ms</span>
          <span className="text-muted-foreground">Size: {responseSize}KB</span>
        </div>
      </div>

      <Tabs defaultValue="body" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2 w-fit">
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="cookies">Cookies</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="body" className="mt-0 h-full">
            <div className="bg-code-bg rounded-lg p-4 h-full overflow-auto">
              <pre className="font-mono text-sm text-foreground">
                {JSON.stringify(mockResponse, null, 2)}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="mt-0 h-full">
            <div className="bg-code-bg rounded-lg p-4 h-full overflow-auto">
              <div className="space-y-2 font-mono text-sm">
                <div className="flex gap-2">
                  <span className="text-primary font-semibold">Content-Type:</span>
                  <span className="text-foreground">application/json</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-semibold">Content-Length:</span>
                  <span className="text-foreground">1245</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-semibold">Server:</span>
                  <span className="text-foreground">nginx/1.18.0</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cookies" className="mt-0 h-full">
            <div className="bg-code-bg rounded-lg p-4 h-full overflow-auto">
              <p className="text-sm text-muted-foreground">No cookies in this response</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};
