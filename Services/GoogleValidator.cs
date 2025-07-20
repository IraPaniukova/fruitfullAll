using fruitfullServer.Services;
using Google.Apis.Auth;

public class GoogleValidator : IGoogleValidator
// Calls Google's real ValidateAsync method at runtime, isolated to be able to mock in the test

{
    public Task<GoogleJsonWebSignature.Payload?> ValidateAsync(string idToken)
        => GoogleJsonWebSignature.ValidateAsync(idToken);
}
