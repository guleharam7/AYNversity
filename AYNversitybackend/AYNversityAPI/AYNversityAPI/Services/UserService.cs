using MongoDB.Driver;
using AYNversityAPI.Models;
using AYNversityAPI.Data;
using Microsoft.Extensions.Options;

namespace AYNversityAPI.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserService(IOptions<MongoDbSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);

            var mongoDatabase =
                mongoClient.GetDatabase(settings.Value.DatabaseName);

            _usersCollection =
                mongoDatabase.GetCollection<User>("Users");
        }

        public async Task<List<User>> GetAsync() =>
            await _usersCollection.Find(_ => true).ToListAsync();

        public async Task CreateAsync(User user) =>
            await _usersCollection.InsertOneAsync(user);
    }
}