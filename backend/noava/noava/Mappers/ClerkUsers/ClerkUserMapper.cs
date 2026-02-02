using noava.DTOs.Clerk;

namespace noava.Mappers.ClerkUsers
{
    public static class ClerkUserMapper
    {
        public static ClerkUserResponseDto ToResponse(this ClerkUserRequestDto dto, bool isTeacher = false)
        {
            var primaryEmail = dto.Email_Addresses?
                .FirstOrDefault(e => e.Id == dto.Primary_Email_Address_Id)
                ?.Email_Address;

            return new ClerkUserResponseDto
            {
                ClerkId = dto.Id,
                FirstName = dto.First_Name ?? string.Empty,
                LastName = dto.Last_Name ?? string.Empty,
                Email = primaryEmail ?? string.Empty,
                IsTeacher = isTeacher
            };
        }
    }
}