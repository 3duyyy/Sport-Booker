import { prisma } from '../../shared/prisma/client'

export class UtilitiesRepository {
  static async findAll() {
    return prisma.utility.findMany({
      orderBy: { name: 'asc' }
    })
  }
}
