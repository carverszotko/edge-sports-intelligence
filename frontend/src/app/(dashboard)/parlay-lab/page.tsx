import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function ParlayLabPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Parlay Lab</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Evaluate correlations and expected value of multi-leg bets
          </p>
        </div>
        <Badge variant="warning"> DATA</Badge>
      </div>

      <Card>
        <div className="text-center py-12">
          <p className="text-zinc-400">Parlay evaluation tools will appear here.</p>
          <p className="text-sm text-zinc-600 mt-2">
            Joint probability, correlation, and expected value calculations will be shown for proposed parlays.
          </p>
        </div>
      </Card>
    </div>
  );
}