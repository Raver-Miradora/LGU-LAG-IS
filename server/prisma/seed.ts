// @ts-ignore: missing type declarations for prisma client in seed script
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default Super Admin
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: hashedPassword,
      fullName: "System Administrator",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log(`  ✅ Super Admin created: ${admin.username}`);

  // Create HR Admin
  const hrAdmin = await prisma.user.upsert({
    where: { username: "hr_admin" },
    update: {},
    create: {
      username: "hr_admin",
      passwordHash: await bcrypt.hash("hr12345678", 12),
      fullName: "HR Administrator",
      role: "HR_ADMIN",
      isActive: true,
    },
  });
  console.log(`  ✅ HR Admin created: ${hrAdmin.username}`);

  // Create PESO Admin
  const pesoAdmin = await prisma.user.upsert({
    where: { username: "peso_admin" },
    update: {},
    create: {
      username: "peso_admin",
      passwordHash: await bcrypt.hash("peso12345678", 12),
      fullName: "PESO Administrator",
      role: "PESO_ADMIN",
      isActive: true,
    },
  });
  console.log(`  ✅ PESO Admin created: ${pesoAdmin.username}`);

  // Seed system settings
  const settings = [
    { key: "lgu_name", value: "Municipality of Lagonoy", description: "LGU name displayed on documents" },
    { key: "lgu_province", value: "Camarines Sur", description: "Province name" },
    { key: "lgu_address", value: "Lagonoy, Camarines Sur", description: "LGU full address" },
    { key: "mayor_name", value: "Hon. Municipal Mayor", description: "Name of the Municipal Mayor for signatories" },
    { key: "hr_officer_name", value: "HR Officer", description: "Name of HR officer for signatories" },
    { key: "peso_manager_name", value: "PESO Manager", description: "Name of PESO manager for signatories" },
    { key: "id_validity_years", value: "1", description: "Number of years an LGU ID is valid" },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`  ✅ System settings seeded (${settings.length} entries)`);

  // Seed sample employee
  const sampleEmployee = await prisma.employee.upsert({
    where: { employeeNo: "LGU-2026-0001" },
    update: {},
    create: {
      employeeNo: "LGU-2026-0001",
      firstName: "Juan",
      middleName: "Santos",
      lastName: "Dela Cruz",
      birthdate: new Date("1990-05-15"),
      gender: "MALE",
      civilStatus: "Married",
      address: "Brgy. San Francisco, Lagonoy, Camarines Sur",
      contactNo: "09171234567",
      email: "juan.delacruz@lagonoy.gov.ph",
      position: "Administrative Aide IV",
      department: "Municipal Planning and Development Office",
      salaryGrade: 4,
      stepIncrement: 1,
      employmentStatus: "PERMANENT",
      dateHired: new Date("2020-07-01"),
      bloodType: "O+",
      emergencyContact: "Maria Dela Cruz",
      emergencyPhone: "09181234567",
    },
  });
  console.log(`  ✅ Sample employee created: ${sampleEmployee.firstName} ${sampleEmployee.lastName}`);

  // Add sample service record
  await prisma.serviceRecord.create({
    data: {
      employeeId: sampleEmployee.id,
      dateFrom: new Date("2020-07-01"),
      dateTo: null,
      designation: "Administrative Aide IV",
      status: "PERMANENT",
      salary: 15000,
      office: "Municipal Planning and Development Office",
      branch: "LGU Lagonoy",
      referenceNo: "APP-2020-001",
    },
  });
  console.log(`  ✅ Sample service record created`);

  // Seed sample beneficiary
  const sampleBeneficiary = await prisma.beneficiary.create({
    data: {
      firstName: "Maria",
      middleName: "Lopez",
      lastName: "Garcia",
      birthdate: new Date("2004-03-20"),
      gender: "FEMALE",
      civilStatus: "Single",
      address: "Brgy. Panicuason, Lagonoy, Camarines Sur",
      barangay: "Panicuason",
      contactNo: "09191234567",
      educationLevel: "College",
      school: "Camarines Sur Polytechnic Colleges",
      course: "BS Information Technology",
      skills: ["Computer Literacy", "Data Entry"],
    },
  });
  console.log(`  ✅ Sample beneficiary created: ${sampleBeneficiary.firstName} ${sampleBeneficiary.lastName}`);

  // Enroll sample beneficiary in SPES
  await prisma.spesEnrollment.create({
    data: {
      beneficiaryId: sampleBeneficiary.id,
      school: "Camarines Sur Polytechnic Colleges",
      yearLevel: "3rd Year",
      assignedAgency: "Municipal Planning and Development Office",
      periodFrom: new Date("2026-04-01"),
      periodTo: new Date("2026-05-31"),
      dailyRate: 400,
      totalDays: 40,
      totalCompensation: 16000,
      govtShare: 9600,
      employerShare: 6400,
      batchYear: 2026,
      status: "ACTIVE",
    },
  });
  console.log(`  ✅ Sample SPES enrollment created`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Default Credentials:");
  console.log("  Super Admin → admin / admin123");
  console.log("  HR Admin    → hr_admin / hr12345678");
  console.log("  PESO Admin  → peso_admin / peso12345678");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
