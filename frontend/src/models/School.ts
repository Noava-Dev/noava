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

//Not sure about this one
export interface UpdateSchoolRequest{
  name: string;
  schoolAdminEmails: string[];
}

export interface DeleteSchoolRequest{
  schoolId: number;
}

export interface SchoolClassroomDto{
  id: number;
  name: string;
  description?: string;
  deckCount?: number;
  studentCount?: number;
}
