using noava.DTOs.Clerk;
using noava.Mappers.ClerkUsers;
using System.Net.Http.Headers;
using System.Text.Json;

namespace noava.Shared
{
    public class ClerkService : IClerkService
    {
        private readonly HttpClient _httpClient;

        public ClerkService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://api.clerk.com/v1/");
            var secretKey = configuration["Clerk:SecretKeyDefault"];
            if (string.IsNullOrWhiteSpace(secretKey))
                throw new InvalidOperationException("Clerk secret key is not configured.");
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", secretKey);
        }

        public async Task<ClerkUserResponseDto?> GetUserAsync(string clerkUserId)
        {
            if (string.IsNullOrWhiteSpace(clerkUserId))
                return null;

            var users = await GetUsersAsync(new[] { clerkUserId });
            return users.FirstOrDefault();
        }

        public async Task<IEnumerable<ClerkUserResponseDto>> GetUsersAsync(IEnumerable<string> clerkUserIds)
        {
            var ids = clerkUserIds
                .Where(id => !string.IsNullOrWhiteSpace(id))
                .Distinct()
                .ToList();

            if (!ids.Any())
                return Enumerable.Empty<ClerkUserResponseDto>();

            var query = string.Join("&", ids.Select(id => $"user_id={id}"));
            var url = $"users?{query}";

            var response = await _httpClient.GetAsync(url);

            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized ||
                response.StatusCode == System.Net.HttpStatusCode.Forbidden ||
                response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                // Clerk API key invalid or user(s) not found
                return Enumerable.Empty<ClerkUserResponseDto>();
            }

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var requestDtos =
                JsonSerializer.Deserialize<List<ClerkUserRequestDto>>(
                    json,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    })
                ?? new List<ClerkUserRequestDto>();

            return requestDtos
                .Select(u => u.ToResponse())
                .ToList();
        }

        public async Task<ClerkUserResponseDto?> GetUserByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return null;

            var url = $"users?email_address={Uri.EscapeDataString(email)}";
            var response = await _httpClient.GetAsync(url);

            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized ||
                response.StatusCode == System.Net.HttpStatusCode.Forbidden ||
                response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                // Clerk API key invalid or user not found
                return null;
            }

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var requestDtos =
                JsonSerializer.Deserialize<List<ClerkUserRequestDto>>(
                    json,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    })
                ?? new List<ClerkUserRequestDto>();

            return requestDtos
                .Select(u => u.ToResponse())
                .FirstOrDefault();
        }

        public async Task<IEnumerable<ClerkUserResponseDto>> GetAllUsersAsync()
        {
            // Note: i gotta change the limit at some point
            var response = await _httpClient.GetAsync("users?limit=100");

            if (!response.IsSuccessStatusCode)
            {
                return Enumerable.Empty<ClerkUserResponseDto>();
            }

            var json = await response.Content.ReadAsStringAsync();

            var requestDtos =
                JsonSerializer.Deserialize<List<ClerkUserRequestDto>>(
                    json,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    })
                ?? new List<ClerkUserRequestDto>();

            return requestDtos
                .Select(u => u.ToResponse())
                .ToList();
        }

        public async Task<bool> DeleteUserAsync(string clerkUserId)
        {
            if (string.IsNullOrWhiteSpace(clerkUserId))
                return false;

            var response = await _httpClient.DeleteAsync($"users/{clerkUserId}");

            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized ||
                response.StatusCode == System.Net.HttpStatusCode.Forbidden ||
                response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return false;
            }

            response.EnsureSuccessStatusCode();

            return true;
        }
    }
}