using System.Diagnostics.CodeAnalysis;

namespace ToDoList_API.Models
{
    public class UserUpdateRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        [AllowNull]
        public string? ProfilePicture { get; set; }
    }
}
