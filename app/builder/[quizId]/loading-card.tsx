export default function LoadingCard() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0e6ff_0%,#fff_60%)] dark:bg-[linear-gradient(180deg,#1a0f2e_0%,#07102a_60%)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-violet-200 dark:bg-violet-900/30 rounded w-1/4" />
          <div className="h-32 bg-violet-200 dark:bg-violet-900/30 rounded" />
          <div className="h-64 bg-violet-200 dark:bg-violet-900/30 rounded" />
        </div>
      </div>
    </div>
  )
}
