namespace noava.Exceptions
{
    public class UnauthorizedException : ApiException
    {
        public UnauthorizedException(string message = "Authentication required.")
            : base(message, StatusCodes.Status401Unauthorized)
        {
        }
    }
}