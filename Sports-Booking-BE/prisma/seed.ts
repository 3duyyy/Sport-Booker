import 'dotenv/config'
import bcrypt from 'bcryptjs'
// import { PrismaClient } from '@prisma/client'
import { PrismaClient } from './../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../src/shared/constants/roles'

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  connectionLimit: 5
})

const prisma = new PrismaClient({ adapter })

async function main() {
  // ====================== SEED ROLES ======================
  // Lấy roles từ ROLES constant
  const roles = Object.entries(ROLES).map(([key, id]) => ({
    id,
    name: key.toLowerCase(), // Chuyển ADMIN → "admin", OWNER → "owner"
    description: `${key} role - ${getRoleDescription(id)}`
  }))

  // Seed roles
  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { description: role.description },
      create: role
    })
  }
  console.log(`Seeded ${roles.length} roles`)

  // ====================== SEED PERMISSIONS ======================
  // Lấy permissions từ PERMISSIONS constant
  const permissions = Object.entries(PERMISSIONS).map(([key, slug]) => ({
    slug,
    name: getPermissionName(slug) // Chuyển "manage_users" → "Quản lý người dùng"
  }))

  // Seed permissions
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { slug: permission.slug },
      update: { name: permission.name },
      create: permission
    })
  }
  console.log(`Seeded ${permissions.length} permissions`)

  // ====================== SEED ROLE-PERMISSION MAPPINGS ======================
  // Xóa tất cả mappings cũ để seed lại
  await prisma.rolePermission.deleteMany({})

  // Seed mappings từ ROLE_PERMISSIONS constant
  for (const [roleId, permissionSlugs] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.findUnique({ where: { id: Number(roleId) } })
    if (!role) continue

    // Lấy tất cả permission IDs tương ứng với slugs
    const permissions = await prisma.permission.findMany({
      where: { slug: { in: permissionSlugs } },
      select: { id: true }
    })

    // Tạo mappings
    for (const { id: permissionId } of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId
          }
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId
        }
      })
    }
  }
  console.log('Seeded role-permission mappings')

  // ====================== SEED DEFAULT USERS ======================
  const adminPassword = await bcrypt.hash('Abc@123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@sportsbooking.com' },
    update: {},
    create: {
      email: 'admin@sportsbooking.com',
      passwordHash: adminPassword,
      fullName: 'System Administrator',
      phone: '0974925573',
      roleId: ROLES.ADMIN,
      status: 'active',
      isVerified: true,
      bankName: 'MB Bank',
      bankAccount: '0974925573',
      accountHolder: 'NGUYEN BA DUY'
    }
  })

  const ownerPassword = await bcrypt.hash('owner123', 10)
  await prisma.user.upsert({
    where: { email: 'owner@sportsbooking.com' },
    update: {},
    create: {
      email: 'owner@sportsbooking.com',
      passwordHash: ownerPassword,
      fullName: 'Test Field Owner',
      phone: '0987654321',
      roleId: ROLES.OWNER,
      status: 'active',
      isVerified: true,
      bankName: 'Techcombank',
      bankAccount: '987654321',
      accountHolder: 'Nguyễn Văn Owner'
    }
  })

  const customerPassword = await bcrypt.hash('customer123', 10)
  await prisma.user.upsert({
    where: { email: 'customer@sportsbooking.com' },
    update: {},
    create: {
      email: 'customer@sportsbooking.com',
      passwordHash: customerPassword,
      fullName: 'Test Customer',
      phone: '0369258147',
      roleId: ROLES.CUSTOMER,
      status: 'active',
      isVerified: true,
      bankName: 'MB Bank',
      bankAccount: '1122334455',
      accountHolder: 'Lê Văn Khách'
    }
  })
  console.log('Seeded default users')

  // ====================== HELPER FUNCTIONS ======================
  function getRoleDescription(roleId: number): string {
    switch (roleId) {
      case ROLES.ADMIN:
        return 'Full access to the system'
      case ROLES.OWNER:
        return 'Manage own facilities and bookings'
      case ROLES.CUSTOMER:
        return 'Book facilities and manage own bookings'
      default:
        return ''
    }
  }

  function getPermissionName(slug: string): string {
    const mapping: Record<string, string> = {
      manage_users: 'Quản lý người dùng',
      create_facility: 'Tạo sân',
      update_facility: 'Cập nhật sân',
      delete_facility: 'Xóa sân',
      approve_facility: 'Phê duyệt sân',
      create_field: 'Tạo sân con',
      update_field: 'Cập nhật sân con',
      delete_field: 'Xóa sân con',
      create_booking: 'Tạo booking',
      view_own_bookings: 'Xem booking của mình',
      view_facility_bookings: 'Xem booking của sân mình',
      view_all_bookings: 'Xem tất cả booking',
      view_own_payments: 'Xem payment của mình',
      view_facility_payments: 'Xem payment của sân mình',
      view_all_payments: 'Xem tất cả payment',
      process_refund: 'Xử lý hoàn tiền',
      create_review: 'Tạo review',
      update_own_review: 'Cập nhật review của mình',
      delete_review: 'Xóa review'
    }
    return mapping[slug] || slug
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
