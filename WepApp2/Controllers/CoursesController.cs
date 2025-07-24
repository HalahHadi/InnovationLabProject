using Microsoft.AspNetCore.Mvc;
using WepApp2.Models;
using Microsoft.EntityFrameworkCore;

// كنترولر خاص بإدارة الدورات التدريبية
namespace InnovationLabFinal.Controllers
{
    public class CoursesController : Controller
    {
        // متغير للوصول إلى قاعدة البيانات عبر DbContext
        private readonly InnvoationLabDbgroup2Context _context;

        // البناء: استلام الـ DbContext عن طريق الـ Dependency Injection
        public CoursesController(InnvoationLabDbgroup2Context context)
        {
            _context = context;
        }

        // عرض جميع الدورات التدريبية (واجهة رئيسية)
        //public async Task<IActionResult> Index()
        //{
        //    var courses = await _context.Courses.ToListAsync(); // جلب كل الدورات
        //    return View(courses); // إرسالها للـ View
        //}

        // عرض جميع الدورات النشطة فقط
        public async Task<IActionResult> Index()
        {
            var courses = await _context.Courses
                .Where(x => !x.IsDeleted)
                .ToListAsync();
            return View(courses);
        }

        // عرض نموذج الإضافة أو التعديل عبر Partial View
        public IActionResult AddOrEdit(int id = 0)
        {
            if (id == 0)
                // إضافة دورة جديدة (نموذج فارغ)
                return PartialView("_CourseFormPartial", new Course());
            else
            {
                // تعديل دورة: جلب بيانات الدورة من قاعدة البيانات
                var course = _context.Courses.Find(id);
                return PartialView("_CourseFormPartial", course);
            }
        }

        // استقبال البيانات عند إضافة أو تعديل دورة (POST)
        [HttpPost]
        [ValidateAntiForgeryToken] // حماية من هجمات CSRF
        public async Task<IActionResult> AddOrEdit(Course model)
        {
            if (ModelState.IsValid) // التحقق من صحة النموذج
            {
                if (model.CourseId == 0)
                    _context.Courses.Add(model); // إضافة دورة جديدة
                else
                    _context.Courses.Update(model); // تعديل دورة موجودة

                await _context.SaveChangesAsync(); // حفظ التغييرات في قاعدة البيانات
                return Json(new { success = true }); // إرسال نجاح العملية
            }
            // إذا فيه خطأ في البيانات
            return Json(new { success = false, message = "بيانات غير صحيحة" });
        }

        // عرض نافذة تأكيد الحذف عبر Partial View
        public IActionResult DeletePartial(int id)
        {
            var course = _context.Courses.Find(id);
            return PartialView("_CourseDeletePartial", course); // إرسال بيانات الدورة للنموذج الجزئي
        }

        // تنفيذ عملية الحذف (POST)
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Delete(int CourseId)
        //{
        //    var course = await _context.Courses.FindAsync(CourseId);
        //    if (course == null)
        //        // إذا لم يتم العثور على الدورة المطلوبة
        //        return Json(new { success = false, message = "غير موجود" });

        //    _context.Courses.Remove(course); // حذف الدورة
        //    await _context.SaveChangesAsync(); // حفظ التغييرات
        //    return Json(new { success = true }); // إرسال نجاح العملية
        //}

        // حذف منطقي (Soft Delete)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int CourseId)
        {
            var course = await _context.Courses.FindAsync(CourseId);
            if (course == null)
                return Json(new { success = false, message = "غير موجود" });

            course.IsDeleted = true;
            _context.Courses.Update(course);
            await _context.SaveChangesAsync();
            return Json(new { success = true });
        }

        // استرجاع دورة محذوفة
        [HttpPost]
        public async Task<IActionResult> Restore(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course != null && course.IsDeleted)
            {
                course.IsDeleted = false;
                _context.Courses.Update(course);
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            }
            return Json(new { success = false, message = "العنصر غير موجود أو غير محذوف!" });
        }

        // PartialView لعرض الدورات المحذوفة فقط
        [HttpGet]
        public IActionResult DeletedCoursesPartial()
        {
            var deletedCourses = _context.Courses.Where(x => x.IsDeleted).ToList();
            return PartialView("_DeletedCoursesPartial", deletedCourses);
        }



    }
}
