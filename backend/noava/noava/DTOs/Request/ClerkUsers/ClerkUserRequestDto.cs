namespace noava.DTOs.Request.ClerkUsers
{
    public class ClerkUserRequestDto
    {
        public string Id { get; set; } = string.Empty;
        public string? First_Name { get; set; }
        public string? Last_Name { get; set; }

        public List<ClerkEmailAddressRequestDto>? Email_Addresses { get; set; }
        public string? Primary_Email_Address_Id { get; set; }
    }
}