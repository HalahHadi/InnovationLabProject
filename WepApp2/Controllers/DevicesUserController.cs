
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using WepApp2.Data;
using WepApp2.Data;
using WepApp2.Models;

public class DeviceController : Controller
{
    private readonly ApplicationDbContext _context;

    public DeviceController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public JsonResult GetDevicesByCategory(int category)
    {
        var devices = _context.Devices
            .Where(d => d.TechnologyId == category)
            .Select(d => new
            {
                id = d.DeviceId,
                name = d.DeviceName,
                specs = d.DeviceModel,
                status = d.DeviceStatus,
                type = d.TechnologyId
            })
            .ToList();

        return Json(devices);
    }



    // 🟢 أكشن يرجع قائمة التقنيات من جدول Technologies على شكل JSON
    [HttpGet]
    public async Task<IActionResult> GetTechnologies()
    {
        // جلب البيانات من قاعدة البيانات
        var technologies = await _context.Technologies
            .Select(t => new
            {
                t.TechnologyId,
                t.TechnologyName,
                t.TechnologyDescription
            })
            .ToListAsync();

        // إرجاع البيانات كـ JSON
        return Json(technologies);
    }


}
