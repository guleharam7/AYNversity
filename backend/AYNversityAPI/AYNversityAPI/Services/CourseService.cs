using MongoDB.Driver;
using AYNversityAPI.Models;
using AYNversityAPI.Data;
using Microsoft.Extensions.Options;

namespace AYNversityAPI.Services
{
    public class CourseService
    {
        private readonly IMongoCollection<Course> _coursesCollection;

        public CourseService(IOptions<MongoDbSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);

            var mongoDatabase =
                mongoClient.GetDatabase(settings.Value.DatabaseName);

            _coursesCollection =
                mongoDatabase.GetCollection<Course>("Courses");
        }

        public async Task<List<Course>> GetAllAsync()
        {
            return await _coursesCollection.Find(_ => true).ToListAsync();
        }

        public async Task<Course?> GetByIdAsync(string id)
        {
            return await _coursesCollection
                .Find(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Course course)
        {
            await _coursesCollection.InsertOneAsync(course);
        }

        public async Task UpdateAsync(string id, Course course)
        {
            await _coursesCollection.ReplaceOneAsync(x => x.Id == id, course);
        }

        public async Task DeleteAsync(string id)
        {
            await _coursesCollection.DeleteOneAsync(x => x.Id == id);
        }
    }
}