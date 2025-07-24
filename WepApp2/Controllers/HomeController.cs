using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using WepApp2.Controllers;
using WepApp2.Models;


namespace WepApp2.Controllers
{
    public class HomeController : Controller
    {
        private readonly InnvoationLabDbgroup2Context _context;

        public HomeController(InnvoationLabDbgroup2Context context)
        {
            _context = context;
        }


        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult NewBooking()
        {
            return View();
        }

        public IActionResult Bookings()
        {
            return View();
        }

        public async Task<IActionResult> Devices()
        {
            var devices = await _context.Devices.ToListAsync();
            return View(devices);
        }

        public IActionResult FAQ()
        {
            return View();
        }

        public IActionResult Index()
        {
            // جلب الأجهزة وعلاقتها بالتقنيات
            var devices = _context.Devices
                .Include(d => d.Technology)
                .Where(d => !d.IsDeleted)
                .ToList();

            // الإحصائيات
            var totalDevices = _context.Devices.Count(d => !d.IsDeleted);
            var totalUsers = _context.Users.Count(u => !u.IsActive);
            var totalBookings = _context.BookingDevices.Count();
            var totalVisits = _context.LabVisits.Count();

            // تمرير الإحصائيات باستخدام ViewBag
            ViewBag.TotalDevices = totalDevices;
             ViewBag.TotalUsers = totalUsers;
            ViewBag.TotalBookings = totalBookings;
            ViewBag.TotalVisits = totalVisits;

            return View(devices);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
