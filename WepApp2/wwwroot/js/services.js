
// ================================
// Done By (Group2)
// ================================

// wwwroot/js/services.js

// ===== Success Notification =====

// دالة لعرض رسالة نجاح على شكل نافذة منبثقة
window.showSuccessMessage = function (message) {
    // تعيين نص الرسالة داخل العنصر المخصص لعرض الرسالة
    $('#successPopupMessage').text(message);

    // إظهار العناصر الخاصة بتعتيم الخلفية والنافذة المنبثقة
    $('#overlay, #modalOverlay, #successPopup').show();

    // عند النقر على زر "موافق"، يتم إخفاء النافذة وإعادة تحميل الصفحة
    $('#successPopupOk').one('click', function () {
        $('#overlay, #modalOverlay, #successPopup').hide();

        // إعادة تحميل الصفحة لتحديث البيانات بعد العملية الناجحة
        location.reload();
    });
};


//////////////////////////////////////////////////////////////////////////////////


// ===== Device Booking & Loan CRUD =====

// فتح نافذة إضافة جهاز (حجز أو إعارة)
window.openDeviceLoanForm = function (url) {
    // إرسال طلب GET للعنوان المحدد (Partial View)
    $.get(url, html => {

        // عرض النموذج داخل عنصر formContent
        $('#formContent').html(html);

        // إخفاء رسالة الخطأ (إن ظهرت من قبل)
        $('#deviceErrorMessage').hide();

        // إظهار النافذة المنبثقة وتعتيم الخلفية
        $('#overlay, #popupForm').show();
    });
};


// فتح نافذة حذف جهاز (حجز أو إعارة)
window.openDeviceLoanDelete = function (url) {
    // إرسال طلب GET للعنوان المحدد (نموذج الحذف)
    $.get(url, html => {

        // عرض النموذج داخل النافذة المنبثقة
        $('#formContent').html(html);

        // إظهار النافذة وتعتيم الخلفية
        $('#overlay, #popupForm').show();
    });
};


// إضافة جهاز للإعارة/الحجز مع عرض رسالة خطأ
window.submitDeviceLoanForm = function () {
    // تحديد النموذج
    var form = $('#addDeviceForm');

    // إخفاء رسالة الخطأ
    $('#deviceErrorMessage').hide();

    // تحقق من اختيار جهاز
    if (!form.find('[name="deviceId"]').val()) {
        $('#deviceErrorMessage').css('display', 'flex');
        return;
    }

    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        // تحويل البيانات إلى صيغة مناسبة للإرسال
        data: form.serialize(),
        dataType: 'json',
        success: function (res) {
            if (res.success) {

                // إغلاق النموذج وعرض رسالة نجاح

                closeDeviceLoanForm();
                showSuccessMessage("تمت العملية بنجاح.");
            } else {

                // في حال فشل العملية، يتم عرض النموذج مجددًا مع الأخطاء
                $('#formContent').html(res.html || "");
            }
        },
        error: function () {
            // في حال حدوث خطأ غير متوقع
            closeDeviceLoanForm();
            showSuccessMessage("حدث خطأ أثناء العملية.");
        }
    });
};


// حذف جهاز من الإعارة/الحجز
window.submitDeleteDeviceForm = function () {

    // النموذج الخاص بالحذف
    var form = $('#deleteDeviceForm');

    // إرسال الطلب لحذف الجهاز
    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function (res) {

            // إغلاق النموذج وعرض رسالة النجاح أو الخطأ حسب النتيجة
            closeDeviceLoanForm();
            showSuccessMessage(res.success
                ? "تمت العملية بنجاح."
                : res.message || "حدث خطأ أثناء الحذف.");
        },
        error: function () {

            // عرض رسالة خطأ عامة عند فشل الحذف
            closeDeviceLoanForm();
            showSuccessMessage("حدث خطأ أثناء الحذف.");
        }
    });
};


// دالة لإغلاق النوافذ المنبثقة الخاصة بالحجز أو الإعارة
window.closeDeviceLoanForm = function () {
    $('#popupForm, #overlay').hide();
};


//////////////////////////////////////////////////////////////////////////////////


