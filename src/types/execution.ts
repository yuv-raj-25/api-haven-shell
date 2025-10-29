export interface ExecutionResult {
  status: number;
  statusText: string;
  ok: boolean;
  timeMs: number;
  size: number;
  headers: Array<{ key: string; value: string }>;
  body: string;
  bodyFormat: "json" | "text";
}

export interface ExecutionError {
  message: string;
}
