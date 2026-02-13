using noava.Exceptions;

namespace noava.Exceptions
{
    public class NotFoundException : ApiException
    {
        public NotFoundException(string message)
            : base(message, StatusCodes.Status404NotFound)
        {
        }
    }
}
