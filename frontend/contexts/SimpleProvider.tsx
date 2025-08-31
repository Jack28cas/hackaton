"use client";

import { type ReactNode } from "react";

// Provider simple sin dependencias externas problemáticas
export function SimpleProvider(props: { children: ReactNode }) {
  return (
    <div className="simple-provider">
      {props.children}
    </div>
  );
}
