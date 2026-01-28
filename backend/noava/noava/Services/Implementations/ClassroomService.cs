using noava.Services.Contracts;
using System.Security.Cryptography;

namespace noava.Services.Implementations
{
    public class ClassroomService : IClassroomService
    {
        public string GenerateClassroomCode()
        {
            byte[] tokenBytes = new byte[16];
            RandomNumberGenerator.Fill(tokenBytes);

            string token = Convert.ToBase64String(tokenBytes)
                                 .TrimEnd('=') 
                                 .Replace('+', '-')
                                 .Replace('/', '_');
            return token;
        }
    }
}