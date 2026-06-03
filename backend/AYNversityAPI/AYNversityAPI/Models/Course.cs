using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AYNversityAPI.Models
{
    public class Course
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Title { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string Instructor { get; set; } = null!;

        public decimal Price { get; set; }

        public string UserEmail { get; set; }
    }
}