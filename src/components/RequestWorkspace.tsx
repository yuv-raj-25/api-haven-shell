import { useState } from "react";
import { Send, Save, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  description: string;
}

export const RequestWorkspace = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.example.com/users");
  const [params, setParams] = useState<KeyValuePair[]>([
    { id: "1", key: "", value: "", description: "" },
  ]);
  const [headers, setHeaders] = useState<KeyValuePair[]>([
    {
      id: "1",
      key: "Content-Type",
      value: "application/json",
      description: "",
    },
    {
      id: "2",
      key: "Authorization",
      value: "Bearer token",
      description: "",
    },
  ]);

  const addParam = () => {
    setParams([
      ...params,
      {
        id: Date.now().toString(),
        key: "",
        value: "",
        description: "",
      },
    ]);
  };

  const removeParam = (id: string) => {
    if (params.length > 1) {
      setParams(params.filter((param) => param.id !== id));
    }
  };

  const updateParam = (
    id: string,
    field: keyof KeyValuePair,
    value: string
  ) => {
    setParams(
      params.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const addHeader = () => {
    setHeaders([
      ...headers,
      {
        id: Date.now().toString(),
        key: "",
        value: "",
        description: "",
      },
    ]);
  };

  const removeHeader = (id: string) => {
    if (headers.length > 1) {
      setHeaders(headers.filter((header) => header.id !== id));
    }
  };

  const updateHeader = (
    id: string,
    field: keyof KeyValuePair,
    value: string
  ) => {
    setHeaders(
      headers.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      )
    );
  };

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
                <SelectItem
                  key={m}
                  value={m}
                  className="font-mono font-semibold"
                >
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

        <div className="flex-1 p-4 overflow-auto">
          <TabsContent value="params" className="mt-0">
            <div className="bg-code-bg rounded-lg p-4">
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <div>Key</div>
                  <div>Value</div>
                  <div>Description</div>
                  <div className="w-10"></div>
                </div>
                {params.map((param) => (
                  <div
                    key={param.id}
                    className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2"
                  >
                    <Input
                      placeholder="key"
                      value={param.key}
                      onChange={(e) =>
                        updateParam(param.id, "key", e.target.value)
                      }
                      className="bg-background font-mono text-sm"
                    />
                    <Input
                      placeholder="value"
                      value={param.value}
                      onChange={(e) =>
                        updateParam(param.id, "value", e.target.value)
                      }
                      className="bg-background font-mono text-sm"
                    />
                    <Input
                      placeholder="description"
                      value={param.description}
                      onChange={(e) =>
                        updateParam(
                          param.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="bg-background text-sm"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeParam(param.id)}
                      disabled={params.length === 1}
                      className="h-9 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addParam}
                  className="mt-2 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Parameter
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="mt-0">
            <div className="bg-code-bg rounded-lg p-4">
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <div>Key</div>
                  <div>Value</div>
                  <div>Description</div>
                  <div className="w-10"></div>
                </div>
                {headers.map((header) => (
                  <div
                    key={header.id}
                    className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2"
                  >
                    <Input
                      placeholder="key"
                      value={header.key}
                      onChange={(e) =>
                        updateHeader(header.id, "key", e.target.value)
                      }
                      className="bg-background font-mono text-sm"
                    />
                    <Input
                      placeholder="value"
                      value={header.value}
                      onChange={(e) =>
                        updateHeader(
                          header.id,
                          "value",
                          e.target.value
                        )
                      }
                      className="bg-background font-mono text-sm"
                    />
                    <Input
                      placeholder="description"
                      value={header.description}
                      onChange={(e) =>
                        updateHeader(
                          header.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="bg-background text-sm"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeHeader(header.id)}
                      disabled={headers.length === 1}
                      className="h-9 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addHeader}
                  className="mt-2 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Header
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="body" className="mt-0">
            <div className="bg-code-bg rounded-lg p-4">
              <Textarea
                placeholder='{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
                className="font-mono text-sm min-h-[300px] bg-transparent border-0 focus-visible:ring-0"
              />
            </div>
          </TabsContent>

          <TabsContent value="auth" className="mt-0">
            <div className="bg-code-bg rounded-lg p-4">
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
