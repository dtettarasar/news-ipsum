const MAX_EMAIL_LENGTH = 320
const MAX_PASSWORD_LENGTH = 1024

export const isValidEmail = (value: unknown): value is string => {
    if (typeof value !== 'string') return false
    if (value.length === 0 || value.length > MAX_EMAIL_LENGTH) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export const isValidPassword = (value: unknown): value is string => {
    if (typeof value !== 'string') return false
    return value.length >= 1 && value.length <= MAX_PASSWORD_LENGTH
}