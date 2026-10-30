import { SEED_USERS } from '@/lib/constants'
import { User, UserRole } from '@/types'

const STORAGE_KEY_USER = 'auth_user'
const STORAGE_KEY_TOKEN = 'auth_token'

export const authService = {
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY_USER)
    if (!raw) return null
    try {
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  },

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY_TOKEN)
  },

  async login(email: string, _password: string):Promise<{ user: User; token: string }> {
    // Giả lập network delay 400ms cho realistic feel
    await new Promise((resolve) => setTimeout(resolve, 400))

    const seed = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
    const user: User = seed
      ? {
          id: `u-${seed.role.toLowerCase()}`,
          name: seed.name,
          email: seed.email,
          role: seed.role,
          department: seed.department,
          avatar: seed.avatar,
        }
      : {
          id: 'u-custom',
          name: email.split('@')[0],
          email: email,
          role: 'IT_SUPPORT',
          department: 'Vận hành IT',
        }

    const token = `fake-jwt-token-${Date.now()}`
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
    localStorage.setItem(STORAGE_KEY_TOKEN, token)

    return { user, token }
  },

  async loginAsRole(role: UserRole): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const seed = SEED_USERS.find((u) => u.role === role) || SEED_USERS[1]

    const user: User = {
      id: `u-${seed.role.toLowerCase()}`,
      name: seed.name,
      email: seed.email,
      role: seed.role,
      department: seed.department,
      avatar: seed.avatar,
    }

    const token = `mock-token-${role}-${Date.now()}`
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))
    localStorage.setItem(STORAGE_KEY_TOKEN, token)

    return { user, token }
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_USER)
    localStorage.removeItem(STORAGE_KEY_TOKEN)
  },
}
