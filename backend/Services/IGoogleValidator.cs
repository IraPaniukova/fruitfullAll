using Google.Apis.Auth;

namespace fruitfullServer.Services;

public interface IGoogleValidator
// Interface for Google token validation (for mocking in tests)

{
    Task<GoogleJsonWebSignature.Payload?> ValidateAsync(string idToken);
}