using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using WepApp2.Data;
using WepApp2.Models;
using WepApp2.EmailService;

var builder = WebApplication.CreateBuilder(args);

// إعداد قاعدة البيانات
builder.Services.AddDbContext<InnvoationLabDbgroup2Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// خدمة البريد
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Auth/Login";
        options.AccessDeniedPath = "/Auth/AccessDenied";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.SlidingExpiration = false; // تم تعطيل SlidingExpiration للسماح بالتحكم الكامل في مدة الكوكيز
        // تم إزالة ExpireTimeSpan للسماح لـ AuthController بالتحكم الكامل في مدة الكوكيز
        // إضافة إعداد لضمان عمل ExpiresUtc بشكل صحيح
        options.Events = new CookieAuthenticationEvents
        {
            OnSigningIn = context =>
            {
                // التأكد من أن إعدادات الكوكيز تُطبق بشكل صحيح
                // فقط عندما تكون IsPersistent = true
                if (context.Properties.IsPersistent && context.Properties.ExpiresUtc.HasValue)
                {
                    context.CookieOptions.Expires = context.Properties.ExpiresUtc.Value;
                }
                // عندما تكون IsPersistent = false، لا نعين تاريخ انتهاء صلاحية (Session cookie)
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddControllersWithViews();

var app = builder.Build();

// الإعدادات العامة
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication(); // مهم جدًا
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
