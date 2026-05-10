// Simple password check — set ADMIN_PASSWORD in .env.local
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'autoform-admin'

export function checkPassword(pw: string): boolean {
  return pw === ADMIN_PASSWORD
}
