using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace ToDoList_API.Models
{
    public class User
    {
        [Key]
        public Guid ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        [AllowNull]
        public string? ProfilePicture { get; set; }
        public List<ToDoList> ToDoLists { get; set; }
    }
}
