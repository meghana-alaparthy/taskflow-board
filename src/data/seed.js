export const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
]

export const LABELS = ['bug', 'feature', 'docs', 'chore']
export const PRIORITIES = ['low', 'medium', 'high']

// Due dates are relative to first load so the demo always feels "current":
// a couple of tasks start out overdue, most are due in the coming days.
const DAY = 24 * 60 * 60 * 1000
const now = Date.now()
const dueIn = (days) => new Date(now + days * DAY).toISOString().slice(0, 10)

export const seedTasks = [
  {
    id: 'seed-1',
    title: 'Fix login redirect loop',
    description:
      'Users get bounced back to /login right after a successful sign-in when the session cookie is set with SameSite=Lax. Reproduced in Chrome and Safari.',
    column: 'backlog',
    label: 'bug',
    priority: 'high',
    dueDate: dueIn(3),
    createdAt: now - 6 * DAY,
  },
  {
    id: 'seed-2',
    title: 'Payments webhook retries creating duplicate charges',
    description:
      'Stripe retries the webhook on 500s and we process it twice. Make the handler idempotent on the event id before touching the ledger.',
    column: 'in-progress',
    label: 'bug',
    priority: 'high',
    dueDate: dueIn(-1),
    createdAt: now - 5 * DAY,
  },
  {
    id: 'seed-3',
    title: 'Write API docs for payments endpoint',
    description:
      'Cover POST /v1/payments request/response shapes, idempotency keys, and the error codes we actually return. Publish to the docs site.',
    column: 'in-progress',
    label: 'docs',
    priority: 'low',
    dueDate: dueIn(6),
    createdAt: now - 4 * DAY,
  },
  {
    id: 'seed-4',
    title: 'Dark mode toggle for settings',
    description:
      'Add a theme switcher in account settings. Persist the choice per user and respect prefers-color-scheme on first visit.',
    column: 'in-progress',
    label: 'feature',
    priority: 'medium',
    dueDate: dueIn(5),
    createdAt: now - 4 * DAY,
  },
  {
    id: 'seed-5',
    title: 'Rate limiting on public API',
    description:
      'Token bucket per API key, 1000 req/min default. Return 429 with Retry-After headers instead of dropping connections.',
    column: 'review',
    label: 'feature',
    priority: 'high',
    dueDate: dueIn(2),
    createdAt: now - 8 * DAY,
  },
  {
    id: 'seed-6',
    title: 'Upgrade Postgres to v16 on staging',
    description:
      'Snapshot first, then run the upgrade during the maintenance window. Verify the analytics views still return identical results.',
    column: 'review',
    label: 'chore',
    priority: 'medium',
    dueDate: dueIn(4),
    createdAt: now - 7 * DAY,
  },
  {
    id: 'seed-7',
    title: 'Add CSV export to reports page',
    description:
      'Export whatever the current filter shows, not the whole table. Cap at 50k rows and stream the download.',
    column: 'backlog',
    label: 'feature',
    priority: 'medium',
    dueDate: dueIn(9),
    createdAt: now - 3 * DAY,
  },
  {
    id: 'seed-8',
    title: 'Document onboarding checklist for new hires',
    description:
      'Laptop setup, repo access, staging credentials, and who to shadow in week one. Keep it to one page.',
    column: 'backlog',
    label: 'docs',
    priority: 'low',
    dueDate: dueIn(12),
    createdAt: now - 2 * DAY,
  },
  {
    id: 'seed-9',
    title: 'Fix timezone offset in activity feed',
    description:
      'Timestamps rendered in server time instead of the viewer timezone. Switched rendering to Intl.DateTimeFormat with the user locale.',
    column: 'done',
    label: 'bug',
    priority: 'medium',
    dueDate: dueIn(-6),
    createdAt: now - 12 * DAY,
  },
  {
    id: 'seed-10',
    title: 'Remove deprecated v1 auth routes',
    description:
      'All clients migrated months ago. Deleted the routes and the legacy token table after the final backup.',
    column: 'done',
    label: 'chore',
    priority: 'low',
    dueDate: dueIn(-9),
    createdAt: now - 14 * DAY,
  },
]
