using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Domain.Entities
{
    public class EmailQueue
    {
        public int appId { get; set; }
        public string appFromEmail { get; set; }
        public string appPassword { get; set; }
        public string appToEmail { get; set; }
        public string appSubject { get; set; }
        public string appBody { get; set; }
        public string appFilePath { get; set; }
    }
}
