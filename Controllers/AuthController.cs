using Microsoft.AspNetCore.Mvc;
using fruitfullServer.DTO.Auth;
using fruitfullServer.Services;
using Microsoft.AspNetCore.Authorization;

namespace fruitfullServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // POST: api/Auth/login/google
        [HttpPost("login/google")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginDto dto)
        {
            try
            {
                var authResponse = await _authService.LoginWithGoogleAsync(dto.IdToken);
                return Ok(authResponse);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid Google token or user not registered.");
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var authResponse = await _authService.LoginWithEmailAsync(dto);
                return Ok(authResponse);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid email or password");
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }

        //POST: api/Auth/logout
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var authResponse = await _authService.CancelTokenAsync(request);
                return Ok(authResponse);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Unauthorized Access Exception ");
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Auth/refresh-token
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var authResponse = await _authService.RefreshTokenAsync(request);
                return Ok(authResponse);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid or expired refresh token");
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
