import { useEffect, useMemo, useState } from "react";
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
import { useCollections } from "@/hooks/useCollections";
import { useToast } from "@/hooks/use-toast";
import type { HttpMethod, KeyValuePair } from "@/types/collections";
import type { UpdateRequestInput } from "@/context/CollectionsContext";
import type { ExecutionResult } from "@/types/execution";

const httpMethods: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
  "TRACE",
];

const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  Math.random().toString(36).slice(2);

const ensureRows = (
  items: KeyValuePair[],
  fallback?: KeyValuePair[]
): KeyValuePair[] => {
  if (items.length > 0) {
    return items;
  }
  if (fallback && fallback.length > 0) {
    return fallback;
  }
  return [
    {
      id: createId(),
      key: "",
      value: "",
      description: "",
    },
  ];
};

const normalizePairs = (
  items: KeyValuePair[] | undefined,
  fallback?: KeyValuePair[]
): KeyValuePair[] =>
  ensureRows(
    (items ?? []).map((item) => ({
      id: item.id ?? createId(),
      key: item.key ?? "",
      value: item.value ?? "",
      description: item.description ?? "",
    })),
    fallback
  );

interface RequestWorkspaceProps {
  onSendStart?: () => void;
  onSendComplete?: (result: ExecutionResult) => void;
  onSendError?: (message: string) => void;
}

const LOCAL_STORAGE_SAVED_REQUEST_KEY =
  "api-haven:last-saved-request";

