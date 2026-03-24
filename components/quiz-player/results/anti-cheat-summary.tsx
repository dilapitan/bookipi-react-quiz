import { AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AntiCheatEvents {
  tabSwitches: number
  pastes: number
}

export default function AntiCheatSummary({
  antiCheatEvents,
}: {
  antiCheatEvents: AntiCheatEvents
}) {
  return (
    <Card className="border-yellow-500/50 bg-yellow-500/5">
      <CardHeader>
        <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
          <AlertTriangle className="w-5 h-5" />
          <CardTitle className="text-lg">Anti-Cheat Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {antiCheatEvents.tabSwitches > 0 && (
            <span>
              {antiCheatEvents.tabSwitches} tab switch
              {antiCheatEvents.tabSwitches !== 1 ? 'es' : ''}
            </span>
          )}
          {antiCheatEvents.tabSwitches > 0 && antiCheatEvents.pastes > 0 && (
            <span>, </span>
          )}
          {antiCheatEvents.pastes > 0 && (
            <span>
              {antiCheatEvents.pastes} paste
              {antiCheatEvents.pastes !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
