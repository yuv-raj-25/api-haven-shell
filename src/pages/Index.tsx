import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { RequestWorkspace } from "@/components/RequestWorkspace";
import { ResponsePanel } from "@/components/ResponsePanel";
import type { ExecutionResult } from "@/types/execution";
import { LAST_RESPONSE_STORAGE_KEY } from "@/constants/storage";

const Index = () => {
  const [response, setResponse] = useState<ExecutionResult | null>(
    null
  );
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const stored = window.localStorage.getItem(
        LAST_RESPONSE_STORAGE_KEY
      );
      if (stored) {
        setResponse(JSON.parse(stored) as ExecutionResult);
      }
    } catch (error) {
      console.warn("Failed to restore last response", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !response) {
      return;
    }
    try {
      window.localStorage.setItem(
        LAST_RESPONSE_STORAGE_KEY,
        JSON.stringify(response)
      );
    } catch (error) {
      console.warn("Failed to persist last response", error);
    }
  }, [response]);

  const handleSendStart = () => {
    setIsSending(true);
    setSendError(null);
  };

  const handleSendComplete = (result: ExecutionResult) => {
    setIsSending(false);
    setResponse(result);
    setSendError(null);
  };

  const handleSendError = (message: string) => {
    setIsSending(false);
    setSendError(message);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <RequestWorkspace
            onSendStart={handleSendStart}
            onSendComplete={handleSendComplete}
            onSendError={handleSendError}
          />
          <ResponsePanel
            response={response}
            isLoading={isSending}
            error={sendError}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
