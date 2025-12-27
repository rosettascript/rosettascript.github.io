import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Copy, Check, RefreshCw, Clock } from "lucide-react";

export function TimestampConverterTool() {
  const [unixTimestamp, setUnixTimestamp] = useState("");
  const [dateString, setDateString] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnixToDate = () => {
    if (!unixTimestamp.trim()) {
      toast({
        title: "No input",
        description: "Please enter a Unix timestamp.",
        variant: "destructive",
      });
      return;
    }

    const timestamp = parseInt(unixTimestamp, 10);
    if (isNaN(timestamp)) {
      toast({
        title: "Invalid timestamp",
        description: "Please enter a valid number.",
        variant: "destructive",
      });
      return;
    }

    // Handle both seconds and milliseconds
    const ms = timestamp > 9999999999 ? timestamp : timestamp * 1000;
    const date = new Date(ms);
    
    if (isNaN(date.getTime())) {
      toast({
        title: "Invalid timestamp",
        description: "Could not convert to date.",
        variant: "destructive",
      });
      return;
    }

    setDateString(date.toISOString());
    toast({
      title: "Converted!",
      description: "Unix timestamp converted to date.",
    });
  };

  const handleDateToUnix = () => {
    if (!dateString.trim()) {
      toast({
        title: "No input",
        description: "Please enter a date string.",
        variant: "destructive",
      });
      return;
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      toast({
        title: "Invalid date",
        description: "Could not parse date string.",
        variant: "destructive",
      });
      return;
    }

    setUnixTimestamp(Math.floor(date.getTime() / 1000).toString());
    toast({
      title: "Converted!",
      description: "Date converted to Unix timestamp.",
    });
  };

  const handleSetNow = () => {
    const now = Date.now();
    setUnixTimestamp(Math.floor(now / 1000).toString());
    setDateString(new Date(now).toISOString());
  };

  const handleCopy = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard.`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const currentUnix = Math.floor(currentTime / 1000);
  const currentDate = new Date(currentTime);

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Current Time</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Unix Timestamp (seconds)</p>
            <div className="flex items-center gap-2">
              <code className="font-mono text-lg">{currentUnix}</code>
              <Button
                onClick={() => handleCopy(currentUnix.toString(), "Current Unix")}
                variant="ghost"
                size="sm"
                className="h-6"
              >
                {copiedField === "Current Unix" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">ISO 8601</p>
            <div className="flex items-center gap-2">
              <code className="font-mono text-sm">{currentDate.toISOString()}</code>
              <Button
                onClick={() => handleCopy(currentDate.toISOString(), "Current ISO")}
                variant="ghost"
                size="sm"
                className="h-6"
              >
                {copiedField === "Current ISO" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Converter */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Unix to Date */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Unix Timestamp</label>
          <div className="flex gap-2">
            <Input
              value={unixTimestamp}
              onChange={(e) => setUnixTimestamp(e.target.value)}
              placeholder="e.g., 1702300800"
              className="font-mono bg-background/50"
            />
            <Button
              onClick={() => handleCopy(unixTimestamp, "Unix")}
              variant="outline"
              size="icon"
              disabled={!unixTimestamp}
            >
              {copiedField === "Unix" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button onClick={handleUnixToDate} size="sm" className="w-full">
            Convert to Date →
          </Button>
        </div>

        {/* Date to Unix */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Date String (ISO 8601)</label>
          <div className="flex gap-2">
            <Input
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              placeholder="e.g., 2024-12-11T12:00:00.000Z"
              className="font-mono bg-background/50"
            />
            <Button
              onClick={() => handleCopy(dateString, "Date")}
              variant="outline"
              size="icon"
              disabled={!dateString}
            >
              {copiedField === "Date" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button onClick={handleDateToUnix} size="sm" className="w-full">
            ← Convert to Unix
          </Button>
        </div>
      </div>

      {/* Set Now Button */}
      <div className="flex justify-center">
        <Button onClick={handleSetNow} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Set to Current Time
        </Button>
      </div>

      {/* Parsed Date Details */}
      {dateString && !isNaN(new Date(dateString).getTime()) && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Parsed Date Details</label>
          <div className="p-4 bg-background/50 border border-border rounded-md">
            <div className="grid sm:grid-cols-2 gap-3 text-sm font-mono">
              {[
                { label: "Local", value: new Date(dateString).toLocaleString() },
                { label: "UTC", value: new Date(dateString).toUTCString() },
                { label: "Unix (s)", value: Math.floor(new Date(dateString).getTime() / 1000) },
                { label: "Unix (ms)", value: new Date(dateString).getTime() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}:</span>
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-muted-foreground">
        <p>Accepts Unix timestamps in seconds or milliseconds. Dates can be in any format parseable by JavaScript's Date constructor.</p>
      </div>
    </div>
  );
}
