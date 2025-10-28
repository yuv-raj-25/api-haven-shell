import { useState } from "react";
import { Send, Save } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export const RequestWorkspace = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.example.com/users");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex-1 flex flex-col bg-background"
    >
      <div className="p-4 border-b border-border">
        <div className="flex gap-2">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-32 font-mono font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {methods.map((m) => (
                <SelectItem key={m} value={m} className="font-mono font-semibold">
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter request URL"
            className="flex-1 font-mono"
          />
          
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Send
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="params" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 w-fit">
          <TabsTrigger value="params">Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
        </TabsList>

        <div className="flex-1 p-4">
          <TabsContent value="params" className="mt-0 h-full">
            <div className="bg-code-bg rounded-lg p-4 h-full">
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <div>Key</div>
                  <div>Value</div>
                  <div>Description</div>
                </div>
                <ParamRow />
                <ParamRow />
                <ParamRow />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="mt-0 h-full">
            <div className="bg-code-bg rounded-lg p-4 h-full">
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <div>Key</div>
                  <div>Value</div>
                  <div>Description</div>
                </div>
                <HeaderRow prefilledKey="Content-Type" prefilledValue="application/json" />
                <HeaderRow prefilledKey="Authorization" prefilledValue="Bearer token" />
                <HeaderRow />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="body" className="mt-0 h-full">
            <div className="bg-code-bg rounded-lg p-4 h-full">
              <Textarea
                placeholder='{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
                className="font-mono text-sm min-h-[300px] bg-transparent border-0 focus-visible:ring-0"
              />
            </div>
          </TabsContent>

          <TabsContent value="auth" className="mt-0 h-full">
            <div className="bg-code-bg rounded-lg p-4 h-full">
              <Select defaultValue="bearer">
                <SelectTrigger className="w-64 mb-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                  <SelectItem value="apikey">API Key</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Token" className="font-mono" />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};

const ParamRow = () => (
  <div className="grid grid-cols-3 gap-2">
    <Input placeholder="key" className="bg-background font-mono text-sm" />
    <Input placeholder="value" className="bg-background font-mono text-sm" />
    <Input placeholder="description" className="bg-background text-sm" />
  </div>
);

const HeaderRow = ({ prefilledKey = "", prefilledValue = "" }) => (
  <div className="grid grid-cols-3 gap-2">
    <Input
      placeholder="key"
      defaultValue={prefilledKey}
      className="bg-background font-mono text-sm"
    />
    <Input
      placeholder="value"
      defaultValue={prefilledValue}
      className="bg-background font-mono text-sm"
    />
    <Input placeholder="description" className="bg-background text-sm" />
  </div>
);
