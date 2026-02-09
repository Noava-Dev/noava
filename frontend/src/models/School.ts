export interface ClerkUserDto {
  clerkId: string;
  email: string;
  username: string;
}

export interface SchoolDto {
  id: number;
  schoolName: string;
  createdBy: ClerkUserDto;
  admins: ClerkUserDto[];
  createdAt: string;
  updatedAt: string;
}

export interface SchoolRequest {
  schoolName: string;
  schoolAdminEmails: string[];
}
