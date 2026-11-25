import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Settings</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Platform configuration and preferences
          </p>
        </div>
        <Badge variant="warning"> DATA</Badge>
      </div>

      <Card title="General">
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300">Default Sport</span>
            <span className="text-zinc-500">College Football</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-300">Mode</span>
            <Badge variant="info">Paper Trading Only</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-300">Data Source</span>
            <span className="text-zinc-500"> Data</span>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-sm text-zinc-500 text-center py-6">
          Additional settings will be added in later phases.
        </p>
      </Card>
    </div>
  );
}