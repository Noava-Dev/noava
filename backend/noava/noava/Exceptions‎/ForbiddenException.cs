using noava.Exceptions;

namespace noava.Exceptions
{
    public class ForbiddenException : ApiException
    {
        public ForbiddenException(string message = "You do not have permission to perform this action.")
            : base(message, StatusCodes.Status403Forbidden)
        {
        }
    }
}
