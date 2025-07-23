//using kauWebsiteFourth.Data;
using WepApp2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace kauWebsiteFourth.Controllers
{
    public class NewBookingController : Controller
    {
        private readonly  ApplicationDbContext _context;

        public NewBookingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // عرض الصفحة الرئيسية
        public IActionResult NewBooking()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetDevices(string serviceName)
        {
            try
            {
                var service = _context.Services.FirstOrDefault(s => s.ServiceName == serviceName);

                if (service == null)
                    return Json(new { success = false, message = "الخدمة غير موجودة" });

                var devices = _context.ServiceDevices
                    .Where(sd => sd.ServiceId == service.ServiceId && !sd.Device.IsDeleted)
                    .Select(sd => new
                    {
                        sd.Device.DeviceId,
                        sd.Device.DeviceName
                    })
                    .ToList();

                return Json(devices);
            }
            catch (Exception ex)
            {
                return Content("System Error: " + ex.ToString());
            }
        }


        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequestDto dto)
        {
            try
            {
                var service = await _context.Services.FirstOrDefaultAsync(s => s.ServiceName == "حجز أجهزة");
                if (service == null)
                    return Json(new { success = false, message = "الخدمة غير موجودة" });

                int userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                if (user == null)
                    return Json(new { success = false, message = "المستخدم غير موجود" });

                // ✅ إنشاء الطلب
                var newRequest = new Request
                {
                    RequestType = "حجز أجهزة",
                    RequestDate = DateTime.Now,
                    UserId = userId,
                    ServiceId = service.ServiceId,
                    DeviceId = dto.DeviceId ?? 0,
                };

                _context.Requests.Add(newRequest);
                await _context.SaveChangesAsync();

                // ✅ إنشاء الحجز
                var booking = new BookingDevice
                {
                    ProjectName = dto.ProjectName,
                    ProjectDescription = dto.ProjectDescription,
                    Faculty = user.Faculty,
                    Department = user.Department,
                    FilePath = dto.FilePath ?? "",
                    BookingDate = DateOnly.Parse(dto.BookingDate),
                    StartTime = TimeOnly.Parse(dto.StartTime),
                    EndTime = TimeOnly.Parse(dto.EndTime),
                    DeviceId = dto.DeviceId,
                    ServiceId = service.ServiceId,
                    RequestId = newRequest.RequestId
                };

                _context.BookingDevices.Add(booking);
                await _context.SaveChangesAsync();

                return Json(new
                {
                    success = true,
                    message = "تم إرسال طلب الحجز بنجاح",
                    requestId = newRequest.RequestId,
                    requestType = "حجز أجهزة",
                    submissionDate = newRequest.RequestDate.ToString("yyyy-MM-dd HH:mm:ss")
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "حدث خطأ أثناء الحفظ", error = ex.Message });
            }
        }



        [HttpPost]
        public async Task<IActionResult> CreateLoan([FromBody] LoanRequestDto dto)
        {
            try
            {
                var service = await _context.Services.FirstOrDefaultAsync(s => s.ServiceName == "إعارة");
                if (service == null)
                    return Json(new { success = false, message = "الخدمة غير موجودة" });

                int userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");

                var newRequest = new Request
                {
                    RequestType = "إعارة",
                    RequestDate = DateTime.Now,
                    UserId = userId,
                    ServiceId = service.ServiceId,
                    DeviceId = dto.DeviceId ?? 0,

                };

                _context.Requests.Add(newRequest);
                await _context.SaveChangesAsync();

                var loan = new DeviceLoan
                {
                    Purpose = dto.Purpose,
                    StartDate = DateOnly.Parse(dto.StartDate),
                    EndDate = DateOnly.Parse(dto.EndDate),
                    PreferredContactMethod = dto.PreferredContactMethod,
                    DeviceId = dto.DeviceId,
                    ServiceId = service.ServiceId,
                    RequestId = newRequest.RequestId
                };

                _context.DeviceLoans.Add(loan);
                await _context.SaveChangesAsync();

                return Json(new
                {
                    success = true,
                    message = "تم إرسال طلب الإعارة بنجاح",
                    requestId = newRequest.RequestId,
                    requestType = "إعارة",
                    submissionDate = newRequest.RequestDate.ToString("yyyy-MM-dd HH:mm:ss")
                });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "حدث خطأ أثناء الإرسال", error = ex.Message });
            }
        }


        [HttpGet]
        public IActionResult GetVisitTypes()
        {
            try
            {
                var types = _context.VisitsDetails
                    .Where(v => !v.IsDeleted)
                    .Select(v => new { v.VisitDetailsId, v.VisitType })
                    .ToList();

                return Json(types);
            }
            catch (Exception ex)
            {
                return Content("❌ Error: " + ex.Message);
            }
        }


        [HttpPost]
        public async Task<IActionResult> CreateLabVisit([FromBody] VisitRequestDto dto)
        {
            try
            {
                // 🔍 جلب الخدمة من قاعدة البيانات
                var service = await _context.Services.FirstOrDefaultAsync(s => s.ServiceName == "زيارة");
                if (service == null)
                    return Json(new { success = false, message = "لم يتم العثور على الخدمة المطلوبة" });

                // ✅ جلب نوع الزيارة
                var visitDetail = await _context.VisitsDetails
                    .FirstOrDefaultAsync(v => v.VisitType == dto.VisitType && v.IsDeleted == false);

                if (visitDetail == null)
                    return Json(new { success = false, message = "نوع الزيارة غير صالح" });

                // 👤 المستخدم حاليا
                int userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");


                // ✅ إنشاء طلب جديد
                var request = new Request
                {
                    RequestType = "زيارة",
                    RequestDate = DateTime.Now,
                    UserId = userId,
                    ServiceId = service.ServiceId,


                };

                _context.Requests.Add(request);
                await _context.SaveChangesAsync();

                // ✅ إنشاء سجل زيارة المعمل
                var visit = new LabVisit
                {
                    NumberOfVisitors = dto.NumberOfVisitors,
                    VisitDate = DateTime.Parse(dto.VisitDate),
                    PreferredTime = TimeOnly.Parse(dto.PreferredTime),
                    PreferredContactMethod = dto.PreferredContactMethod,
                    VisitDetailsId = visitDetail.VisitDetailsId,
                    ServiceId = service.ServiceId,
                    RequestId = request.RequestId
                };

                _context.LabVisits.Add(visit);
                await _context.SaveChangesAsync();

                return Json(new
                {
                    success = true,
                    message = "تم إرسال طلب الزيارة بنجاح",
                    requestId = request.RequestId,
                    requestType = "زيارة",
                    submissionDate = request.RequestDate.ToString("yyyy-MM-dd HH:mm:ss")
                });



            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "حدث خطأ أثناء الحفظ", error = ex.Message, stack = ex.StackTrace });

            }
        }

        [HttpGet]
        public IActionResult GetConsultationMajors()
        {
            try
            {
                var majors = _context.ConsultationMajors
                    .Where(m => !m.IsDeleted)
                    .Select(m => new { m.ConsultationMajorId, m.Major })
                    .ToList();

                return Json(majors);
            }
            catch (Exception ex)
            {
                return Content("❌ Error: " + ex.Message);
            }
        }


        [HttpPost]
        public async Task<IActionResult> CreateConsultation([FromBody] ConsultationRequestDto dto)
        {
            try
            {
                // 🔍 جلب الخدمة
                var service = await _context.Services.FirstOrDefaultAsync(s => s.ServiceName == "استشارة");
                if (service == null)
                    return Json(new { success = false, message = "الخدمة غير موجودة" });

                // 🔍 التحقق من التخصص
                var major = await _context.ConsultationMajors
                    .FirstOrDefaultAsync(m => m.ConsultationMajorId == dto.ConsultationMajorId && !m.IsDeleted);

                if (major == null)
                    return Json(new { success = false, message = "التخصص غير موجود" });

                // 👤 المستخدم حاليا
                int userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");

                // ✅ إنشاء الطلب العام
                var request = new Request
                {
                    RequestType = "استشارة",
                    RequestDate = DateTime.Now,
                    UserId = userId,
                    ServiceId = service.ServiceId,
                };

                _context.Requests.Add(request);
                await _context.SaveChangesAsync();

                // ✅ إنشاء طلب الاستشارة
                var consultation = new Consultation
                {
                    ConsultationDescription = dto.ConsultationDescription,
                    ConsultationDate = DateOnly.Parse(dto.ConsultationDate),
                    AvailableTimes = TimeOnly.Parse(dto.AvailableTimes),
                    PreferredContactMethod = dto.PreferredContactMethod,
                    ConsultationMajorId = major.ConsultationMajorId,
                    ServiceId = service.ServiceId,
                    RequestId = request.RequestId
                };

                _context.Consultations.Add(consultation);
                await _context.SaveChangesAsync();

                return Json(new
                {
                    success = true,
                    message = "تم إرسال طلب الاستشارة بنجاح",
                    requestId = request.RequestId,
                    requestType = "استشارة",
                    submissionDate = request.RequestDate.ToString("yyyy-MM-dd HH:mm:ss")
                });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "حدث خطأ أثناء الحفظ", error = ex.Message });
            }
        }


        [HttpGet]
        public IActionResult GetCourses()
        {
            try
            {
                var courses = _context.Courses
                    .Where(c => !c.IsDeleted)
                    .Select(c => new
                    {
                        c.CourseId,
                        c.CourseName,
                        c.CourseField,
                        c.CourseDescription,
                        c.PresenterName
                    })
                    .ToList();

                return Json(courses);
            }
            catch (Exception ex)
            {
                return Content("❌ Error loading courses: " + ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> RegisterForCourse([FromBody] CourseRegistrationDto dto)
        {
            try
            {

                // 👤 المستخدم حاليا
                int userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");

                var course = await _context.Courses
                    .FirstOrDefaultAsync(c => c.CourseId == dto.CourseId && !c.IsDeleted);

                if (course == null)
                    return Json(new { success = false, message = "الدورة غير موجودة" });

                var service = await _context.Services
                    .FirstOrDefaultAsync(s => s.ServiceName == "دورات تدريبية");

                if (service == null)
                    return Json(new { success = false, message = "الخدمة غير موجودة" });

                var alreadyRegistered = await _context.Requests
                   .AnyAsync(r => r.UserId == userId && r.CourseId == course.CourseId && r.RequestType == "دورات تدريبية");

                if (alreadyRegistered)
                    return Json(new { success = false, message = "أنت مسجل مسبقًا في هذه الدورة" });


                var request = new Request
                {
                    RequestType = "دورات تدريبية",
                    RequestDate = DateTime.Now,
                    UserId = userId,
                    ServiceId = service.ServiceId,
                    CourseId = course.CourseId,

                };

                _context.Requests.Add(request);
                await _context.SaveChangesAsync();

                return Json(new
                {
                    success = true,
                    message = "تم تسجيلك في الدورة بنجاح",
                    requestId = request.RequestId,
                    requestType = "دورات تدريبية",
                    submissionDate = request.RequestDate.ToString("yyyy-MM-dd HH:mm:ss")
                });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "حدث خطأ أثناء التسجيل", error = ex.Message });
            }
        }






    }

    // 📦 DTO لحجز الجهاز
    public class BookingRequestDto
    {
        public string ProjectName { get; set; } = "";
        public string ProjectDescription { get; set; } = "";

        public string? FilePath { get; set; }
        public string BookingDate { get; set; } = "";
        public string StartTime { get; set; } = "";
        public string EndTime { get; set; } = "";
        public int? DeviceId { get; set; }
    }

    // 📦 DTO لإعارة الجهاز
    public class LoanRequestDto
    {
        public string Purpose { get; set; } = "";
        public string StartDate { get; set; } = "";
        public string EndDate { get; set; } = "";
        public string? PreferredContactMethod { get; set; }
        public int? DeviceId { get; set; }
    }




    // 📦 DTO لزيارة معمل 
    public class VisitRequestDto
    {
        public int NumberOfVisitors { get; set; }
        public string VisitDate { get; set; } = "";
        public string PreferredTime { get; set; } = "";
        public string PreferredContactMethod { get; set; } = "";
        public string VisitType { get; set; } = "";

        public int? DeviceId { get; set; }

    }


    // 📦 DTO للاستشارة
    public class ConsultationRequestDto
    {
        public int ConsultationMajorId { get; set; }
        public string ConsultationDescription { get; set; } = "";
        public string ConsultationDate { get; set; } = "";
        public string AvailableTimes { get; set; } = "";
        public string PreferredContactMethod { get; set; } = "";

    }


    public class CourseRegistrationDto
    {
        public int CourseId { get; set; }
    }



}

