using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;

namespace ToDoList_API.Models
{
    [Owned]
    public class EstimatedTime
    {
        public int Days { get; set; }
        public int Hours { get; set; }
    }

    public class CustomTimeSpanConverter : Newtonsoft.Json.JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(EstimatedTime);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer)
        {
            JObject jObject = JObject.Load(reader);
            return new EstimatedTime
            {
                Days = (int)jObject["days"],
                Hours = (int)jObject["hours"]
            };
        }

        public override void WriteJson(JsonWriter writer, object value, Newtonsoft.Json.JsonSerializer serializer)
        {
            var estimatedTime = (EstimatedTime)value;
            var jObject = new JObject
        {
            { "days", estimatedTime.Days },
            { "hours", estimatedTime.Hours }
        };
            jObject.WriteTo(writer);
        }
    }

    public enum Status
    {
        ToDo,
        Doing,
        Done
    }

    public enum Priority
    {
        High,
        Medium,
        Low
    }
    public class ToDoList
    {

        [Key]
        public Guid ID { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime DueDate { get; set; }
        [Range(0, 2)]
        public Status Status { get; set; }
        [Newtonsoft.Json.JsonConverter(typeof(CustomTimeSpanConverter))]
        public EstimatedTime EstimatedTime { get; set; }
        [Range(0, 2)]
        public Priority? Priority { get; set; }
        public Guid UserID { get; set; }
        public User User { get; set; }
    }
}
