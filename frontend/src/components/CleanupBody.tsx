"use client";

import { useEffect } from "react";

export default function CleanupBody() {
  useEffect(() => {
    // Known extension attribute that can cause hydration mismatches
    const attrsToRemove = ["cz-shortcut-listen"];

    for (const attr of attrsToRemove) {
      if (document.body.hasAttribute(attr)) {
        document.body.removeAttribute(attr);
      }
    }

    // Additionally, some extensions may add attributes to <html>
    for (const attr of attrsToRemove) {
      if (document.documentElement.hasAttribute(attr)) {
        document.documentElement.removeAttribute(attr);
      }
    }
  }, []);

  return null;
}
