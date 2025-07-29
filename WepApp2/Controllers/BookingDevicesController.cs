
// ================================
// Done By The Best Group (Group2)
// ================================

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using WepApp2.Models;

namespace InnovationLabFinal.Controllers
{
    public class BookingDevicesController : Controller
    {
        private readonly InnvoationLabDbgroup2Context _context;

        public BookingDevicesController(InnvoationLabDbgroup2Context context)
        {
            _context = context;
        }

        // GET: عرض الأجهزة المرتبطة بخدمة حجز الأجهزة
        public async Task<IActionResult> Index(int serviceId)
        {
            ViewBag.ServiceId = serviceId;

            var assigned = await _context.ServiceDevices
                .Include(sd => sd.Device) // يتطلب خاصية ملاحة 'Device' في موديل ServiceDevice للوصول إلى تفاصيل الجهاز
                .Where(sd => sd.ServiceId == serviceId)
                .Select(sd => sd.Device!)
                .ToListAsync();

            return View(assigned);
        }

        // GET: Partial View لإضافة جهاز
        [HttpGet]
        public IActionResult AddDevicePartial(int serviceId)
        {
            ViewBag.ServiceId = serviceId; // تمرير serviceId إلى ViewBag

            // جلب الأجهزة المتاحة بناءً على الشروط التالية:
            // 1. ليست محذوفة (IsDeleted = false)
            // 2. حالتها "متاح" (DeviceStatus == "متاح")
            // 3. ليست معينة بالفعل لهذه الخدمة (ServiceId المحدد)
            var availableDevices = _context.Devices
                .Where(d => !d.IsDeleted
                            && d.DeviceStatus == "متاح"
                            && !_context.ServiceDevices.Any(sd => sd.ServiceId == serviceId && sd.DeviceId == d.DeviceId))
                .ToList();

            // تمرير الأجهزة المتاحة إلى ViewBag كـ SelectList
            ViewBag.AvailableDevices = new SelectList(availableDevices, "DeviceId", "DeviceName");

            // لا نمرر موديل هنا لأن النموذج في View سيستخدم ViewBag مباشرة
            return PartialView("_AddDevicePartial");
        }

        // GET: Partial View لتأكيد الحذف
        [HttpGet]
        public IActionResult DeletePartial(int serviceId, int deviceId)
        {
            ViewBag.ServiceId = serviceId; // تمرير serviceId إلى ViewBag
            ViewBag.DeviceId = deviceId;   // تمرير deviceId إلى ViewBag

            var dev = _context.Devices.Find(deviceId);
            ViewBag.DeviceName = dev?.DeviceName; // جلب اسم الجهاز للعرض في رسالة التأكيد

            // لا نمرر موديل هنا لأن النموذج في View سيستخدم ViewBag مباشرة
            return PartialView("_DeletePartial");
        }

        // POST: إضافة جهاز للحجز (يستقبل serviceId و deviceId مباشرة)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddDeviceToService(int serviceId, int deviceId)
        {
            // التحقق من صحة البيانات يدوياً
            // نتحقق إذا كان DeviceId غير صفري (أو أي قيمة افتراضية قد تنتج عن عدم الاختيار)
            if (deviceId <= 0) // غالباً 0 يعني لم يتم اختيار قيمة صالحة
            {
                // إذا لم يتم اختيار جهاز صالح، نعيد الـ Partial View مع رسائل الخطأ
                ModelState.AddModelError("DeviceId", "الرجاء اختيار جهاز صالح.");

                // يجب إعادة جلب AvailableDevices و ServiceId لأننا سنعيد عرض PartialView
                ViewBag.ServiceId = serviceId;
                var availableDevices = _context.Devices
                    .Where(d => !d.IsDeleted
                                && d.DeviceStatus == "متاح"
                                && !_context.ServiceDevices.Any(sd => sd.ServiceId == serviceId && sd.DeviceId == d.DeviceId))
                    .ToList();
                ViewBag.AvailableDevices = new SelectList(availableDevices, "DeviceId", "DeviceName");

                return PartialView("_AddDevicePartial");
            }

            // التحقق مما إذا كان الجهاز غير مرتبط بالفعل بهذه الخدمة لمنع التكرار
            if (!await _context.ServiceDevices
                    .AnyAsync(sd => sd.ServiceId == serviceId && sd.DeviceId == deviceId))
            {
                _context.ServiceDevices.Add(new ServiceDevice { ServiceId = serviceId, DeviceId = deviceId }); // إضافة كائن ServiceDevice إلى قاعدة البيانات
                await _context.SaveChangesAsync();
                return Json(new { success = true }); // استجابة JSON مبسطة كالكنترولر الآخر
            }
            // إذا كان الجهاز مضافاً بالفعل، نرجع نجاح مع رسالة، حيث لا يعتبر هذا خطأ برمجيًا
            return Json(new { success = true, message = "الجهاز مضاف بالفعل لهذه الخدمة." });
        }

        // POST: حذف جهاز من الحجز (يستقبل serviceId و deviceId مباشرة)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteDeviceFromService(int serviceId, int deviceId)
        {
            // البحث عن رابط الجهاز والخدمة في جدول ServiceDevices
            var link = await _context.ServiceDevices
                .FirstOrDefaultAsync(sd => sd.ServiceId == serviceId && sd.DeviceId == deviceId);

            if (link != null)
            {
                _context.ServiceDevices.Remove(link); // حذف العلاقة
                await _context.SaveChangesAsync();
                return Json(new { success = true }); // استجابة JSON مبسطة كالكنترولر الآخر
            }
            // إذا كان الرابط غير موجود، نرجع نجاح مع رسالة، حيث لا يعتبر هذا خطأ برمجيًا
            return Json(new { success = true, message = "الجهاز غير موجود في هذه الخدمة." });
        }
    }
}