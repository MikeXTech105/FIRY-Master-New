using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Domain.Entities
{
    public class Users
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; }
        public bool IsActive { get; set; }
    }
}
