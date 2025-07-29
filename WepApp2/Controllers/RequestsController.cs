
// ================================
// Done By (Group2)
// ================================

using WepApp2.Models;
using WepApp2.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InnovationLabFinal.Controllers
{
    public class RequestsController : Controller
    {
        // وحدة تحكم لإدارة جميع العمليات المتعلقة بالطلبات في النظام
        private readonly InnvoationLabDbgroup2Context _context;

        // الحقل الخاص بسياق قاعدة البيانات (Entity Framework)
        public RequestsController(InnvoationLabDbgroup2Context context)
        {
            _context = context;
        }

        // ============================
        // عرض الصفحة الرئيسية لإدارة الطلبات
        // ============================
        public IActionResult Index()
        {
            return View();
        }

        // =======================================================================
        // جلب جميع المستخدمين الذين يحملون دور "مشرف" (يُستخدم في نافذة الإسناد)
        // =======================================================================
        [HttpGet]
        public async Task<IActionResult> GetSupervisors()
        {
            var supervisors = await _context.Users
                .Where(u => u.UserRole == "مشرف")
                .Select(u => new { id = u.UserId, name = u.FirstName + " " + u.LastName })
                .ToListAsync();
            return Json(supervisors);
        }

        // =========================================================================
        // إسناد مشرف إلى طلب معيّن وتحديث حالة الطلب إلى "بانتظار موافقة المشرف"
        // =========================================================================
        [HttpPost]
        public async Task<IActionResult> AssignSupervisor([FromBody] AssignSupervisorDto data)
        {
            var req = await _context.Requests.FindAsync(data.RequestId);
            if (req != null)
            {
                req.SupervisorAssigned = data.SupervisorId;
                req.SupervisorStatus = "بانتظار موافقة المشرف";
                await _context.SaveChangesAsync();
                return Ok();
            }
            return NotFound();
        }

        // =========================================================================
        // اعتماد القرار النهائي للطلب من قبل المسؤول (مقبول/مرفوض)،
        // مع حفظ ملاحظات القرار في خانة Notes
        // =========================================================================
        [HttpPost]
        public async Task<IActionResult> FinalDecision([FromBody] FinalDecisionDto data)
        {
            var req = await _context.Requests.FindAsync(data.requestId);
            if (req != null && req.SupervisorStatus == "موافق عليه من قبل المشرف")
            {
                if (data.decision == "مقبول")
                {
                    req.SupervisorStatus = "موافق عليه من قبل المسؤول";
                    req.AdminStatus = "موافق عليه من قبل المسؤول";
                }
                else if (data.decision == "مرفوض")
                {
                    req.SupervisorStatus = "مرفوض من قبل المسؤول";
                    req.AdminStatus = "مرفوض من قبل المسؤول";
                    req.SupervisorAssigned = null;
                }

                // هنا يتم تحديث الملاحظات مهما كان القرار
                req.Notes = data.notes; // تأكد أن اسم الحقل يطابق قاعدة البيانات

                await _context.SaveChangesAsync();
                return Ok();
            }
            return NotFound();
        }




        // ======== جلب بيانات الإعارة ========
        [HttpGet]
        public async Task<IActionResult> GetDeviceLoans()
        {
            var data = await _context.DeviceLoans
                .Include(dl => dl.Request).ThenInclude(r => r.User)
                .Include(dl => dl.Device)
                .Where(dl => dl.Request != null)
                .Select(dl => new
                {
                    id = dl.Request.RequestId,
                    deviceLoanId = dl.DeviceLoanId,
                    user = dl.Request != null && dl.Request.User != null
                        ? dl.Request.User.FirstName + " " + dl.Request.User.LastName
                        : "—",
                    device = dl.Device != null
                        ? dl.Device.DeviceName
                        : "لا يوجد",
                    startDate = dl.StartDate.ToString("yyyy-MM-dd"),
                    endDate = dl.EndDate.ToString("yyyy-MM-dd"),
                    purpose = dl.Purpose,
                    supervisor = dl.Request != null && dl.Request.SupervisorAssigned != null
                        ? _context.Users.Where(u => u.UserId == dl.Request.SupervisorAssigned)
                            .Select(u => u.FirstName + " " + u.LastName).FirstOrDefault()
                        : "لم يتم اسناده",
                    status = dl.Request != null
    ? dl.Request.SupervisorStatus
    : "—"

                })
                .ToListAsync();

            return Json(data);
        }

        // ======== جلب بيانات الاستشارات ========
        [HttpGet]
        public async Task<IActionResult> GetConsultations()
        {
            var data = await _context.Consultations
                .Include(c => c.Request).ThenInclude(r => r.User)
                .Include(c => c.ConsultationMajor)
                .Where(c => c.Request != null)
                .Select(c => new
                {
                    id = c.Request.RequestId,
                    consultationId = c.ConsultationId,
                    user = c.Request != null && c.Request.User != null
                        ? c.Request.User.FirstName + " " + c.Request.User.LastName
                        : "—",
                    date = c.Request != null
                        ? c.Request.RequestDate.ToString("yyyy-MM-dd")
                        : c.ConsultationDate.ToString("yyyy-MM-dd"),
                    consultationDescription = c.ConsultationDescription,
                    department = c.Request != null && c.Request.User != null
                        ? c.Request.User.Department
                        : "—",
                    major = c.ConsultationMajor != null
                        ? c.ConsultationMajor.Major
                        : "—",
                    supervisor = c.Request != null && c.Request.SupervisorAssigned != null
                        ? _context.Users.Where(u => u.UserId == c.Request.SupervisorAssigned)
                            .Select(u => u.FirstName + " " + u.LastName).FirstOrDefault()
                        : "لم يتم اسناده",
                    status = c.Request != null
                ? c.Request.SupervisorStatus
                : "—"
                })
                .ToListAsync();

            return Json(data);
        }

        // ======== جلب بيانات زيارات المعمل ========
        [HttpGet]
        public async Task<IActionResult> GetLabVisits()
        {
            var data = await _context.LabVisits
                .Include(lv => lv.Request).ThenInclude(r => r.User)
                .Include(lv => lv.Request).ThenInclude(r => r.Device)
                .Where(lv => lv.Request != null)
                .Select(lv => new
                {
                    id = lv.Request.RequestId,
                    labVisitId = lv.LabVisitId,
                    user = lv.Request != null && lv.Request.User != null
                        ? lv.Request.User.FirstName + " " + lv.Request.User.LastName
                        : "—",
                    date = lv.VisitDate.ToString("yyyy-MM-dd"),
                    time = lv.PreferredTime.ToString(@"hh\:mm"),
                    numberOfVisitors = lv.NumberOfVisitors,
                    additionalNotes = lv.AdditionalNotes,
                    supervisor = lv.Request != null && lv.Request.SupervisorAssigned != null
                        ? _context.Users.Where(u => u.UserId == lv.Request.SupervisorAssigned)
                            .Select(u => u.FirstName + " " + u.LastName).FirstOrDefault()
                        : "لم يتم اسناده",
                    status = lv.Request != null
                ? lv.Request.SupervisorStatus
                : "—"
                })
                .ToListAsync();

            return Json(data);
        }

        // ======== جلب بيانات الدورات التدريبية ========
        [HttpGet]
        public async Task<IActionResult> GetCourses()
        {
            var data = await _context.Courses
                .Include(c => c.Requests).ThenInclude(r => r.User)
                .Where(c => c.Requests.Any())
                .SelectMany(c => c.Requests.Select(r => new
                {
                    id = r.RequestId,
                    courseId = c.CourseId,
                    user = r.User != null
                        ? r.User.FirstName + " " + r.User.LastName
                        : "—",
                    courseName = c.CourseName,
                    courseField = c.CourseField,
                    presenterName = c.PresenterName,
                    courseDescription = c.CourseDescription,
                    supervisor = r.SupervisorAssigned != null
                        ? _context.Users.Where(u => u.UserId == r.SupervisorAssigned)
                            .Select(u => u.FirstName + " " + u.LastName).FirstOrDefault()
                        : "لم يتم اسناده",
                    status = r.SupervisorStatus
                }))
                .ToListAsync();

            return Json(data);
        }

        // ======== جلب بيانات حجز الأجهزة ========
        [HttpGet]
        public async Task<IActionResult> GetBookingDevices()
        {
            var data = await _context.BookingDevices
                .Include(bd => bd.Request).ThenInclude(r => r.User)
                .Include(bd => bd.Device)
                .Where(bd => bd.Request != null)
                .Select(bd => new
                {
                    id = bd.Request.RequestId,
                    bookingDeviceId = bd.BookingDeviceId,
                    user = bd.Request != null && bd.Request.User != null
                        ? bd.Request.User.FirstName + " " + bd.Request.User.LastName
                        : "—",
                    device = bd.Device != null
                        ? bd.Device.DeviceName
                        : "لا يوجد",
                    projectName = bd.ProjectName,
                    projectDescription = bd.ProjectDescription,
                    faculty = bd.Faculty,
                    department = bd.Department,
                    filePath = bd.FilePath,
                    date = bd.BookingDate.ToString("yyyy-MM-dd"),
                    stime = bd.StartTime.ToString(@"hh\:mm"),
                    etime = bd.EndTime.ToString(@"hh\:mm"),
                    supervisor = bd.Request != null && bd.Request.SupervisorAssigned != null
                        ? _context.Users.Where(u => u.UserId == bd.Request.SupervisorAssigned)
                            .Select(u => u.FirstName + " " + u.LastName).FirstOrDefault()
                        : "لم يتم اسناده",
                    status = bd.Request != null
                ? bd.Request.SupervisorStatus
                : "—"
                })
                .ToListAsync();

            return Json(data);
        }
    }
}
