import { prismaClient } from '../../prisma/prisma'
import { CreateTransactionInput, EditTransactionInput} from '../dtos/input/transaction.input'

export class TransactionService {
  async createTransaction(data: CreateTransactionInput, userId: string) {
    return prismaClient.transaction.create({
      data: {
        amount: data.amount,
        description: data.description,
        date: data.date,
        categoryId: data.categoryId,
        userId: userId,
      },
    })
  }

  async listTransactionsByUser(userId: string) {
    return prismaClient.transaction.findMany({
      where: { userId: userId },
      orderBy: { date: 'desc' },
    })
  }

  async editTransaction(data: EditTransactionInput, userId: string) {
    const transaction = await prismaClient.transaction.findUnique({
      where: { id: data.id, userId: userId },
    })

    if (!transaction) {
      throw new Error('Transação não encontrada')
    }

    return prismaClient.transaction.update({
      where: { id: data.id, userId: userId },
      data: {
        amount: data.amount,
        description: data.description,
        date: data.date,
        categoryId: data.categoryId,
      },
    })
  }

  async deleteTransaction(id: string, userId: string) {
    const transaction = await prismaClient.transaction.findUnique({
      where: { id: id, userId: userId },
    })

    if (!transaction) {
      throw new Error('Transação não encontrada')
    }

    await prismaClient.transaction.delete({
      where: { id: id, userId: userId },
    })

    return true // verificar esse return true
  }
}