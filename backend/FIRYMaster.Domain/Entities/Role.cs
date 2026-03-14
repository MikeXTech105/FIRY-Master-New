using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Domain.Entities
{
    public class Role
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public bool IsActove { get; set; }
    }
}
