import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [withHyphens, setWithHyphens] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generateUuid = (): string => {
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    return withHyphens ? uuid : uuid.replace(/-/g, "");
  };

  const handleGenerate = (count: number) => {
    const newUuids = Array.from({ length: count }, () => generateUuid());
    setUuids(newUuids);
    toast({
      title: "Generated!",
      description: `${count} UUID${count > 1 ? "s" : ""} generated.`,
    });
  };

  const handleCopy = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedIndex(index);
      toast({
        title: "Copied!",
        description: "UUID copied to clipboard.",
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleCopyAll = async () => {
    if (uuids.length === 0) return;
    
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      setCopiedAll(true);
      toast({
        title: "Copied!",
        description: `All ${uuids.length} UUIDs copied to clipboard.`,
      });
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setUuids([]);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="hyphens"
            checked={withHyphens}
            onCheckedChange={setWithHyphens}
          />
          <Label htmlFor="hyphens" className="text-sm">Include hyphens</Label>
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <Button onClick={() => handleGenerate(1)} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate 1
          </Button>
          <Button onClick={() => handleGenerate(5)} variant="outline" size="sm">
            Generate 5
          </Button>
          <Button onClick={() => handleGenerate(10)} variant="outline" size="sm">
            Generate 10
          </Button>
          <Button onClick={handleClear} variant="ghost" size="sm" disabled={uuids.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* UUIDs List */}
      {uuids.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {uuids.length} UUID{uuids.length > 1 ? "s" : ""} generated
            </span>
            <Button
              onClick={handleCopyAll}
              variant="outline"
              size="sm"
            >
              {copiedAll ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied All
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All
                </>
              )}
            </Button>
          </div>
          <div className="space-y-2">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border font-mono text-sm"
              >
                <span className="break-all">{uuid}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(uuid, index)}
                  className="ml-2 flex-shrink-0"
                >
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uuids.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Click a button above to generate UUIDs</p>
        </div>
      )}
    </div>
  );
}
