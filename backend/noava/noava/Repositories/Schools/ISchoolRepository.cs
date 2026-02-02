using noava.Models;

namespace noava.Repositories.Schools
{
    public interface ISchoolRepository
    {
        //Get
        Task<List<School>> GetAllSchoolsAsync();
        Task<School?> GetSchoolByIdAsync(int id);


        //CRUD
        Task<School> CreateSchoolAsync(School school);
        Task<School> UpdateSchoolAsync(School school);
        Task DeleteSchoolAsync(int id);
    }
}