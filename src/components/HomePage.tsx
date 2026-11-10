import useLookupStore from '../stores/lookupStore'
import useUIStore from '../stores/uiStore'
import SearchBar from './SearchBar'

const EXAMPLE_CHIPS = [
  { label: 'Sony WH-1000XM5',         verdict: 'BUY'  as const },
  { label: 'CeraVe Moisturising Cream',verdict: 'BUY'  as const },
  { label: 'Apple AirPods Pro 2nd Gen',verdict: 'BUY'  as const },
  { label: 'Bose QuietComfort 45',     verdict: 'WAIT' as const },
  { label: 'Samsung Galaxy Watch 6',   verdict: 'WAIT' as const },
  { label: 'FakeAudioPro Headphones',  verdict: 'SKIP' as const },
]

const VERDICT_CHIP: Record<'BUY' | 'WAIT' | 'SKIP', { dot: string; label: string }> = {
  BUY:  { dot: 'bg-buyGreen  text-green-800',  label: 'B' },
  WAIT: { dot: 'bg-waitAmber text-amber-800',  label: 'W' },
  SKIP: { dot: 'bg-skipRose  text-red-800',    label: 'S' },
}

const STEPS = [
  { icon: '🔍', num: '01', title: 'Search',      desc: 'Enter a product name or paste any product URL. Buyology identifies the item from the catalogue.' },
  { icon: '📊', num: '02', title: 'Investigate', desc: 'We analyse price signals, review scores, alternatives, and red flags — with clear labels on every data point.' },
  { icon: '✅', num: '03', title: 'Decide',      desc: 'Get a transparent BUY, WAIT, or SKIP verdict with a confidence score and plain-English reasoning.' },
  { icon: '📁', num: '04', title: 'Save & Track',desc: 'Save your research as a Purchase Case File and add products to your watchlist.' },
]

export default function HomePage() {
  const lookup  = useLookupStore((s) => s.lookup)
  const setView = useUIStore((s) => s.setView)

  function handleChip(label: string) {
    lookup(label)
    setView('result')
  }

  return (
    <div className="space-y-0">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-14 text-center">
        <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-500 font-semibold text-xs px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          🛒 Smart Shopping Decisions
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-tight mb-4">
          Should you{' '}
          <span className="bg-gradient-to-r from-pinkPrimary to-lavender bg-clip-text text-transparent">
            Buy, Wait,
          </span>
          <br />
          <span className="bg-gradient-to-r from-pinkPrimary to-lavender bg-clip-text text-transparent">
            or Skip
          </span>{' '}
          it?
        </h1>

        <p className="text-gray-500 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
          Buyology investigates the evidence — reviews, price signals, alternatives — and gives you a transparent verdict you can actually trust.
        </p>

        {/* Search box */}
        <div className="max-w-xl mx-auto mb-3">
          <SearchBar />
        </div>
        <p className="text-xs text-gray-400 mb-10">
          Try a product name like "Sony WH-1000XM5" or paste an Amazon / Best Buy URL
        </p>

        {/* Quick example chips */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Popular in this demo
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_CHIPS.map(({ label, verdict }) => {
              const { dot, label: abbr } = VERDICT_CHIP[verdict]
              return (
                <button
                  key={label}
                  onClick={() => handleChip(label)}
                  className="flex items-center gap-2 bg-white border border-gray-200 hover:border-pinkPrimary hover:shadow-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-all"
                  aria-label={`Search for ${label} — verdict hint: ${verdict}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${dot}`}>
                    {abbr}
                  </span>
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── VERDICT PILLS ────────────────────────────────────────────────── */}
      <section className="bg-[#FAFAFA] px-4 py-10 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Three verdicts. Zero guesswork.</h2>
          <p className="text-gray-500 text-sm">Every verdict comes with a plain-English explanation — no mystery scores.</p>
          <div className="flex flex-wrap gap-3 justify-center pt-2" role="list" aria-label="Verdict types">
            <div className="flex items-center gap-2 bg-buyGreen text-green-800 font-bold px-5 py-2.5 rounded-full text-sm" role="listitem">
              ✅ BUY <span className="font-normal opacity-70">— Good value, strong reviews, fair price</span>
            </div>
            <div className="flex items-center gap-2 bg-waitAmber text-amber-800 font-bold px-5 py-2.5 rounded-full text-sm" role="listitem">
              ⏳ WAIT <span className="font-normal opacity-70">— Price above target or info missing</span>
            </div>
            <div className="flex items-center gap-2 bg-skipRose text-red-800 font-bold px-5 py-2.5 rounded-full text-sm" role="listitem">
              ❌ SKIP <span className="font-normal opacity-70">— Poor reviews or better alternatives exist</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">How Buyology works</h2>
          <p className="text-gray-500 text-sm text-center mb-8">Evidence-driven, not opinion-driven.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(({ icon, num, title, desc }) => (
              <div
                key={num}
                className="bg-[#FAFAFA] border border-gray-100 rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-2xl">
                  {icon}
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step {num}</p>
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
