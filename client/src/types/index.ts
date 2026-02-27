// ─── Auth ──────────────────────────────────

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type Role =
  | "SUPER_ADMIN"
  | "HR_ADMIN"
  | "HR_STAFF"
  | "PESO_ADMIN"
  | "PESO_STAFF"
  | "VIEWER";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: Pick<User, "id" | "username" | "fullName" | "role">;
}

// ─── Employee ──────────────────────────────

export interface Employee {
  // allow arbitrary property access for table utility types
  [key: string]: any;

  id: string;
  employeeNo: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  birthdate: string;
  gender: "MALE" | "FEMALE";
  civilStatus: string;
  address: string;
  contactNo?: string;
  email?: string;
  position: string;
  department: string;
  salaryGrade?: number;
  stepIncrement?: number;
  employmentStatus: EmploymentStatus;
  dateHired: string;
  photoUrl?: string;
  bloodType?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  educationBg?: unknown;
  eligibility?: unknown;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    serviceRecords: number;
    documents: number;
  };
}

export type EmploymentStatus =
  | "PERMANENT"
  | "CASUAL"
  | "COTERMINOUS"
  | "JOB_ORDER"
  | "CONTRACT_OF_SERVICE"
  | "TEMPORARY"
  | "ELECTED";

// ─── Service Record ────────────────────────

export interface ServiceRecord {
  id: string;
  employeeId: string;
  dateFrom: string;
  dateTo?: string;
  designation: string;
  status: string;
  salary: number;
  office: string;
  branch?: string;
  lwop?: string;
  separationDate?: string;
  separationCause?: string;
  referenceNo?: string;
  remarks?: string;
  createdAt: string;
}

// ─── Beneficiary ───────────────────────────

export interface Beneficiary {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  birthdate: string;
  gender: "MALE" | "FEMALE";
  civilStatus: string;
  address: string;
  barangay: string;
  contactNo?: string;
  email?: string;
  educationLevel?: string;
  school?: string;
  course?: string;
  skills: string[];
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    spesEnrollments: number;
    ojtEnrollments: number;
    tupadEnrollments: number;
    livelihoodEnrollments: number;
  };
}

// ─── PESO Programs ─────────────────────────

export type ProgramStatus = "ACTIVE" | "COMPLETED" | "TERMINATED" | "GRADUATED" | "ON_HOLD";

export interface SpesEnrollment {
  id: string;
  beneficiaryId: string;
  school: string;
  yearLevel: string;
  assignedAgency: string;
  periodFrom: string;
  periodTo: string;
  dailyRate: number;
  totalDays: number;
  totalCompensation: number;
  govtShare?: number;
  employerShare?: number;
  status: ProgramStatus;
  batchYear: number;
  remarks?: string;
  createdAt: string;
  beneficiary?: Beneficiary;
}

export interface OjtEnrollment {
  id: string;
  beneficiaryId: string;
  school: string;
  course: string;
  hostCompany: string;
  periodFrom: string;
  periodTo: string;
  requiredHours: number;
  renderedHours?: number;
  supervisorName?: string;
  supervisorContact?: string;
  status: ProgramStatus;
  evaluationRating?: string;
  remarks?: string;
  createdAt: string;
  beneficiary?: Beneficiary;
}

export interface TupadEnrollment {
  id: string;
  beneficiaryId: string;
  projectName: string;
  workType: string;
  barangay: string;
  periodFrom: string;
  periodTo: string;
  totalDays: number;
  dailyWage: number;
  totalWage: number;
  skillsCategory?: string;
  batchNo?: string;
  status: ProgramStatus;
  remarks?: string;
  createdAt: string;
  beneficiary?: Beneficiary;
}

export type LivelihoodProgramType =
  | "SKILLS_TRAINING"
  | "STARTER_KIT"
  | "SEED_CAPITAL"
  | "CASH_ASSISTANCE"
  | "MICRO_ENTERPRISE";

export type LivelihoodStatus =
  | "APPLIED"
  | "APPROVED"
  | "DISBURSED"
  | "MONITORING"
  | "COMPLETED"
  | "TERMINATED";

export interface LivelihoodEnrollment {
  id: string;
  beneficiaryId: string;
  programType: LivelihoodProgramType;
  assistanceType?: string;
  amount?: number;
  businessType?: string;
  businessName?: string;
  status: LivelihoodStatus;
  approvedDate?: string;
  disbursedDate?: string;
  monitoringNotes?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  beneficiary?: Beneficiary;
}

// ─── Pagination ────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Dashboard ─────────────────────────────

export interface HRDashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  byDepartment: { department: string; count: number }[];
  byStatus: { status: string; count: number }[];
}

export interface PESODashboardStats {
  totalBeneficiaries: number;
  activePrograms: {
    spes: number;
    ojt: number;
    tupad: number;
    livelihood: number;
  };
  topBarangays: { barangay: string; count: number }[];
}

// aggregated stats returned by HR dashboard endpoint (includes PESO metrics)
export interface CombinedDashboardStats extends HRDashboardStats {
  totalServiceRecords: number;
  totalBeneficiaries?: number;
  // numeric sum of all active programs across PESO categories
  activePrograms?: number;
  // optional breakdown imported from PESODashboardStats
  activeProgramsByType?: PESODashboardStats["activePrograms"];
}
