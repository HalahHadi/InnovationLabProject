
// ================================
// Done By The Best Group (Group2)
// ================================

using WepApp2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// كنترولر خاص بإدارة تخصصات الاستشارات
namespace InnovationLabFinal.Controllers
{
    public class ConsultationMajorsController : Controller
    {
        // تعريف الـ DbContext للوصول لقاعدة البيانات
        private readonly InnvoationLabDbgroup2Context _context;

        // البناء: استقبال الـ DbContext من خلال الـ Dependency Injection
        public ConsultationMajorsController(InnvoationLabDbgroup2Context context)
        {
            _context = context;
        }

        // عرض قائمة جميع تخصصات الاستشارات
        //public async Task<IActionResult> Index()
        //{
        //    var majors = await _context.ConsultationMajors.ToListAsync();
        //    return View(majors); // إرسال القائمة للواجهة (View)
        //}

        public async Task<IActionResult> Index()
        {
            var major = await _context.ConsultationMajors
                .Where(x => !x.IsDeleted)
                .ToListAsync();
            return View(major);
        }

        // إظهار نموذج إضافة أو تعديل (Partial View)
        public IActionResult AddOrEdit(int id = 0)
        {
            if (id == 0)
                // إذا كان id=0 معناها إضافة تخصص جديد
                return PartialView("_FormPartial", new ConsultationMajor());
            else
            {
                // تعديل تخصص موجود: جلب بياناته من قاعدة البيانات وإرسالها للنموذج
                var major = _context.ConsultationMajors.Find(id);
                return PartialView("_FormPartial", major);
            }
        }

        // استقبال البيانات عند إضافة أو تعديل تخصص (Post)
        [HttpPost]
        public async Task<IActionResult> AddOrEdit(ConsultationMajor model)
        {
            if (ModelState.IsValid) // التحقق من صحة النموذج
            {
                if (model.ConsultationMajorId == 0) // إضافة جديدة
                {
                    _context.ConsultationMajors.Add(model);
                }
                else // تعديل سجل موجود
                {
                    _context.ConsultationMajors.Update(model);
                }
                await _context.SaveChangesAsync();
                return Json(new { success = true }); // إرسال نتيجة النجاح لجافاسكربت
            }
            // إذا كانت البيانات غير صحيحة
            return Json(new { success = false, message = "Invalid data" });
        }

        // عرض نافذة تأكيد الحذف (Partial View)
        [HttpGet]
        public IActionResult Delete(int id)
        {
            var consultation = _context.ConsultationMajors.Find(id);
            if (consultation == null)
                return NotFound();

            return PartialView("_DeletePartial", consultation); // إرسال بيانات العنصر للنافذة الجزئية
        }

        // تنفيذ عملية الحذف الفعلي (Post)
        //[HttpPost]
        //[ActionName("Delete")]
        //public async Task<IActionResult> DeleteConfirmed(int id)
        //{
        //    var major = await _context.ConsultationMajors.FindAsync(id);
        //    if (major != null)
        //    {
        //        _context.ConsultationMajors.Remove(major);
        //        await _context.SaveChangesAsync();
        //    }
        //    return Json(new { success = true }); // إرسال نتيجة النجاح بعد الحذف
        //}

        [HttpPost]
        [ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var major = await _context.ConsultationMajors.FindAsync(id);
            if (major != null)
            {
                major.IsDeleted = true;
                _context.ConsultationMajors.Update(major);
                await _context.SaveChangesAsync();
            }
            return Json(new { success = true });
        }

        // أكشن الاسترجاع
        [HttpPost]
        public async Task<IActionResult> Restore(int id)
        {
            var major = await _context.ConsultationMajors.FindAsync(id);
            if (major != null && major.IsDeleted)
            {
                major.IsDeleted = false;
                _context.ConsultationMajors.Update(major);
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            }
            return Json(new { success = false, message = "عنصر غير موجود أو غير محذوف!" });
        }

        // أكشن يعيد partial view للاستشارات المحذوفة
        [HttpGet]
        public IActionResult DeletedMajorsPartial()
        {
            var deletedMajors = _context.ConsultationMajors.Where(x => x.IsDeleted).ToList();
            return PartialView("_DeletedMajorsPartial", deletedMajors);
        }



    }
}