export const RequestWorkspace = ({
  onSendStart,
  onSendComplete,
  onSendError,
}: RequestWorkspaceProps) => {
  const {
    collections,
    selectedCollectionId,
    selectedRequestId,
    updateRequest,
  } = useCollections();
  const { toast } = useToast();

  const selectedRequest = useMemo(() => {
    if (!selectedCollectionId || !selectedRequestId) {
      return undefined;
    }
    const collection = collections.find(
      (col) => col.id === selectedCollectionId
    );
    return collection?.requests.find(
      (request) => request.id === selectedRequestId
    );
  }, [collections, selectedCollectionId, selectedRequestId]);

  const [method, setMethod] = useState<HttpMethod>(
    selectedRequest?.method ?? "GET"
  );
  const [url, setUrl] = useState(selectedRequest?.url ?? "");
  const [params, setParams] = useState<KeyValuePair[]>(
    normalizePairs(selectedRequest?.params)
  );
  const [headers, setHeaders] = useState<KeyValuePair[]>(
    normalizePairs(selectedRequest?.headers, [
      {
        id: createId(),
        key: "Content-Type",
        value: "application/json",
        description: "",
      },
    ])
  );
  const [body, setBody] = useState(selectedRequest?.body ?? "");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!selectedRequest) {
      setMethod("GET");
      setUrl("");
      setParams(ensureRows([]));
      setHeaders(
        ensureRows(
          [],
          [
            {
              id: createId(),
              key: "Content-Type",
              value: "application/json",
              description: "",
            },
          ]
        )
      );
      setBody("");
      return;
    }

    let payloadSource: UpdateRequestInput | null = null;

    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(LOCAL_STORAGE_SAVED_REQUEST_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as {
            collectionId: string;
            requestId: string;
            payload: UpdateRequestInput;
          };
          if (
            parsed.collectionId === selectedCollectionId &&
            parsed.requestId === selectedRequest.id &&
            parsed.payload
          ) {
            payloadSource = parsed.payload;
          }
        }
      } catch (storageError) {
        console.warn("Failed to restore saved request snapshot", storageError);
      }
    }

    const effectivePayload = payloadSource ?? {
      name: selectedRequest.name,
      method: selectedRequest.method,
      url: selectedRequest.url ?? "",
      params: selectedRequest.params ?? [],
      headers: selectedRequest.headers ?? [],
      body: selectedRequest.body ?? "",
      description: selectedRequest.description,
    };

    setMethod(effectivePayload.method);
    setUrl(effectivePayload.url ?? "");
    setParams(normalizePairs(effectivePayload.params));
    setHeaders(
      normalizePairs(effectivePayload.headers, [
        {
          id: createId(),
          key: "Content-Type",
          value: "application/json",
          description: "",
        },
      ])
    );
    setBody(effectivePayload.body ?? "");
  }, [selectedRequestId, selectedRequest, selectedCollectionId]);

  const addParam = () => {
    setParams((prev) => [
      ...prev,
      {
        id: createId(),
        key: "",
        value: "",
        description: "",
      },
    ]);
  };

  const removeParam = (id: string) => {
    setParams((prev) =>
      ensureRows(prev.filter((param) => param.id !== id))
    );
  };

  const updateParam = (
    id: string,
    field: keyof KeyValuePair,
    value: string
  ) => {
    setParams((prev) =>
      prev.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const addHeader = () => {
    setHeaders((prev) => [
      ...prev,
      {
        id: createId(),
        key: "",
        value: "",
        description: "",
      },
    ]);
  };

  const removeHeader = (id: string) => {
    setHeaders((prev) =>
      ensureRows(prev.filter((header) => header.id !== id))
    );
  };

  const updateHeader = (
    id: string,
    field: keyof KeyValuePair,
    value: string
  ) => {
    setHeaders((prev) =>
      prev.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      )
    );
  };

  const handleSave = async () => {
    if (!selectedCollectionId || !selectedRequest) {
      toast({
        title: "No request selected",
        description:
          "Pick or create a request in the sidebar before saving.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name: selectedRequest.name,
      method,
      url,
      params: params.map((param) => ({
        id: param.id ?? createId(),
        key: param.key,
        value: param.value,
        description: param.description,
      })),
      headers: headers.map((header) => ({
        id: header.id ?? createId(),
        key: header.key,
        value: header.value,
        description: header.description,
      })),
      body: body.trim().length > 0 ? body : undefined,
      description: selectedRequest.description,
    };

    const result = await updateRequest(
      selectedCollectionId,
      selectedRequest.id,
      payload
    );

    if (result) {
      if (typeof window !== "undefined") {
        const localSnapshot = {
          collectionId: selectedCollectionId,
          requestId: selectedRequest.id,
          payload,
          savedAt: new Date().toISOString(),
        };
        try {
          window.localStorage.setItem(
            LOCAL_STORAGE_SAVED_REQUEST_KEY,
            JSON.stringify(localSnapshot)
          );
        } catch (storageError) {
          console.warn(
            "Failed to persist saved request locally",
            storageError
          );
        }
      }
      toast({
        title: "Request saved",
        description: `${method} ${selectedRequest.name} updated successfully.`,
      });
    } else {
      toast({
        title: "Save failed",
        description:
          "We could not persist the request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (isSending) {
      return;
    }

    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Provide a request URL before sending.",
        variant: "destructive",
      });
      return;
    }

    const activeHeaders = headers.filter(
      (header) => header.key.trim().length > 0
    );
    const activeParams = params.filter(
      (param) => param.key.trim().length > 0
    );

    let requestUrl = url.trim();
    try {
      const base =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost";
      const urlObject = new URL(requestUrl, base);
      activeParams.forEach((param) => {
        urlObject.searchParams.set(param.key, param.value ?? "");
      });
      requestUrl = urlObject.toString();
    } catch (error) {
      toast({
        title: "Invalid URL",
        description:
          "Please provide a valid absolute or relative URL before sending.",
        variant: "destructive",
      });
      return;
    }

    const headersInit = new Headers();
    activeHeaders.forEach((header) => {
      headersInit.append(header.key, header.value ?? "");
    });

    const canSendBody = !["GET", "HEAD"].includes(method);
    const requestBody =
      canSendBody && body.trim().length > 0 ? body : undefined;

    try {
      setIsSending(true);
      onSendStart?.();
      const start = performance.now();
      const response = await fetch(requestUrl, {
        method,
        headers: headersInit,
        body: requestBody,
      });
      const end = performance.now();
      const elapsed = Math.round(end - start);

      const rawBody = await response.text();
      const responseHeaders: ExecutionResult["headers"] = [];
      response.headers.forEach((value, key) => {
        responseHeaders.push({ key, value });
      });

      let bodyFormat: ExecutionResult["bodyFormat"] = "text";
      if (rawBody) {
        try {
          JSON.parse(rawBody);
          bodyFormat = "json";
        } catch (error) {
          bodyFormat = "text";
        }
      }

      const size = rawBody ? new Blob([rawBody]).size : 0;

      const executionResult: ExecutionResult = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        timeMs: elapsed,
        size,
        headers: responseHeaders,
        body: rawBody,
        bodyFormat,
      };

      onSendComplete?.(executionResult);

      toast({
        title: `Response ${response.status}`,
        description: `${method} request completed in ${elapsed}ms`,
        variant: response.ok ? "default" : "destructive",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Request failed";
      toast({
        title: "Request failed",
        description: message,
        variant: "destructive",
      });
      onSendError?.(message);
    } finally {
      setIsSending(false);
    }
  };

  if (!selectedRequest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-1 flex-col items-center justify-center border-t border-border bg-background text-sm text-muted-foreground"
      >
        <p>
          Select a request from the sidebar to configure its details.
        </p>
        <p className="mt-2">
          Need a new endpoint? Create one from the collections panel
          and it will appear here.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-1 flex-col bg-background"
    >
      <div className="border-b border-border p-4">
        <div className="flex gap-2">
          <Select
            value={method}
            onValueChange={(value) => setMethod(value as HttpMethod)}
          >
            <SelectTrigger className="w-32 font-mono font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {httpMethods.map((methodOption) => (
                <SelectItem
                  key={methodOption}
                  value={methodOption}
                  className="font-mono font-semibold"
                >
                  {methodOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Enter request URL"
            className="flex-1 font-mono"
          />

          <Button
            className="gap-2"
            variant="outline"
            disabled={isSending}
            onClick={() => void handleSend()}
          >
            <Send className="h-4 w-4" />
            {isSending ? "Sending..." : "Send"}
          </Button>

          <Button
            variant="default"
            className="gap-2"
            onClick={() => void handleSave()}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="params" className="flex flex-1 flex-col">
        <TabsList className="mx-4 mt-4 w-fit">
          <TabsTrigger value="params">Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="params" className="mt-0">
            <div className="rounded-lg bg-code-bg p-4">
              <div className="space-y-2">
                <div className="mb-2 grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs font-semibold text-muted-foreground">
                  <div>Key</div>
                  <div>Value</div>
                  <div>Description</div>
                  <div className="w-10" />
                </div>
                {params.map((param) => (
                  <div
                    key={param.id}
                    className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2"
                  >
                    <Input
                      placeholder="key"
                      value={param.key}
                      onChange={(event) =>
                        updateParam(
                          param.id,
                          "key",
                          event.target.value
                        )
                      }
                      className="bg-background font-mono text-sm"
                    />
                    <Input
                      placeholder="value"
                      value={param.value}
                      onChange={(event) =>
                        updateParam(
                          param.id,
                          "value",
                          event.target.value
                        )
                      }
                      className="bg-background font-mono text-sm"
                    />
                    <Input
                      placeholder="description"
                      value={param.description ?? ""}
                      onChange={(event) =>
                        updateParam(
                          param.id,
                          "description",
                          event.target.value
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
            <div className="rounded-lg bg-code-bg p-4">
              <div className="space-y-2">
                <div className="mb-2 grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs font-semibold text-muted-foreground">
                  <div>Key</div>
                  <div>Value</div>
                  <div>Description</div>
                  <div className="w-10" />
                </div>
                {headers.map((header) => (
                  <div
                    key={header.id}
                    className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2"
                  >
                    <Input
                      placeholder="key"
                      value={header.key}
                      onChange={(event) =>
                        updateHeader(
                          header.id,
                          "key",
                          event.target.value
                        )
                      }
                      className="bg-background font-mono text-sm"
                    />
                    <Input
                      placeholder="value"
                      value={header.value}
                      onChange={(event) =>
                        updateHeader(
                          header.id,
                          "value",
                          event.target.value
                        )
                      }
                      className="bg-background font-mono text-sm"
                    />
                    <Input
                      placeholder="description"
                      value={header.description ?? ""}
                      onChange={(event) =>
                        updateHeader(
                          header.id,
                          "description",
                          event.target.value
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
            <div className="rounded-lg bg-code-bg p-4">
              <Textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder='{
  "name": "John Doe",
  "email": "john@example.com"
}'
                className="min-h-[300px] border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
              />
            </div>
          </TabsContent>

          <TabsContent value="auth" className="mt-0">
            <div className="rounded-lg bg-code-bg p-4 text-sm text-muted-foreground">
              Connect authentication helpers from your backend here.
              For now, manage tokens in the Headers tab.
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};
