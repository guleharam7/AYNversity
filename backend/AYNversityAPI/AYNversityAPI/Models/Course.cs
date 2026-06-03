using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AYNversityAPI.Models
{
    public class Course
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string Category { get; set; } = "";

        public string? UserEmail { get; set; }
        public string? Instructor { get; set; }

        public List<string> EnrolledUsers { get; set; } = new();
    }
}