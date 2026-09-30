"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ShieldAlert, ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  onSourceClick?: () => void;
}

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (React.isValidElement(node) && (node.props as any)?.children) {
    return getTextContent((node.props as any).children);
  }
  return "";
}

function renderTextWithCitations(
  text: string,
  onSourceClick?: () => void
): React.ReactNode {
  const citationRegex = /(\[(?:Source|Ref)\s*[\d,\s]+\])/gi;
  if (!citationRegex.test(text)) {
    return text;
  }
  const parts = text.split(citationRegex);
  return parts.map((part, i) => {
    if (citationRegex.test(part)) {
      const label = part.replace(/^\[|\]$/g, "");
      return (
        <button
          key={i}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSourceClick?.();
          }}
          title="Click to view verified source citation"
          className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200/90 shadow-2xs hover:bg-sky-200 hover:text-sky-950 transition-colors align-baseline cursor-pointer"
        >
          {label}
        </button>
      );
    }
    return part;
  });
}

function processChildren(
  children: React.ReactNode,
  onSourceClick?: () => void
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return renderTextWithCitations(child, onSourceClick);
    }
    if (React.isValidElement(child) && (child.props as any)?.children) {
      return React.cloneElement(
        child as React.ReactElement<any>,
        undefined,
        processChildren((child.props as any).children, onSourceClick)
      );
    }
    return child;
  });
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
  onSourceClick,
}) => {
  return (
    <div className={`markdown-content text-slate-800 text-xs sm:text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-4 mb-2.5 pb-1.5 border-b border-slate-200">
              {processChildren(children, onSourceClick)}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-100 flex items-center gap-2">
              {processChildren(children, onSourceClick)}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-3.5 mb-1.5 text-sky-950 flex items-center gap-1.5">
              {processChildren(children, onSourceClick)}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-2.5 mb-1">
              {processChildren(children, onSourceClick)}
            </h4>
          ),
          p: ({ children }) => {
            const rawText = getTextContent(children).trim().toLowerCase();
            const isDisclaimer =
              rawText.startsWith("disclaimer:") ||
              rawText.startsWith("*disclaimer:") ||
              rawText.includes("does not constitute a personal diagnosis");

            if (isDisclaimer) {
              return (
                <div className="my-3 rounded-xl border border-amber-200/90 bg-amber-50/80 p-3 text-xs text-amber-950 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-normal">
                      {processChildren(children, onSourceClick)}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <p className="mb-2.5 last:mb-0 leading-relaxed text-slate-700">
                {processChildren(children, onSourceClick)}
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="my-2.5 space-y-1.5 pl-5 list-disc marker:text-sky-500 text-slate-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2.5 space-y-1.5 pl-5 list-decimal marker:text-sky-600 marker:font-semibold text-slate-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-1 text-slate-700">
              {processChildren(children, onSourceClick)}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">
              {processChildren(children, onSourceClick)}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-600">
              {processChildren(children, onSourceClick)}
            </em>
          ),
          hr: () => <hr className="my-3.5 border-t border-slate-200/80" />,
          blockquote: ({ children }) => (
            <blockquote className="my-2.5 border-l-4 border-sky-400 bg-sky-50/60 pl-3.5 py-2 text-xs italic text-slate-700 rounded-r-xl">
              {processChildren(children, onSourceClick)}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50/60 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold text-slate-900">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-slate-700">{children}</td>
          ),
          code: ({ className, children, ...props }: any) => {
            const isInline = !className && typeof children === "string";
            if (isInline) {
              return (
                <code
                  className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-sky-800 border border-slate-200/60"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className || ""} font-mono text-xs`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-2.5 overflow-x-auto rounded-xl bg-slate-900 p-3.5 font-mono text-xs text-slate-100 shadow-soft">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-sky-600 underline decoration-sky-300 underline-offset-2 hover:text-sky-800 transition"
            >
              <span>{children}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
