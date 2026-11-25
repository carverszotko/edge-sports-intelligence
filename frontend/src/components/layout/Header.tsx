import { Badge } from "@/components/ui/Badge";

export function Header() {
  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-medium text-zinc-200">
          College Football Intelligence
        </h1>
        <Badge variant="warning"> DATA</Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-xs text-zinc-500">
          Paper Trading Mode
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>
    </header>
  );
}