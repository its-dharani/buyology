import type { Verdict } from '../types'

interface VerdictCardProps {
  verdict: Verdict
  confidence: number
}

const VERDICT_STYLES: Record<Verdict, { bg: string; text: string; icon: string }> = {
  BUY: { bg: 'bg-buyGreen', text: 'text-green-800', icon: '✓' },
  WAIT: { bg: 'bg-waitAmber', text: 'text-amber-800', icon: '⏳' },
  SKIP: { bg: 'bg-skipRose', text: 'text-red-800', icon: '✕' },
}

export default function VerdictCard({ verdict, confidence }: VerdictCardProps) {
  const { bg, text, icon } = VERDICT_STYLES[verdict]

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${bg} ${text} rounded-xl p-6 flex flex-col items-center gap-2 shadow-sm`}
    >
      <span aria-hidden="true" className="text-4xl">
        {icon}
      </span>
      <p className="text-3xl font-bold tracking-wide">{verdict}</p>
      <p className="text-sm font-semibold opacity-80">{confidence}% confidence</p>
    </div>
  )
}
