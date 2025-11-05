import { useEffect } from "react";

export function useDocsMeta(topicTitle: string, topicDesc?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    const title = topicTitle ? `${topicTitle} — API Haven` : "API Haven";
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setProp = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", prop);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (topicDesc) {
      setMeta("description", topicDesc);
      setProp("og:description", topicDesc);
    }
    setProp("og:title", title);
    setMeta("twitter:title", title);

    const canonical = document.querySelector("link[rel=canonical]") as HTMLLinkElement | null;
    if (canonical) {
      canonical.href = window.location.href;
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.href = window.location.href;
      document.head.appendChild(link);
    }

    return () => {
      document.title = prevTitle;
    };
  }, [topicTitle, topicDesc]);
}
