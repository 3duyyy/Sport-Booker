import { prisma } from '../../shared/prisma/client'

export class SportsRepository {
  static async findAll() {
    return prisma.sport.findMany({
      orderBy: { name: 'asc' }
    })
  }
}
