'use client'

import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AntiCheatWarningDialogProps {
  open: boolean
  onAccept: () => void
}

export default function AntiCheatWarningDialog({
  open,
  onAccept,
}: AntiCheatWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-125">
        <DialogHeader>
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
            <AlertTriangle className="w-6 h-6" />
            <DialogTitle className="text-xl">Anti-Cheat Policy</DialogTitle>
          </div>
          <div className="space-y-3 pt-4 text-left text-sm text-muted-foreground">
            <div className="font-medium text-foreground">
              Please be aware of the following rules:
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>No tab switching:</strong> Switching to other tabs or
                windows during the quiz will be logged.
              </li>
              <li>
                <strong>No copy/paste:</strong> Pasting content into answer
                fields will be recorded.
              </li>
              <li>
                <strong>Fair play:</strong> This quiz is designed to test your
                knowledge honestly.
              </li>
            </ul>
            <div className="text-sm text-muted-foreground mt-4">
              All anti-cheat events will be included in your final results. By
              starting this quiz, you agree to follow these guidelines.
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onAccept}
            className="bg-green-600 hover:bg-green-500 w-full sm:w-auto"
          >
            I Understand - Start Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
