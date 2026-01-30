using noava.DTOs.Request.ClerkUsers;
using noava.DTOs.Response.Users;
using noava.Mappers.ClerkUsers;
using noava.Shared.Contract;
using System.Net.Http.Headers;
using System.Text.Json;

namespace noava.Shared.Implementation
{
    public class ClerkService : IClerkService
    {
        private readonly HttpClient _httpClient;

        public ClerkService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://api.clerk.com/v1/");
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue(
                    "Bearer",
                    configuration["Clerk:SecretKeyDefault"]
                );
        }

        public async Task<ClerkUserResponseDto?> GetUserAsync(string clerkUserId)
        {
            if (string.IsNullOrWhiteSpace(clerkUserId))
                return null;

            return (await GetUsersAsync(new[] { clerkUserId }))
                .FirstOrDefault();
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

            var response = await _httpClient.GetAsync($"users?{query}");
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
    }
}