// ===== Consultation Majors CRUD =====

// دالة لفتح نموذج الإضافة أو التعديل لتخصص استشارة
window.openConsultationMajorForm = function (url) {
    // جلب النموذج عبر GET وحقن الـ HTML داخل النافذة
    $.get(url, html => {

        // عرض النموذج داخل النافذة
        $('#formContent').html(html);

        // إخفاء رسائل الأخطاء
        $('#consultMajorError, #consultDescError').hide();

        // إظهار النافذة مع تعتيم الخلفية
        $('#overlay, #popupForm').show();
    });
};


// دالة لفتح نافذة تأكيد الحذف لتخصص استشارة
window.openConsultationMajorDelete = function (url) {

    // جلب نموذج الحذف عبر GET
    $.get(url, html => {

        // عرض النموذج داخل النافذة
        $('#formContent').html(html);

        // إخفاء رسائل الأخطاء
        $('#overlay, #popupForm').show();

        // ضبط الحدث عند إرسال النموذج داخل النافذة (تأكيد الحذف)
        $('#formContent form').off('submit').on('submit', function (e) {

            // منع الإرسال التقليدي للنموذج
            e.preventDefault();

            // تنفيذ الحذف
            submitConsultationMajorDelete();
        });
    });
};


//// دالة لإرسال نموذج الإضافة أو التعديل لتخصص استشارة

// دالة لإرسال طلب حذف تخصص استشارة
window.submitConsultationMajorDelete = function () {
    var form = $('#formContent form');

    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function (res) {
            closeConsultationMajorForm();

            if (res.success) {
                // عرض رسالة نجاح
                showSuccessMessage("تمت العملية بنجاح.");

                // إعادة تحميل الصفحة بعد ثانية واحدة لإزالة العنصر من الجدول
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                showSuccessMessage(res.message || "حدث خطأ أثناء الحذف.");
            }
        },
        error: function () {
            closeConsultationMajorForm();
            showSuccessMessage("حدث خطأ أثناء الحذف.");
        }
    });
};


window.submitConsultationMajorForm = function () {
    var form = $('#consultForm');

    // إخفاء الأخطاء السابقة إن وجدت
    $('#consultMajorError').hide();
    $('#consultDescError').hide();

    // التحقق من صحة الإدخال
    var major = form.find('#ConsultMajor').val().trim();
    var desc = form.find('#ConsultDesc').val().trim();
    var valid = true;

    if (!major) {
        $('#consultMajorError').css('display', 'flex');
        valid = false;
    }
    if (!desc) {
        $('#consultDescError').css('display', 'flex');
        valid = false;
    }
    if (!valid) return;

    // إرسال الطلب باستخدام AJAX
    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function (res) {
            if (res.success) {
                closeConsultationMajorForm();
                showSuccessMessage(res.message || "تمت العملية بنجاح.");

            } else {
                $('#formContent').html(res.html || "");
            }
        },
        error: function () {
            closeConsultationMajorForm();

            // عرض رسالة خطأ عامة
            showSuccessMessage("حدث خطأ أثناء العملية.");
        }
    });
};


// دالة لإغلاق نافذة تخصصات الاستشارة (إضافة/تعديل/حذف)
window.closeConsultationMajorForm = function () {
    // إخفاء النافذة وتعتيم الخلفية
    $('#popupForm, #overlay').hide();
};



// فتح نافذة الاستشارات المحذوفة (PartialView داخل popup)
function openDeletedMajorsWindow() {
    $.get('/ConsultationMajors/DeletedMajorsPartial', function (data) {
        $("#formContent").html(data);
        $("#popupForm").show();
        $("#overlay").show();
    });
}

// استرجاع استشارة من نافذة المحذوفة
function restoreConsultationMajorFromPopup(id) {
    $.post('/ConsultationMajors/Restore', { id: id }, function (result) {
        if (result.success) {
            openDeletedMajorsWindow();
            location.reload();
        } else {
            alert(result.message || 'تعذر الاسترجاع');
        }
    });
}


//////////////////////////////////////////////////////////////////////////////////


