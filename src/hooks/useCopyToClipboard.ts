import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface UseCopyToClipboardOptions {
  successMessage?: string;
  errorMessage?: string;
  duration?: number;
}

export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}) {
  const {
    successMessage = "Copied to clipboard!",
    errorMessage = "Failed to copy",
    duration = 2000,
  } = options;

  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      if (!text || copying) return false;

      setCopying(true);

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        
        toast({
          title: "Copied!",
          description: successMessage,
        });

        setTimeout(() => {
          setCopied(false);
        }, duration);

        return true;
      } catch {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      } finally {
        setCopying(false);
      }
    },
    [copying, successMessage, errorMessage, duration]
  );

  const reset = useCallback(() => {
    setCopied(false);
    setCopying(false);
  }, []);

  return { copy, copied, copying, reset };
}
