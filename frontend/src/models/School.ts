export interface SchoolAdminDto {
  clerkId: string;
  username: string;
  email: string;
}

export interface SchoolDto {
  schoolId: number;
  schoolName: string;
  admins: SchoolAdminDto[];
  createdAt: string;
}

export interface CreateSchoolRequest {
  name: string;
  schoolAdminEmails: string[];
}