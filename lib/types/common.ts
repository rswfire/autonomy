// lib/types/common.ts
import { Prisma } from '@prisma/client'

export type Coordinates = {
    latitude: number
    longitude: number
}

export type GeographyPoint = {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude] per GeoJSON spec
}

export type EmbeddingVector = number[] // 1536 dimensions for OpenAI ada-002

export const isPostgres = process.env.DATABASE_URL?.startsWith('postgres')

export type JsonValue = Prisma.JsonValue
export type JsonObject = Prisma.JsonObject