// ===== Visits Details CRUD =====

// دالة لفتح نموذج الإضافة أو التعديل لتفاصيل الزيارة
window.openVisitsDetailsForm = function (url) {
    // جلب النموذج عبر GET وحقن الـ HTML داخل النافذة
    $.get(url, html => {

        // عرض النموذج داخل النافذة
        $('#popupForm').html(html);

        // إخفاء رسالة الخطأ (إن وجدت)
        $('#visitErrorMessage').hide();

        // إظهار النافذة مع تعتيم الخلفية
        $('#overlay, #popupForm').show();
    });
};



// دالة لإغلاق نافذة نموذج تفاصيل الزيارة
window.closeVisitsDetailsForm = function () {

    // إخفاء النموذج وتعتيم الخلفية
    $('#popupForm, #overlay').hide();
};


// دالة لإرسال نموذج الإضافة أو التعديل لتفاصيل الزيارة
window.submitVisitsDetailsForm = function () {

    // تحديد النموذج داخل النافذة
    var form = $('#popupForm form');
    $('#visitErrorMessage').hide();

    var visitType = form.find('[name="VisitType"]').val().trim();

    // التحقق من تعبئة نوع الزيارة
    if (!visitType) {
        $('#visitErrorMessage').css('display', 'flex');
        return;
    }

    // إرسال النموذج باستخدام AJAX
    $.ajax({
        url: form.attr('action'),
        type: 'POST',

        // تحويل البيانات لصيغة مناسبة للإرسال
        data: form.serialize(),
        dataType: 'json',
        success: function (res) {
            if (res.success) {
                closeVisitsDetailsForm();
                showSuccessMessage("تمت العملية بنجاح.");
            } else {
                $('#popupForm').html(res.html || "");
            }
        },
        error: function () {
            closeVisitsDetailsForm();

            // عرض رسالة خطأ عامة
            showSuccessMessage("حدث خطأ أثناء العملية.");
        }
    });
};


// دالة لفتح نافذة تأكيد حذف تفاصيل زيارة
window.showDeleteVisitModal = function (id) {

    // جلب نموذج الحذف عبر ID
    $.get('/VisitsDetails/DeletePartial?id=' + id, html => {

        // عرض نموذج الحذف
        $('#deleteVisitModalContainer').html(html);
        $('#overlay').show();
    });
};


// دالة لإغلاق نافذة الحذف
window.closeDeleteVisitModal = function () {

    // إزالة محتوى النموذج
    $('#deleteVisitModalContainer').empty();
    $('#overlay').hide();
};


// دالة لإرسال نموذج حذف تفاصيل زيارة
window.submitDeleteVisitForm = function () {
    var form = $('#deleteVisitForm');

    // إرسال الطلب باستخدام AJAX
    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function (res) {
            closeDeleteVisitModal();
            showSuccessMessage(res.success
                ? "تمت العملية بنجاح."
                : res.message || "حدث خطأ أثناء الحذف.");
        },
        error: function () {
            closeDeleteVisitModal();
            showSuccessMessage("حدث خطأ أثناء الحذف.");
        }
    });
};


// إرسال نموذج حذف نوع زيارة (AJAX) - حذف منطقي
function submitDeleteVisitForm() {
    var form = $("#deleteVisitForm");
    $.post(form.attr("action"), form.serialize(), function (result) {
        if (result.success) {
            closeDeleteVisitModal();
            location.reload();
        } else {
            alert(result.message || 'فشل الحذف!');
        }
    });
}

// فتح نافذة أنواع الزيارات المحذوفة (PartialView داخل popup)
function openDeletedVisitsWindow() {
    $.get('/VisitsDetails/DeletedVisitsPartial', function (data) {
        $("#popupForm").html(data);
        $("#popupForm").show();
        $("#overlay").show();
    });
}

// استرجاع نوع زيارة من نافذة المحذوفة
function restoreVisitFromPopup(id) {
    $.post('/VisitsDetails/Restore', { id: id }, function (result) {
        if (result.success) {
            openDeletedVisitsWindow();
            location.reload();
        } else {
            alert(result.message || 'تعذر الاسترجاع');
        }
    });
}


