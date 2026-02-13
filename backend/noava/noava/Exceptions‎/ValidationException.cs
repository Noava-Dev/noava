using noava.Exceptions;

namespace noava.Exceptions
{
    public class ValidationException : ApiException
    {
        public IEnumerable<string> Errors { get; }

        public ValidationException(IEnumerable<string> errors)
            : base("One or more validation errors occurred.", StatusCodes.Status400BadRequest)
        {
            Errors = errors;
        }
    }
}