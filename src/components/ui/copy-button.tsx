import { Copy, Check } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  text: string;
  successMessage?: string;
}

export function CopyButton({
  text,
  successMessage,
  className,
  children,
  ...props
}: CopyButtonProps) {
  const { copy, copied, copying } = useCopyToClipboard({ successMessage });

  return (
    <Button
      onClick={() => copy(text)}
      disabled={!text || copying}
      className={cn(
        "transition-all duration-200",
        copied && "bg-primary/20 text-primary border-primary/50",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "flex items-center gap-1.5 transition-transform duration-200",
          copied && "scale-105"
        )}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 animate-in zoom-in-50 duration-200" />
            <span className="animate-in fade-in-0 duration-200">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            {children || <span>Copy</span>}
          </>
        )}
      </span>
    </Button>
  );
}
