import useUserDataStore from '../stores/userDataStore'
import type { Verdict } from '../types'

const VERDICT_BADGE: Record<Verdict, string> = {
  BUY: 'bg-buyGreen text-green-800',
  WAIT: 'bg-waitAmber text-amber-800',
  SKIP: 'bg-skipRose text-red-800',
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const mins = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${mins}`
  } catch {
    return iso
  }
}

export default function CaseFilesView() {
  const caseFiles = useUserDataStore((s) => s.caseFiles)
  const skippedCaseFiles = useUserDataStore((s) => s.skippedCaseFiles)
  const deleteCaseFile = useUserDataStore((s) => s.deleteCaseFile)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Saved Case Files</h2>

      {skippedCaseFiles > 0 && (
        <div className="bg-waitAmber text-amber-800 rounded-lg px-4 py-2 text-sm font-medium">
          {skippedCaseFiles} record{skippedCaseFiles > 1 ? 's' : ''} could not be loaded from storage.
        </div>
      )}

      {caseFiles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          No saved files yet. Investigate a product and save it!
        </div>
      ) : (
        <ul className="space-y-3">
          {caseFiles.map((file) => (
            <li key={file.id} className="bg-white rounded-xl shadow-sm p-5 flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{file.productName}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${VERDICT_BADGE[file.verdict]}`}
                  >
                    {file.verdict}
                  </span>
                  <span className="text-xs text-gray-500">{file.confidence}% confidence</span>
                </div>
                <p className="text-xs text-gray-400">{formatTimestamp(file.timestamp)}</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Delete this case file?')) {
                    deleteCaseFile(file.id)
                  }
                }}
                aria-label={`Delete case file for ${file.productName}`}
                className="text-sm text-red-500 hover:text-red-700 shrink-0"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
