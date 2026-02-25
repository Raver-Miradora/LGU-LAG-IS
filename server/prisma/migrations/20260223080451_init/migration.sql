-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'HR_ADMIN', 'HR_STAFF', 'PESO_ADMIN', 'PESO_STAFF', 'VIEWER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('PERMANENT', 'CASUAL', 'COTERMINOUS', 'JOB_ORDER', 'CONTRACT_OF_SERVICE', 'TEMPORARY', 'ELECTED');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'TERMINATED', 'GRADUATED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "LivelihoodProgramType" AS ENUM ('SKILLS_TRAINING', 'STARTER_KIT', 'SEED_CAPITAL', 'CASH_ASSISTANCE', 'MICRO_ENTERPRISE');

-- CreateEnum
CREATE TYPE "LivelihoodStatus" AS ENUM ('APPLIED', 'APPROVED', 'DISBURSED', 'MONITORING', 'COMPLETED', 'TERMINATED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employee_no" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "suffix" TEXT,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "civil_status" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact_no" TEXT,
    "email" TEXT,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "salary_grade" INTEGER,
    "step_increment" INTEGER,
    "employment_status" "EmploymentStatus" NOT NULL,
    "date_hired" TIMESTAMP(3) NOT NULL,
    "photo_url" TEXT,
    "blood_type" TEXT,
    "emergency_contact" TEXT,
    "emergency_phone" TEXT,
    "education_bg" JSONB,
    "eligibility" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_records" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "date_from" TIMESTAMP(3) NOT NULL,
    "date_to" TIMESTAMP(3),
    "designation" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "salary" DECIMAL(12,2) NOT NULL,
    "office" TEXT NOT NULL,
    "branch" TEXT,
    "lwop" TEXT,
    "separation_date" TIMESTAMP(3),
    "separation_cause" TEXT,
    "reference_no" TEXT,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_documents" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "description" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "id_cards" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "id_number" TEXT NOT NULL,
    "issued_date" TIMESTAMP(3) NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "qr_data" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "id_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beneficiaries" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "suffix" TEXT,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "civil_status" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "barangay" TEXT NOT NULL,
    "contact_no" TEXT,
    "email" TEXT,
    "education_level" TEXT,
    "school" TEXT,
    "course" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "photo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spes_enrollments" (
    "id" TEXT NOT NULL,
    "beneficiary_id" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "year_level" TEXT NOT NULL,
    "assigned_agency" TEXT NOT NULL,
    "period_from" TIMESTAMP(3) NOT NULL,
    "period_to" TIMESTAMP(3) NOT NULL,
    "daily_rate" DECIMAL(10,2) NOT NULL,
    "total_days" INTEGER NOT NULL,
    "total_compensation" DECIMAL(12,2) NOT NULL,
    "govt_share" DECIMAL(12,2),
    "employer_share" DECIMAL(12,2),
    "status" "ProgramStatus" NOT NULL DEFAULT 'ACTIVE',
    "batch_year" INTEGER NOT NULL,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spes_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ojt_enrollments" (
    "id" TEXT NOT NULL,
    "beneficiary_id" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "host_company" TEXT NOT NULL,
    "period_from" TIMESTAMP(3) NOT NULL,
    "period_to" TIMESTAMP(3) NOT NULL,
    "required_hours" INTEGER NOT NULL,
    "rendered_hours" INTEGER,
    "supervisor_name" TEXT,
    "supervisor_contact" TEXT,
    "status" "ProgramStatus" NOT NULL DEFAULT 'ACTIVE',
    "evaluation_rating" TEXT,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ojt_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tupad_enrollments" (
    "id" TEXT NOT NULL,
    "beneficiary_id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "work_type" TEXT NOT NULL,
    "barangay" TEXT NOT NULL,
    "period_from" TIMESTAMP(3) NOT NULL,
    "period_to" TIMESTAMP(3) NOT NULL,
    "total_days" INTEGER NOT NULL,
    "daily_wage" DECIMAL(10,2) NOT NULL,
    "total_wage" DECIMAL(12,2) NOT NULL,
    "skills_category" TEXT,
    "batch_no" TEXT,
    "status" "ProgramStatus" NOT NULL DEFAULT 'ACTIVE',
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tupad_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livelihood_enrollments" (
    "id" TEXT NOT NULL,
    "beneficiary_id" TEXT NOT NULL,
    "program_type" "LivelihoodProgramType" NOT NULL,
    "assistance_type" TEXT,
    "amount" DECIMAL(12,2),
    "business_type" TEXT,
    "business_name" TEXT,
    "status" "LivelihoodStatus" NOT NULL DEFAULT 'APPLIED',
    "approved_date" TIMESTAMP(3),
    "disbursed_date" TIMESTAMP(3),
    "monitoring_notes" TEXT,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "livelihood_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_no_key" ON "employees"("employee_no");

-- CreateIndex
CREATE UNIQUE INDEX "id_cards_id_number_key" ON "id_cards"("id_number");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- AddForeignKey
ALTER TABLE "service_records" ADD CONSTRAINT "service_records_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "id_cards" ADD CONSTRAINT "id_cards_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spes_enrollments" ADD CONSTRAINT "spes_enrollments_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ojt_enrollments" ADD CONSTRAINT "ojt_enrollments_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tupad_enrollments" ADD CONSTRAINT "tupad_enrollments_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livelihood_enrollments" ADD CONSTRAINT "livelihood_enrollments_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
