using noava.DTOs.ContactMessages;
using noava.Exceptions;
using noava.Mappers.ContactMessages;
using noava.Repositories.ContactMessages;
using noava.Services.Users;
using System.Security.Claims;

namespace noava.Services.ContactMessages
{
    public class ContactMessageService : IContactMessageService
    {
        private readonly IContactMessageRepository _contactRepository;
        private readonly IUserService _userService;

        public ContactMessageService(IContactMessageRepository contactMessageRepository, IUserService userService)
        {
            _contactRepository = contactMessageRepository;
            _userService = userService;
        }

        public async Task<IEnumerable<ContactMessageResponse>> GetAllAsync(string userId)
        {
            if (!await _userService.IsAdminAsync(userId))
                throw new UnauthorizedException();

            var entities = await _contactRepository.GetAllAsync();

            return entities.ToResponseDtos();
        }

        public async Task<ContactMessageResponse?> GetByIdAsync(int id, string userId)
        {
            if (!await _userService.IsAdminAsync(userId))
                throw new UnauthorizedException();

            var entity = await _contactRepository.GetByIdAsync(id);

            return entity?.ToResponseDto();
        }

        public async Task<ContactMessageResponse> CreateAsync(ContactMessageRequest dto)
        {
            var entity = dto.ToEntity();

            await _contactRepository.AddAsync(entity);

            return entity.ToResponseDto();
        }

        public async Task DeleteAsync(int id, string userId)
        {
            if (!await _userService.IsAdminAsync(userId))
                throw new UnauthorizedException();

            var entity = await _contactRepository.GetByIdAsync(id);

            if (entity == null)
                return;

            await _contactRepository.DeleteAsync(entity);
        }
    }
}