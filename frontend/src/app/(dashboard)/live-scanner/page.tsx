import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function LiveScannerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Live Scanner</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Real-time college football game state tracking
          </p>
        </div>
        <Badge variant="warning"> DATA</Badge>
      </div>

      <Card>
        <div className="text-center py-12">
          <p className="text-zinc-400">Live game scanner will appear here.</p>
          <p className="text-sm text-zinc-600 mt-2">
            Score, quarter, possession, timeouts, and other live state will be shown once real data is connected.
          </p>
        </div>
      </Card>
    </div>
  );
}