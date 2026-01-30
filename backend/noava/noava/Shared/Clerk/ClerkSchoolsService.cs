using noava.DTOs.Schools;
using System.Net.Http.Headers;
using System.Text.Json;

namespace noava.Shared.Clerk
{
    public class ClerkSchoolsService : IClerkSchoolService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public ClerkSchoolsService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["Clerk:SecretKeyDefault"] ?? throw new ArgumentNullException("Clerk API Key missing");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        }
        public async Task<List<string>> GetClerkUserIdByEmailsAsync(IEnumerable<string> emails)
        {
            if (!emails.Any()) return [];

            //if & doesn't work it could mean that clerk uses , to seperate instead of &
            //also not using a foreach to loop over every email since that would constantly call Clerk
            // this just runs a batch
            var query = string.Join("&", emails.Select(e => $"email_address={Uri.EscapeDataString(e)}"));
            var response = await _httpClient.GetAsync($"https://api.clerk.com/v1/users?{query}");

            response.EnsureSuccessStatusCode();

            var users = await response.Content.ReadFromJsonAsync<List<JsonElement>>();
            return users!
                .Select(u => u.GetProperty("id").GetString()!)
                .ToList();
        }

        public async Task<List<UserSummaryDto>> GetUsersByClerkIdsAsync(IEnumerable<string> clerkIds)
        {
            if (!clerkIds.Any()) return [];

            //if & doesn't work it could mean that clerk uses , to seperate instead of &
            var query = string.Join("&", clerkIds.Select(id => $"user_id={Uri.EscapeDataString(id)}"));
            var response = await _httpClient.GetAsync($"https://api.clerk.com/v1/users?{query}");

            response.EnsureSuccessStatusCode();

            var users = await response.Content.ReadFromJsonAsync<List<JsonElement>>();
            return users!.Select(u => new UserSummaryDto
            {
                ClerkId = u.GetProperty("id").GetString()!,
                Email = u.GetProperty("email_addresses")[0].GetProperty("email_address").GetString()!,
                Username = u.GetProperty("username").GetString() ?? ""
            }).ToList();
        }
    }
}

//Docs used: https://clerk.com/docs/reference/backend-api/tag/users => go to "query parameters"
