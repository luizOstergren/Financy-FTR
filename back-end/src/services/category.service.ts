import { prismaClient } from '../../prisma/prisma'
import {
  CreateCategoryInput,
  EditCategoryInput,
} from '../dtos/input/category.input'

export class CategoryService {
  async createCategory(data: CreateCategoryInput, userId: string) {
    const existingCategory = await prismaClient.category.findUnique({
      where: { name_userId: { name: data.name, userId: userId } },
    })

    if (existingCategory) {
      throw new Error('Já existe uma categoria com esse nome')
    }

    return prismaClient.category.create({
      data: {
        userId: userId,
        name: data.name,
        description: data.description ?? null,
        color: data.color,
        icon: data.icon,
      },
    })
  }

  async listCategoriesByUser(userId: string) {
    return prismaClient.category.findMany({
      where: { userId: userId },
      orderBy: { name: 'asc' },
    })
  }

  async findCategory(id: string, userId: string) {
    return prismaClient.category.findUnique({
      where: { id: id, userId: userId },
    })
  }

  async editCategory(data: EditCategoryInput, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: { id: data.id, userId: userId },
    })

    if (!category) {
      throw new Error('Categoria não encontrada')
    }

    const existingCategory = await prismaClient.category.findFirst({
      where: {
        name: data.name,
        userId: userId,
        id: { not: data.id },
      },
    })

    if (existingCategory) {
      throw new Error('Já existe uma categoria com esse nome')
    }

    return prismaClient.category.update({
      where: { id: data.id, userId: userId },
      data: {
        name: data.name,
        description: data.description ?? null,
        color: data.color,
        icon: data.icon,
      },
    })
  }

  async deleteCategory(id: string, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: { id: id, userId: userId },
    })

    if (!category) {
      throw new Error('Categoria não encontrada')
    }

    await prismaClient.category.delete({
      where: { id: id, userId: userId },
    })
    return true
  }

  async countTransactionsInCategory(id: string, userId: string): Promise<number> {
    const count = await prismaClient.transaction.count({
      where: { categoryId: id, userId: userId },
    })
    return count
  }
}