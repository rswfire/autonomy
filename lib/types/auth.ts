// lib/types/auth.ts

import { JWTPayload } from 'jose'

export interface AuthPayload extends JWTPayload {
    user_id: string
    email: string
    role: string
}
