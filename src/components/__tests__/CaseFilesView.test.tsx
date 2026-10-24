import { render, screen } from '@testing-library/react'
import CaseFilesView from '../CaseFilesView'
import type { PurchaseCaseFile } from '../../types'

let mockCaseFiles: PurchaseCaseFile[] = []
let mockSkipped = 0
const mockDeleteCaseFile = vi.fn()

vi.mock('../../stores/userDataStore', () => ({
  default: (
    selector: (s: {
      caseFiles: PurchaseCaseFile[]
      skippedCaseFiles: number
      deleteCaseFile: typeof mockDeleteCaseFile
    }) => unknown,
  ) =>
    selector({
      caseFiles: mockCaseFiles,
      skippedCaseFiles: mockSkipped,
      deleteCaseFile: mockDeleteCaseFile,
    }),
}))

describe('CaseFilesView', () => {
  beforeEach(() => {
    mockCaseFiles = []
    mockSkipped = 0
    mockDeleteCaseFile.mockClear()
  })

  it('renders skipped-records banner when skippedCaseFiles > 0', () => {
    mockSkipped = 2
    render(<CaseFilesView />)
    expect(screen.getByText(/2 records? could not be loaded/i)).toBeInTheDocument()
  })

  it('does not render skipped-records banner when skippedCaseFiles is 0', () => {
    mockSkipped = 0
    render(<CaseFilesView />)
    expect(screen.queryByText(/could not be loaded/i)).not.toBeInTheDocument()
  })

  it('renders empty-state message when caseFiles is empty', () => {
    mockCaseFiles = []
    render(<CaseFilesView />)
    expect(screen.getByText(/no saved files yet/i)).toBeInTheDocument()
  })

  it('renders case file entries when caseFiles has items', () => {
    mockCaseFiles = [
      {
        id: 'cf-1',
        productName: 'Sony WH-1000XM5',
        productUrl: 'sony-wh-1000xm5',
        verdict: 'BUY',
        confidence: 85,
        preferences: {
          price: true,
          reviews: true,
          availability: true,
          brandTrust: true,
          sustainability: true,
        },
        timestamp: '2024-01-15T10:30:00.000Z',
      },
    ]
    render(<CaseFilesView />)
    expect(screen.getByText('Sony WH-1000XM5')).toBeInTheDocument()
  })
})
