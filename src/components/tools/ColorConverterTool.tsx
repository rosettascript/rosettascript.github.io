import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Copy, Check } from "lucide-react";

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export function ColorConverterTool() {
  const [color, setColor] = useState<ColorValues>({
    hex: "#6366f1",
    rgb: { r: 99, g: 102, b: 241 },
    hsl: { h: 239, s: 84, l: 67 },
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4)),
    };
  };

  const updateFromHex = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setColor({ hex: hex.startsWith("#") ? hex : `#${hex}`, rgb, hsl });
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    setColor({ hex, rgb: { r, g, b }, hsl });
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setColor({ hex, rgb, hsl: { h, s, l } });
  };

  const handleCopy = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast({
        title: "Copied!",
        description: `${field} value copied to clipboard.`,
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

  const hexString = color.hex.toUpperCase();
  const rgbString = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
  const hslString = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div
          className="w-32 h-32 rounded-lg border-4 border-border shadow-lg"
          style={{ backgroundColor: color.hex }}
        />
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Color Picker</label>
          <Input
            type="color"
            value={color.hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-full h-12 cursor-pointer"
          />
        </div>
      </div>

      {/* Color Values */}
      <div className="grid gap-4">
        {/* HEX */}
        <div className="p-4 bg-background/50 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">HEX</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(hexString, "HEX")}
              className="h-6"
            >
              {copiedField === "HEX" ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          <Input
            value={color.hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="font-mono"
            placeholder="#000000"
          />
        </div>

        {/* RGB */}
        <div className="p-4 bg-background/50 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">RGB</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(rgbString, "RGB")}
              className="h-6"
            >
              {copiedField === "RGB" ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">R</label>
              <Input
                type="number"
                min={0}
                max={255}
                value={color.rgb.r}
                onChange={(e) => updateFromRgb(Number(e.target.value), color.rgb.g, color.rgb.b)}
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">G</label>
              <Input
                type="number"
                min={0}
                max={255}
                value={color.rgb.g}
                onChange={(e) => updateFromRgb(color.rgb.r, Number(e.target.value), color.rgb.b)}
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">B</label>
              <Input
                type="number"
                min={0}
                max={255}
                value={color.rgb.b}
                onChange={(e) => updateFromRgb(color.rgb.r, color.rgb.g, Number(e.target.value))}
                className="font-mono"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-mono">{rgbString}</p>
        </div>

        {/* HSL */}
        <div className="p-4 bg-background/50 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">HSL</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(hslString, "HSL")}
              className="h-6"
            >
              {copiedField === "HSL" ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">H</label>
              <Input
                type="number"
                min={0}
                max={360}
                value={color.hsl.h}
                onChange={(e) => updateFromHsl(Number(e.target.value), color.hsl.s, color.hsl.l)}
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">S (%)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={color.hsl.s}
                onChange={(e) => updateFromHsl(color.hsl.h, Number(e.target.value), color.hsl.l)}
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">L (%)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={color.hsl.l}
                onChange={(e) => updateFromHsl(color.hsl.h, color.hsl.s, Number(e.target.value))}
                className="font-mono"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-mono">{hslString}</p>
        </div>
      </div>
    </div>
  );
}
