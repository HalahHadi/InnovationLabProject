//using kauWebsiteFourth.Data;
using WepApp2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace kauWebsiteFourth.Controllers
{
    public class UserReservationsController : Controller
    {
        private readonly InnvoationLabDbgroup2Context _context;

        public UserReservationsController(InnvoationLabDbgroup2Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetReservations()
        {
            // 🔐 استرجاع UserId من الجلسة (من Claims)
            int userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");

            var requests = await _context.Requests
                .Where(r => r.UserId == userId)
                .Include(r => r.User)
                .Include(r => r.BookingDevices).ThenInclude(b => b.Device)
                .Include(r => r.Consultations).ThenInclude(c => c.ConsultationMajor)
                .Include(r => r.DeviceLoans).ThenInclude(d => d.Device)
                .Include(r => r.LabVisits).ThenInclude(l => l.VisitDetails)
                .Include(r => r.Course).ThenInclude(c => c.Service) // ✅ تعديل هنا
                .ToListAsync();

            // نحصل على أسماء المشرفين المرتبطين بكل طلب (إن وُجدوا)
            var supervisors = await _context.Users
                .Where(u => requests.Select(r => r.SupervisorAssigned).Contains(u.UserId))
                .ToDictionaryAsync(u => u.UserId);


            // ✅ دالة موحدة لاسترجاع بيانات الجهاز من جدول ServiceDevices
            Func<int?, dynamic> getDeviceInfo = (deviceId) =>
            {
                var device = _context.Devices
                    .Where(d => d.DeviceId == deviceId)
                    .Select(d => new
                    {
                        d.DeviceName,
                        d.DeviceLocation
                    })
                    .FirstOrDefault();

                return new
                {
                    Name = device?.DeviceName ?? "غير معروف",
                    Location = device?.DeviceLocation ?? "غير معروف"
                };
            };



            var result = requests.Select(r => new
            {
                RequestId = r.RequestId,
                RequestType = r.RequestType,
                Status = string.IsNullOrEmpty(r.AdminStatus) ? "قيد المراجعة" : r.AdminStatus,
                Supervisor = r.AdminStatus != null && r.AdminStatus.StartsWith("موافق") && r.SupervisorAssigned.HasValue
             && supervisors.ContainsKey(r.SupervisorAssigned.Value) ? $"{supervisors[r.SupervisorAssigned.Value].FirstName} " +
             $"{supervisors[r.SupervisorAssigned.Value].LastName}" : "غير محدد",

                RequestDate = r.RequestDate.ToString("yyyy-MM-dd"),
                RequestTime = r.RequestDate.ToString("HH:mm"),
                r.Notes,
                r.User?.FirstName,
                r.User?.LastName,
                r.User?.Email,
                r.User?.PhoneNumber,
                UserFaculty = r.User?.Faculty,
                UserDepartment = r.User?.Department,

                Booking = r.BookingDevices.Select(b =>
                {
                    var device = getDeviceInfo(b.DeviceId);
                    return new
                    {
                        b.ProjectName,
                        b.BookingDate,
                        b.StartTime,
                        b.EndTime,
                        b.ProjectDescription,
                        DeviceName = device.Name,
                        DeviceLocation = device.Location
                    };
                }),


                Consultation = r.Consultations.Select(c => new
                {
                    c.ConsultationDescription,
                    c.AvailableTimes,
                    c.PreferredContactMethod,
                    Major = c.ConsultationMajor?.Major,
                    RequestDate = c.ConsultationDate.ToString("yyyy-MM-dd")
                }),

                DeviceLoan = r.DeviceLoans.Select(d =>
                {
                    var device = getDeviceInfo(d.DeviceId);
                    return new
                    {
                        d.Purpose,
                        d.StartDate,
                        d.EndDate,
                        d.PreferredContactMethod,
                        DeviceName = device.Name,
                        DeviceLocation = device.Location
                    };
                }),


                LabVisit = r.LabVisits.Select(v => new
                {
                    v.NumberOfVisitors,
                    v.VisitDate,
                    v.PreferredTime,
                    v.PreferredContactMethod,
                    VisitType = v.VisitDetails?.VisitType
                }),

                Course = r.Course == null ? null : new
                {
                    r.Course.CourseName,
                    r.Course.PresenterName,
                    r.Course.CourseField,
                    r.Course.CourseDescription,
                    ServiceName = r.Course.Service?.ServiceName
                }

            });

            return Json(result.ToList(), new JsonSerializerOptions
            {
                PropertyNamingPolicy = null
            });
        }
    }
}