//////////////////////////////////////////////////////////////////////////////////


// ===== Courses CRUD =====

// دالة لفتح نموذج إضافة/تعديل دورة تدريبية
window.openCoursesForm = function (url) {

    // تحميل النموذج داخل نافذة المنبثقة
    $.get(url, html => {
        $('#popupForm').html(html);
        $('#courseNameError, #courseFieldError, #courseDescriptionError, #coursePresenterError').hide();
        $('#modalOverlay, #popupForm').show();
    });
};


// دالة لإغلاق نموذج الدورة التدريبية (إضافة/تعديل)
window.closeCoursesForm = function () {

    // إخفاء النافذة وتعتيم الخلفية
    $('#modalOverlay, #popupForm').hide();
};


// دالة لفتح نافذة تأكيد حذف دورة
window.showDeleteCourseModal = function (url) {
    $.get(url, html => {

        // تحميل نموذج الحذف
        $('#deleteCourseModalContainer').html(html);
        $('#modalOverlay').show();
    });
};


// دالة لإغلاق نافذة تأكيد حذف الدورة
window.closeDeleteModal = function () {

    // إفراغ محتوى النافذة
    $('#deleteCourseModalContainer').empty();
    $('#modalOverlay').hide();
};


// دالة لإرسال نموذج الدورة (إضافة أو تعديل)
window.submitCoursesForm = function () {
    var container = $('#popupForm');
    var form = container.find('form#courseForm');

    // إخفاء رسائل الخطأ القديمة
    container.find('#courseNameError, #courseFieldError, #courseDescriptionError, #coursePresenterError').hide();

    // استخراج القيم من الحقول
    var name = form.find('#CourseName').val().trim(),
        field = form.find('#CourseField').val().trim(),
        description = form.find('#CourseDescription').val().trim(),
        presenter = form.find('#PresenterName').val().trim();

    // التحقق من تعبئة الحقول
    var valid = true;
    if (!name) { container.find('#courseNameError').css('display', 'flex'); valid = false; }
    if (!field) { container.find('#courseFieldError').css('display', 'flex'); valid = false; }
    if (!description) { container.find('#courseDescriptionError').css('display', 'flex'); valid = false; }
    if (!presenter) { container.find('#coursePresenterError').css('display', 'flex'); valid = false; }
    if (!valid) return;

    // إرسال البيانات عبر AJAX
    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function (res) {
            if (res.success) {
                closeCoursesForm();
                showSuccessMessage("تمت العملية بنجاح.");
            } else {

                // إعادة تحميل النموذج في حال وجود أخطاء في ModelState
                $('#popupForm').html(res.html || "");
            }
        },
        error: function () {
            closeCoursesForm();
            showSuccessMessage("حدث خطأ أثناء العملية.");
        }
    });
};


// دالة لإرسال نموذج حذف دورة
window.submitDeleteCourseForm = function () {
    var form = $('#deleteCourseForm');

    // إرسال الطلب باستخدام AJAX
    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function (res) {
            closeDeleteModal();
            showSuccessMessage(res.success
                ? "تمت العملية بنجاح."
                : res.message || "حدث خطأ أثناء الحذف.");
        },
        error: function () {
            closeDeleteModal();
            showSuccessMessage("حدث خطأ أثناء الحذف.");
        }
    });
};


// فتح نافذة الدورات المحذوفة (PartialView داخل popup)
function openDeletedCoursesWindow() {
    $.get('/Courses/DeletedCoursesPartial', function (data) {
        $("#popupForm").html(data);
        $("#popupForm").show();
        $("#modalOverlay").show();
    });
}

// استرجاع دورة من نافذة الدورات المحذوفة
function restoreCourseFromPopup(id) {
    $.post('/Courses/Restore', { id: id }, function (result) {
        if (result.success) {
            openDeletedCoursesWindow();
            location.reload();
        } else {
            alert(result.message || 'تعذر الاسترجاع');
        }
    });
}


//////////////////////////////////////////////////////////////////////////////////


// ===== Initialization =====
$(function () {
    console.log("services.js loaded");
});
