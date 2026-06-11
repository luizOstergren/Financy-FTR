import type { Category } from '@/types/category'

export type Transaction = {
  id: string
  amount: number
  description?: string
  date: string
  createdAt: string
  updatedAt: string
  category: Category
}