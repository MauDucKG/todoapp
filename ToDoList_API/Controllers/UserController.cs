using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ToDoList_API.Data;
using ToDoList_API.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly ToDoListApiDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public UserController(ToDoListApiDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }
    /*[HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetUsers()
    {
        return Ok(await _dbContext.Users.ToListAsync());
    }*/
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteUser([FromRoute] Guid id)
    {
        Guid trialid;
        string s = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid.TryParse(s, out trialid);
        if (id != trialid)
        {
            return Unauthorized("You can only delete your own account");
        }
        var user = await _dbContext.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("signup")]
    [AllowAnonymous]
    public async Task<IActionResult> SignUp([FromBody] UserSignUpRequest userRequest)
    {
        if (await _dbContext.Users.AnyAsync(u => u.Email == userRequest.Email))
        {
            return BadRequest("Email already in use");
        }
        User user = new User()
        {
            ID = Guid.NewGuid(),
            FirstName = userRequest.FirstName,
            LastName = userRequest.LastName,
            Email = userRequest.Email,
            Password = userRequest.Password,
        };
        (user.Password, user.Salt) = HashPassword(userRequest.Password);

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return Ok(new { Title = "User Registered Succesfully", Body = userRequest });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult Login([FromBody] UserLoginRequest userLogin)
    {
        var user = _dbContext.Users.SingleOrDefault(u => u.Email == userLogin.Email);

        if (user == null)
        {
            return Unauthorized("Invalid Email");
        }
        else if (!VerifyPassword(userLogin.Password, user.Password, user.Salt))
        {
            return Unauthorized("Invalid Password");
        }

        var (accessToken, refreshToken) = GenerateJwtTokens(user);
        return Ok(new { AccessToken = accessToken, RefreshToken = refreshToken });
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public IActionResult RefreshToken([FromBody] RefreshTokenRequest refreshTokenRequest)
    {
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidAudience = _configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]))
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(refreshTokenRequest.RefreshToken, validationParameters, out _);

        if (principal != null)
        {
            var user = _dbContext.Users.SingleOrDefault(u => u.ID == Guid.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)));
            var (accessToken, newRefreshToken) = GenerateJwtTokens(user);

            return Ok(new { AccessToken = accessToken, RefreshToken = newRefreshToken });
        }

        return Unauthorized("Invalid refresh token");
    }


    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok("Logout successful");
    }

    [HttpPost("update-profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UserUpdateRequest profileUpdate)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var user = await _dbContext.Users.FindAsync(userId);

        if (user == null)
        {
            return NotFound("User not found");
        }

        user.FirstName = profileUpdate.FirstName;
        user.LastName = profileUpdate.LastName;
        user.Email = profileUpdate.Email;
        (user.Password, user.Salt) = HashPassword(profileUpdate.Password);
        user.ProfilePicture= profileUpdate.ProfilePicture;
        await _dbContext.SaveChangesAsync();
        var newClaims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("ProfilePicture", user.ProfilePicture==null?"":user.ProfilePicture)
        };
        var newToken = GenerateJwtTokenWithClaims(user, newClaims);
        Response.Headers.Add("new-token", newToken);

        return Ok("Profile updated successfully");
    }

    private string GenerateJwtTokenWithClaims(User user, Claim[] claims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(1);

        var token = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: expires,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private (string AccessToken, string RefreshToken) GenerateJwtTokens(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("ProfilePicture", user.ProfilePicture==null?"":user.ProfilePicture)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(1);

        var accessToken = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: expires,
            signingCredentials: credentials
        );

        var accessTokenString = new JwtSecurityTokenHandler().WriteToken(accessToken);

        var refreshExpires = DateTime.UtcNow.AddDays(7);
        var refreshClaims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var refresh = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            refreshClaims,
            expires: refreshExpires,
            signingCredentials: credentials
        );

        var refreshString = new JwtSecurityTokenHandler().WriteToken(refresh);

        return (accessTokenString, refreshString);
    }

    private (string HashedPassword, string Salt) HashPassword(string password)
    {
        byte[] salt = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }
        string saltString = Convert.ToBase64String(salt);
        string saltedPassword = saltString + password;
        var hashAlgorithm = SHA256.Create();
        byte[] hashedPassword = hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
        string hashedPasswordString = Convert.ToBase64String(hashedPassword);

        return (hashedPasswordString, saltString);
    }

    private bool VerifyPassword(string password, string hashedPassword, string salt)
    {
        var hashAlgorithm = SHA256.Create();
        string saltedPassword = salt + password;
        byte[] newHashedPassword = hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
        string hashedPasswordString = Convert.ToBase64String(newHashedPassword);

        return hashedPasswordString == hashedPassword;
    }

}
