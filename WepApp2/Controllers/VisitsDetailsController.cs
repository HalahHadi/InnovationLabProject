
// ================================
// Done By (Group2)
// ================================

using Microsoft.AspNetCore.Mvc;
using WepApp2.Models;
using Microsoft.EntityFrameworkCore;

// كنترولر خاص بإدارة أنواع الزيارات داخل النظام
namespace InnovationLabFinal.Controllers
{
    public class VisitsDetailsController : Controller
    {
        // متغير للوصول إلى قاعدة البيانات
        private readonly InnvoationLabDbgroup2Context _context;

        // البناء: استلام الـ DbContext من خلال الـ Dependency Injection
        public VisitsDetailsController(InnvoationLabDbgroup2Context context)
        {
            _context = context;
        }

        // عرض جميع أنواع الزيارات (واجهة رئيسية)
        //public async Task<IActionResult> Index()
        //{
        //    var visits = await _context.VisitsDetails.ToListAsync(); // جلب جميع أنواع الزيارات من الداتابيس
        //    return View(visits); // إرسال القائمة للـ View
        //}

        public async Task<IActionResult> Index()
        {
            var visits = await _context.VisitsDetails
                .Where(x => !x.IsDeleted)
                .ToListAsync();
            return View(visits);
        }

        // عرض نموذج الإضافة أو التعديل (Partial View)
        public IActionResult AddOrEdit(int id = 0)
        {
            if (id == 0)
                // إضافة نوع زيارة جديد (نموذج فارغ)
                return PartialView("_VisitsDetailsForm", new VisitsDetail());
            else
            {
                // تعديل نوع زيارة: جلب بيانات العنصر من الداتابيس
                var visit = _context.VisitsDetails.Find(id);
                return PartialView("_VisitsDetailsForm", visit);
            }
        }

        // إضافة أو تعديل نوع زيارة (استقبال البيانات من النموذج باستخدام AJAX)
        [HttpPost]
        [ValidateAntiForgeryToken] // الحماية من CSRF
        public async Task<IActionResult> AddOrEdit(VisitsDetail model)
        {
            if (ModelState.IsValid) // التحقق من صحة النموذج
            {
                if (model.VisitDetailsId == 0)
                    _context.VisitsDetails.Add(model); // إضافة نوع جديد
                else
                    _context.VisitsDetails.Update(model); // تعديل نوع موجود

                await _context.SaveChangesAsync(); // حفظ التغييرات
                return Json(new { success = true }); // إرسال نتيجة النجاح للجافاسكريبت
            }
            // إذا البيانات غير صحيحة
            return Json(new { success = false, message = "بيانات غير صحيحة" });
        }

        // عرض نافذة تأكيد الحذف (Partial View)
        public IActionResult DeletePartial(int id)
        {
            var visit = _context.VisitsDetails.Find(id);
            if (visit == null)
                return Content("تعذر العثور على نوع الزيارة."); // إذا لم يوجد، يعرض رسالة خطأ
            return PartialView("_DeletePartial", visit); // إرسال بيانات النوع للنافذة الجزئية
        }

        // تنفيذ عملية الحذف الفعلي (استقبال من AJAX)
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Delete(int VisitDetailsId)
        //{
        //    var visit = await _context.VisitsDetails.FindAsync(VisitDetailsId);
        //    if (visit == null)
        //        return Json(new { success = false, message = "غير موجود" });

        //    _context.VisitsDetails.Remove(visit); // حذف نوع الزيارة
        //    await _context.SaveChangesAsync(); // حفظ التغييرات
        //    return Json(new { success = true }); // إرسال نجاح العملية
        //}

        // حذف منطقي (Soft Delete)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int VisitDetailsId)
        {
            var visit = await _context.VisitsDetails.FindAsync(VisitDetailsId);
            if (visit == null)
                return Json(new { success = false, message = "غير موجود" });

            visit.IsDeleted = true;
            _context.VisitsDetails.Update(visit);
            await _context.SaveChangesAsync();
            return Json(new { success = true });
        }

        // أكشن استرجاع الزيارة (Restore)
        [HttpPost]
        public async Task<IActionResult> Restore(int id)
        {
            var visit = await _context.VisitsDetails.FindAsync(id);
            if (visit != null && visit.IsDeleted)
            {
                visit.IsDeleted = false;
                _context.VisitsDetails.Update(visit);
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            }
            return Json(new { success = false, message = "العنصر غير موجود أو غير محذوف!" });
        }

        // أكشن يعرض نافذة الزيارات المحذوفة
        [HttpGet]
        public IActionResult DeletedVisitsPartial()
        {
            var deletedVisits = _context.VisitsDetails.Where(x => x.IsDeleted).ToList();
            return PartialView("_DeletedVisitsPartial", deletedVisits);
        }
    }
}
