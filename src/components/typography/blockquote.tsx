import React from "react";

interface BlockquoteProps {
  children: React.ReactNode;
  className?: string;
}

export function Blockquote({ children, className = "" }: BlockquoteProps) {
  return (
    <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`.trim()}>
      &quot;{children}&quot;
    </blockquote>
  );
}
