using Microsoft.AspNetCore.Mvc;

// كنترولر خاص بإدارة الخدمات الرئيسية في النظام
namespace InnovationLabFinal.Controllers
{
    public class ServicesController : Controller
    {
        // الصفحة الرئيسية لإدارة الخدمات
        public IActionResult Index()
        {
            return View();
        }

        // صفحة حجز الأجهزة
        public IActionResult BookingDevices()
        {
            return View("Index", "BookingDevices");
        }

        // صفحة إعارة الأجهزة
        public IActionResult DeviceLoan()
        {
            return View("Index", "DeviceLoan");
        }

        // الانتقال إلى صفحة إدارة تخصصات الاستشارات (تحويل للكنترولر الآخر)
        public IActionResult ConsultationMajors()
        {
            // إعادة توجيه إلى Index في ConsultationMajorsController
            return RedirectToAction("Index", "ConsultationMajors");
        }

        // الانتقال إلى صفحة تفاصيل الزيارات (تحويل للكنترولر الآخر)
        public IActionResult VisitsDetails()
        {
            // إعادة توجيه إلى Index في VisitsDetailsController
            return RedirectToAction("Index", "VisitsDetails");
        }

        // الانتقال إلى صفحة إدارة الدورات التدريبية (تحويل للكنترولر الآخر)
        public IActionResult Courses()
        {
            // إعادة توجيه إلى Index في CoursesController
            return RedirectToAction("Index", "Courses");
        }
    }
}
