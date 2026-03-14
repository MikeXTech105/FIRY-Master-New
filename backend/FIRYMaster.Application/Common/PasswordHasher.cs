using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace FIRYMaster.Application.Common
{
    public static class PasswordHasher
    {
        public static string GenerateHash(string input)
        {
            using var sha256 = SHA256.Create();

            var bytes = Encoding.UTF8.GetBytes(input);

            var hash = sha256.ComputeHash(bytes);

            return Convert.ToHexString(hash);
        }
        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public static bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}
