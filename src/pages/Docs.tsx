import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { BookOpen, Search } from "lucide-react";

import { TOPICS } from "@/constants/docs";

export default function DocsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const current = slug || "intro";

  const [md, setMd] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    const topic = TOPICS.find((t) => t.slug === current) || TOPICS[0];
    setLoading(true);
    fetch(`/docs/${topic.file}`)
      .then((res) => res.text())
      .then((text) => {
        if (mounted) setMd(text);
      })
      .catch((err) => {
        console.error("Failed to load docs:", err);
        if (mounted)
          setMd(`# ${topic.title}\n\nFailed to load documentation.`);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [current]);

  // filter topics by search query
  const filtered = TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.slug.toLowerCase().includes(query.toLowerCase())
  );

  // custom code block renderer that adds a copy button
  const CodeBlock = ({
    inline,
    className,
    children,
  }: {
    inline?: boolean;
    className?: string;
    children: ReactNode;
  }) => {
    const code = String(children).replace(/\n$/, "");
    const isBlock = !inline;
    const language = (className || "").replace("language-", "");

    const copy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        toast({
          title: "Copied",
          description: "Code copied to clipboard",
        });
      } catch (e) {
        console.error("Copy failed", e);
      }
    };

    if (!isBlock) {
      return <code className={className}>{code}</code>;
    }

    return (
      <div className="relative my-4">
        <pre
          className={`rounded-md overflow-auto p-4 bg-slate-900 text-white ${
            language ? "language-" + language : ""
          }`}
        >
          <button
            onClick={copy}
            className="absolute right-2 top-2 z-10 rounded bg-muted/30 px-2 py-1 text-xs"
          >
            Copy
          </button>
          <code className={className}>{code}</code>
        </pre>
      </div>
    );
  };

  const Callout = ({ children }: { children: ReactNode }) => (
    <div className="mb-4 rounded-md border-l-4 border-sky-400 bg-sky-50 p-4 dark:bg-sky-900/40">
      <div className="text-sm">{children}</div>
    </div>
  );

  const H2 = ({ children }: { children: ReactNode }) => (
    <h2
      id={String(children)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")}
      className="mt-8 mb-3 flex items-center gap-3 text-xl font-semibold"
    >
      <span className="inline-block h-6 w-1 rounded bg-primary" />
      {children}
    </h2>
  );

  const H3 = ({ children }: { children: ReactNode }) => (
    <h3
      id={String(children)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")}
      className="mt-6 mb-2 text-lg font-semibold"
    >
      {children}
    </h3>
  );

  // extract headings from markdown for right-hand TOC
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);

  useEffect(() => {
    const list: Array<{ id: string; text: string; level: number }> =
      [];
    const regex = /^#{2,3}\s+(.*)$/gm;
    let match;
    while ((match = regex.exec(md)) !== null) {
      const text = match[1].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      const level = match[0].startsWith("###") ? 3 : 2;
      list.push({ id, text, level });
    }
    setHeadings(list);
  }, [md]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="p-6 flex-1">
        <div className="mx-auto flex max-w-7xl gap-6">
          <aside className="w-72 shrink-0">
            <div className="sticky top-6 rounded-lg border border-panel-border bg-card p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    Documentation
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Guides & API
                  </div>
                </div>
              </div>

              <div className="mb-3 flex items-center gap-2 rounded-md border border-border px-2 py-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search topics..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              <nav className="flex max-h-[60vh] flex-col gap-1 overflow-auto pr-1">
                {filtered.map((t) => {
                  const active = t.slug === current;
                  return (
                    <Link
                      key={t.slug}
                      to={`/docs/${t.slug}`}
                      className={`block rounded-md px-3 py-2 transition hover:bg-muted/40 focus:outline-none ${
                        active ? "bg-primary/10 font-semibold" : ""
                      }`}
                    >
                      <span
                        className={`inline-block mr-3 h-2 w-2 rounded-full ${
                          t.color ?? "bg-muted"
                        }`}
                      />
                      {t.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            <div className="rounded-lg border border-panel-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {TOPICS.find((t) => t.slug === current)?.title ||
                      "Documentation"}
                  </h1>
                  <div className="mt-2 flex items-center gap-3">
                    <span
                      className={`inline-block h-3 w-20 rounded-full ${
                        TOPICS.find((t) => t.slug === current)
                          ?.color ?? "bg-muted-foreground/30"
                      }`}
                    />
                    <div className="text-sm text-muted-foreground">
                      {TOPICS.find((t) => t.slug === current)?.desc}
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div>Loading...</div>
              ) : (
                <article className="prose prose-slate dark:prose-invert max-w-none">
                  <ReactMarkdown
                    children={md}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                    components={{
                      code: CodeBlock,
                      blockquote: Callout,
                      h2: H2,
                      h3: H3,
                    }}
                  />
                </article>
              )}
            </div>
          </main>
          <aside className="w-56 shrink-0">
            <div className="sticky top-6 rounded-lg border border-panel-border bg-card p-4 shadow-sm">
              <div className="mb-2 text-sm font-semibold">
                On this page
              </div>
              <nav className="flex flex-col gap-2">
                {headings.length === 0 ? (
                  <div className="text-xs text-muted-foreground">
                    No headings found
                  </div>
                ) : (
                  headings.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => scrollToId(h.id)}
                      className={`text-left text-sm transition hover:underline ${
                        h.level === 3
                          ? "ml-3 text-muted-foreground"
                          : "font-medium"
                      }`}
                    >
                      {h.text}
                    </button>
                  ))
                )}
              </nav>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
