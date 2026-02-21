using noava.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Unhandled exception occurred");

        var statusCode = exception switch
        {
            ApiException apiEx => apiEx.StatusCode,
            _ => StatusCodes.Status500InternalServerError
        };

        object response = exception switch
        {
            ValidationException validationEx => new
            {
                statusCode,
                message = validationEx.Message,
                errors = validationEx.Errors
            },

            ApiException apiEx => new
            {
                statusCode,
                message = apiEx.Message
            },

            _ => new
            {
                statusCode,
                message = exception.Message,
                innerException = exception.InnerException?.Message,
                stackTrace = exception.StackTrace
            }
        };

        context.Response.StatusCode = statusCode;

        await context.Response.WriteAsJsonAsync(response, cancellationToken);

        return true;
    }
}