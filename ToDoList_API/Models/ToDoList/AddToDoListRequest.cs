using System.ComponentModel.DataAnnotations;

namespace ToDoList_API.Models
{
    public class AddToDoListRequest
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Category { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        [Range(0, 2, ErrorMessage = "The priority should be between 0 and 2")]
        [Required]
        public Status Status { get; set; }
        [Newtonsoft.Json.JsonConverter(typeof(CustomTimeSpanConverter))]
        [Required]
        public EstimatedTime EstimatedTime { get; set; }
        [Range(0, 2, ErrorMessage = "The priority should be between 0 and 2")]
        public Priority? Priority { get; set; }
    }
}
