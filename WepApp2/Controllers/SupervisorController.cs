﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WepApp2.Data;
using WepApp2.Models;

namespace WepApp2.Controllers
{
    public class SupervisorController : Controller
    {
        private readonly InnvoationLabDbgroup2Context _context;

        public SupervisorController(InnvoationLabDbgroup2Context context)
        {
            _context = context;
        }

        public IActionResult IndexSuper()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int currentUserId))
            {
                return RedirectToAction("Login", "Auth");
            }

            var requests = _context.Requests
                .Include(r => r.User)
                .Include(r => r.Device)
                .Where(r => r.SupervisorAssigned == currentUserId)
                .ToList();

            return View(requests);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UpdateStatus([FromBody] UpdateStatusRequest request)
        {
            var req = _context.Requests.FirstOrDefault(r => r.RequestId == request.RequestId);
            if (req != null)
            {
                req.SupervisorStatus = request.Status;
                if (!string.IsNullOrEmpty(request.Notes))
                {
                    req.Notes = request.Notes;
                }
                _context.SaveChanges();
                return Json(new { success = true });
            }
            return Json(new { success = false });
        }

        [HttpGet]
        public IActionResult GetVisitType(int id)
        {
            var request = _context.Requests
                .Include(r => r.LabVisits)
                .ThenInclude(lv => lv.VisitDetails)
                .FirstOrDefault(r => r.RequestId == id);

            if (request == null || request.RequestType != "زيارة")
            {
                return Json(new { visitType = "غير متاح" });
            }

            var visitType = request.LabVisits.FirstOrDefault()?.VisitDetails?.VisitType ?? "غير متاح";
            return Json(new { visitType });
        }

        [HttpGet]
        public IActionResult GetCourseName(int id)
        {
            var request = _context.Requests.FirstOrDefault(r => r.RequestId == id);
            if (request == null || request.CourseId == null)
                return Json(new { courseName = "غير متاح" });

            var course = _context.Courses.FirstOrDefault(c => c.CourseId == request.CourseId);
            if (course != null)
            {
                return Json(new { courseName = course.CourseName });
            }

            return Json(new { courseName = "اسم الدورة غير متاح" });
        }

        [HttpGet]
        public IActionResult GetConsultationDescription(int id)
        {
            var consultation = _context.Consultations
                .Where(c => c.RequestId == id)
                .Select(c => new { consultationDescription = c.ConsultationDescription })
                .FirstOrDefault();

            return Json(consultation ?? new { consultationDescription = "غير متاح" });
        }

        [HttpGet]
        public IActionResult GetMyRequests()
        {
            var userId = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int currentUserId))
                return Unauthorized();

            var requests = _context.Requests
                .Where(r => r.SupervisorAssigned == currentUserId)
                .Select(r => new
                {
                    r.RequestId,
                    r.RequestType
                }).ToList();

            return Json(requests);
        }

        public class UpdateStatusRequest
        {
            public int RequestId { get; set; }
            public string Status { get; set; }
            public string? Notes { get; set; }
        }
    }
}