using ELearningAPI.DTOs;

namespace ELearningAPI.Services
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<LoginResponse> RegisterAsync(RegisterRequest request);
        Task<RefreshTokenResponse> RefreshTokenAsync(string refreshToken);
        string GenerateJwtToken(UserDto user);
        string GenerateRefreshToken();
        bool ValidateRefreshToken(string refreshToken);
    }
} 