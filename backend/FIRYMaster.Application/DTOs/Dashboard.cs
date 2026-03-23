using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.DTOs
{
    public class EmailSectionResponce
    {
        public int TotalEmailQueue { get; set; }
        public int TodayEmailQueue { get; set; }
        public int TodaySentEmail { get; set; }
        public int TodayFailedEmail { get; set; }
    }
}
