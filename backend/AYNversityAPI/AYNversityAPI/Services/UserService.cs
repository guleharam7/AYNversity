using MongoDB.Driver;
using AYNversityAPI.Models;
using AYNversityAPI.Data;
using Microsoft.Extensions.Options;

namespace AYNversityAPI.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserService(IMongoClient mongoClient, IOptions<MongoDbSettings> settings)
        {
            var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _usersCollection = database.GetCollection<User>("Users");

            var indexKeys = Builders<User>.IndexKeys.Ascending(u => u.Email);
            _usersCollection.Indexes.CreateOne(
                new CreateIndexModel<User>(indexKeys)
            );
        }

        // ---------------- GET ALL ----------------
        public async Task<List<User>> GetAllAsync()
        {
            return await _usersCollection.Find(_ => true).ToListAsync();
        }

        // ---------------- GET BY ID ----------------
        public async Task<User?> GetByIdAsync(string id)
        {
            return await _usersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        // ---------------- GET BY EMAIL ----------------
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _usersCollection.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        // ---------------- CREATE ----------------
        public async Task CreateAsync(User user)
        {
            await _usersCollection.InsertOneAsync(user);
        }

        // ---------------- UPDATE ----------------
        public async Task UpdateAsync(string id, User user)
        {
            await _usersCollection.ReplaceOneAsync(x => x.Id == id, user);
        }

        // ---------------- DELETE ----------------
        public async Task DeleteAsync(string id)
        {
            await _usersCollection.DeleteOneAsync(x => x.Id == id);
        }
    }
}