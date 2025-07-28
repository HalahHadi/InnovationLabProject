// ===========================================================
// الكنترولر: TechnologiesController
// الوظيفة: إدارة الفئات التقنية (إضافة، تعديل، حذف)
// Controller: TechnologiesController
// Purpose: Manage technology categories (Add, Edit, Delete)
// ===========================================================

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WepApp2.Data;
using WepApp2.Models;

namespace WepApp2.Controllers
{
    public class TechnologiesController : Controller
    {
        private readonly InnvoationLabDbgroup2Context _context;

        public TechnologiesController(InnvoationLabDbgroup2Context context)
        {
            _context = context;
        }

        // ============================
        // عرض الصفحة الرئيسية للفئات التقنية
        // Display technology management page (form + table)
        // ============================
        public IActionResult Index()
        {
            var viewModel = new TechnologyPageViewModel
            {
                Technologies = _context.Technologies.ToList(),
                Technology = new Technology(),
                IsEdit = false
            };

            return View("technology", viewModel);
        }



        // ============================
        // إضافة فئة تقنية جديدة (POST)
        // Handle POST request to create new technology
        // ============================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Technology technology)
        {
            if (!ModelState.IsValid)
            {
                var viewModel = new TechnologyPageViewModel
                {
                    Technologies = _context.Technologies.ToList(),
                    Technology = technology,
                    IsEdit = false
                };
                return View("technology", viewModel);
            }

            var exists = _context.Technologies
                .Any(t => t.TechnologyName.Trim().ToLower() == technology.TechnologyName.Trim().ToLower());

            if (exists)
            {
                ModelState.AddModelError("TechnologyName", "⚠️ هذا النوع موجود بالفعل.");

                var viewModel = new TechnologyPageViewModel
                {
                    Technologies = _context.Technologies.ToList(),
                    Technology = technology,
                    IsEdit = false
                };
                return View("technology", viewModel);
            }

            _context.Technologies.Add(technology);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }



        // ============================
        // تعبئة النموذج للتعديل
        // Populate form for editing a technology
        // ============================
        public IActionResult Edit(int id)
        {
            var tech = _context.Technologies
    .Where(t => t.TechnologyId == id)
    .Select(t => new Technology
    {
        TechnologyId = t.TechnologyId,
        TechnologyName = t.TechnologyName,
        TechnologyDescription = t.TechnologyDescription
    }).FirstOrDefault();

            if (tech == null)
                return NotFound();

            var viewModel = new TechnologyPageViewModel
            {
                Technologies = _context.Technologies.ToList(),
                Technology = tech,
                IsEdit = true
            };

            return View("technology", viewModel);
        }


        // ============================
        // حفظ التعديلات على الفئة التقنية
        // Save updated technology info
        // ============================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Update([Bind(Prefix = "Technology")] Technology updatedTech)

        {
            Console.WriteLine("🚨 REACHED UPDATE");
            Console.WriteLine("ID = " + updatedTech.TechnologyId);
            Console.WriteLine("Name = " + updatedTech.TechnologyName);

            if (!ModelState.IsValid)
            {
                var viewModel = new TechnologyPageViewModel
                {
                    Technologies = _context.Technologies.ToList(),
                    Technology = updatedTech,
                    IsEdit = true
                };
                return View("technology", viewModel);
            }

            var tech = _context.Technologies.Find(updatedTech.TechnologyId);
            if (tech == null)
                return NotFound();

            tech.TechnologyName = updatedTech.TechnologyName;
            tech.TechnologyDescription = updatedTech.TechnologyDescription;

            _context.SaveChanges();

            return RedirectToAction("Index");
        }


        // ============================
        // حذف فئة تقنية
        // Delete a technology by ID
        // ============================
        public IActionResult Delete(int id)
        {
            var tech = _context.Technologies.Find(id);
            if (tech == null)
                return NotFound();

            try
            {
                _context.Technologies.Remove(tech);
                _context.SaveChanges();

                TempData["Message"] = "✅ تم حذف الفئة بنجاح.";
            }
            catch (DbUpdateException ex)
            {
                // حدث خطأ بسبب وجود علاقات مع أجهزة مرتبطة
                TempData["Error"] = "❌ لا يمكن حذف الفئة لأنها مرتبطة بأجهزة موجودة في النظام.";
            }

            return RedirectToAction("Index");
        }

    }
}
