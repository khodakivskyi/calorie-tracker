using backend.Models;
using backend.Repositories;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Services
{
    public class UserService
    {
        private readonly UserRepository _userRepository;

        public UserService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

       
    }
}
