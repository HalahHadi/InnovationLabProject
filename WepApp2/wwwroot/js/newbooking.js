let userRequests = [];

document.addEventListener('DOMContentLoaded', function () {
    populateDeviceDropdowns();
    populateVisitTypes();
    loadConsultationMajors();
    loadTrainingCourses()

    // ✅ فورم حجز الجهاز
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            submitBookingRequest();
        });
    }
    // ✅ فورم إعارة جهاز
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        loanForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitLoanRequest();
        });
    }


    // ✅ فورم زيارة معمل
    const visitForm = document.getElementById('visitForm');
    if (visitForm) {
        visitForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitVisitRequest();
        });
    }

    // ✅ فورم الاستشارة 
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitConsultationRequest();
        });
    }


    // ✅ فورم الدورة التدريبية
    const trainingForm = document.getElementById('trainingForm');
    if (trainingForm) {
        trainingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitCourseRegistration();
        });
    }

    // ✅ تحقق من التواريخ
    setupDateValidation('loanStartDate', 'loanEndDate');


    preventPastDate('bookingDate');
    preventPastDate('consultationDate');
    preventPastDate('visitDate');


});



///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 🔽 تعبئة قائمة الأجهزة
function populateDeviceDropdowns() {
    const endpoints = {
        'deviceType': 'حجز أجهزة',
        'deviceRequired': 'إعارة'
    };

    Object.entries(endpoints).forEach(([elementId, serviceName]) => {
        const select = document.getElementById(elementId);
        if (!select) return;

        fetch(`/NewBooking/GetDevices?serviceName=${encodeURIComponent(serviceName)}`)
            .then(res => {
                if (!res.ok) throw new Error("HTTP error " + res.status);
                return res.json();
            })
            .then(devices => {
                select.innerHTML = '<option value="">اختر الجهاز</option>';
                devices.forEach(device => {
                    const option = new Option(device.deviceName, device.deviceId);
                    select.appendChild(option);
                });
            })
            .catch(err => console.error(`❌ خطأ في تحميل أجهزة ${serviceName}:`, err));
    });
}


// 🔽 تعبئة قائمة انواع الزيارة 
function populateVisitTypes() {
    fetch('/NewBooking/GetVisitTypes')
        .then(res => res.json())
        .then(types => {
            const select = document.getElementById('visitType');
            if (!select) return;

            select.innerHTML = '<option value="">اختر نوع الزيارة</option>';
            types.forEach(type => {
                const option = new Option(type.visitType, type.visitType);
                select.appendChild(option);
            });
        })
        .catch(err => console.error('❌ خطأ أثناء تحميل أنواع الزيارة:', err));
}


// 🔽 تعبئة قائمة انواع الخدمات للاستشارة
function loadConsultationMajors() {
    fetch('/NewBooking/GetConsultationMajors')
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById('serviceField');
            select.innerHTML = '<option value="">اختر مجال الخدمة</option>'; // إعادة ضبط

            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.consultationMajorId;
                option.textContent = item.major;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error("⚠️ فشل في تحميل التخصصات:", error);
        });
}


// 📌 تحميل الدورات عند فتح الصفحة
function loadTrainingCourses() {
    fetch('/NewBooking/GetCourses')
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById('trainingCourse');
            if (!select) return;

            data.forEach(course => {
                const option = document.createElement('option');
                option.value = course.courseId;
                option.textContent = course.courseName;
                option.dataset.description = course.courseDescription;
                option.dataset.presenter = course.presenterName;
                option.dataset.field = course.courseField;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('❌ خطأ في تحميل الدورات:', error);
        });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 🎯 عرض تفاصيل الدورة عند اختيارها
function showCourseDetails() {
    const select = document.getElementById('trainingCourse');
    const selectedOption = select.options[select.selectedIndex];

    const courseId = select.value;
    const name = selectedOption.textContent;
    const description = selectedOption.dataset.description;
    const presenter = selectedOption.dataset.presenter;
    const field = selectedOption.dataset.field;

    if (!courseId) {
        document.getElementById('courseDetails').style.display = 'none';
        return;
    }

    const container = document.getElementById('courseInfo');
    container.innerHTML = `
        <p><strong>📛 اسم الدورة:</strong> ${name}</p>
        <p><strong>📂 المجال:</strong> ${field}</p>
        <p><strong>🧾 الوصف:</strong> ${description}</p>
        <p><strong>👨‍🏫 مقدم الدورة:</strong> ${presenter}</p>
    `;
    document.getElementById('courseDetails').style.display = 'block';
}




// 📤 إرسال بيانات نموذج حجز الجهاز
function submitBookingRequest() {
    const data = {
        projectName: document.getElementById('projectName').value,
        projectDescription: document.getElementById('projectIdea').value,
        bookingDate: document.getElementById('bookingDate').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        deviceId: parseInt(document.getElementById('deviceType').value),
        filePath: '' // اختياري حالياً (يمكنك تعديله لاحقاً)
    };

    fetch('/NewBooking/CreateBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                document.getElementById('requestNumber').textContent = "REQ" + response.requestId;
                document.getElementById('requestType').textContent = response.requestType;
                document.getElementById('submissionDate').textContent = response.submissionDate;

                showPage('confirmation');
                showNotification(response.message, 'success');


                // 🔁 إعادة التوجيه بعد ثواني قليلة
                setTimeout(() => {
                    window.location.href = "/UserReservations";
                }, 1500); // ← ينتظر 1.5 ثانية عشان يشوف رسالة "تم الإرسال"


            } else {
                showNotification(response.message || 'حدث خطأ أثناء الإرسال', 'error');
            }
        })
        .catch(error => {
            console.error('❌ Fetch Error:', error);
            showNotification('⚠️ تعذر الاتصال بالخادم', 'error');
        });
}


// 🕐 وقت الحجز - تحقق من الزمن
document.getElementById('startTime').addEventListener('change', function () {
    const startTimeValue = convertTimeToMinutes(this.value);
    const endTimeSelect = document.getElementById('endTime');

    endTimeSelect.value = '';
    Array.from(endTimeSelect.options).forEach(option => {
        const endValue = convertTimeToMinutes(option.value);
        option.disabled = endValue <= startTimeValue;
    });
});

// تحويل الوقت الى دقائق
function convertTimeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + (minutes || 0);
}


// 📤 إرسال بيانات نموذج اعارة الجهاز

function submitLoanRequest() {
    const data = {
        purpose: document.getElementById('loanPurpose').value,
        startDate: document.getElementById('loanStartDate').value,
        endDate: document.getElementById('loanEndDate').value,
        preferredContactMethod: document.getElementById('contactMethod').value,
        deviceId: parseInt(document.getElementById('deviceRequired').value),
    };

    fetch('/NewBooking/CreateLoan', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                document.getElementById('requestNumber').textContent = "REQ" + response.requestId;
                document.getElementById('requestType').textContent = response.requestType;
                document.getElementById('submissionDate').textContent = response.submissionDate;

                showPage('confirmation');
                showNotification(response.message, 'success');


                // 🔁 إعادة التوجيه بعد ثواني قليلة
                setTimeout(() => {
                    window.location.href = "/UserReservations";
                }, 1500); // ← ينتظر 1.5 ثانية عشان يشوف رسالة "تم الإرسال"

            } else {
                showNotification(response.message || 'فشل في الإرسال', 'error');
            }
        })
        .catch(error => {
            console.error("❌ خطأ أثناء الإرسال:", error);
            showNotification('⚠️ تعذر الاتصال بالخادم', 'error');
        });
}


// 📤 إرسال بيانات نموذج زيارة معمل
function submitVisitRequest() {
    const data = {
        numberOfVisitors: parseInt(document.getElementById('visitorCount').value),
        visitDate: document.getElementById('visitDate').value,
        preferredTime: document.getElementById('visitTime').value,
        preferredContactMethod: document.getElementById('visitContactMethod').value,
        visitType: document.getElementById('visitType').value
    };

    fetch('/NewBooking/CreateLabVisit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                document.getElementById('requestNumber').textContent = "REQ" + response.requestId;
                document.getElementById('requestType').textContent = response.requestType;
                document.getElementById('submissionDate').textContent = response.submissionDate;


                showPage('confirmation');
                showNotification(response.message, 'success');


                // 🔁 إعادة التوجيه بعد ثواني قليلة
                setTimeout(() => {
                    window.location.href = "/UserReservations";
                }, 1500); // ← ينتظر 1.5 ثانية عشان يشوف رسالة "تم الإرسال"


            } else {
                console.error("🚨 Server Error:", response.error || "No error message");
                showNotification(response.message || 'حدث خطأ أثناء الإرسال', 'error');
            }
        })

}

// ✅ إرسال طلب استشارة
function submitConsultationRequest() {
    const data = {
        consultationMajorId: parseInt(document.getElementById('serviceField').value),
        consultationDescription: document.getElementById('needsDescription').value,
        consultationDate: document.getElementById('consultationDate').value,
        availableTimes: document.getElementById('availableTimes').value,
        preferredContactMethod: document.getElementById('consultationContactMethod').value
    };

    fetch('/NewBooking/CreateConsultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                document.getElementById('requestNumber').textContent = "REQ" + response.requestId;
                document.getElementById('requestType').textContent = response.requestType;
                document.getElementById('submissionDate').textContent = response.submissionDate;


                showPage('confirmation');
                showNotification(response.message, 'success');


                // 🔁 إعادة التوجيه بعد ثواني قليلة
                setTimeout(() => {
                    window.location.href = "/UserReservations";
                }, 1500); // ← ينتظر 1.5 ثانية عشان يشوف رسالة "تم الإرسال"


            } else {
                showNotification(response.message || 'فشل في إرسال الطلب', 'error');
            }
        })
        .catch(error => {
            console.error("❌ خطأ:", error);
            showNotification('تعذر الاتصال بالخادم', 'error');
        });
}


// ✅ إرسال طلب التسجيل في الدورة
function submitCourseRegistration() {
    const select = document.getElementById('trainingCourse');
    const courseId = parseInt(select.value);

    if (!courseId) {
        showNotification('يرجى اختيار دورة قبل التسجيل', 'error');
        return;
    }

    fetch('/NewBooking/RegisterForCourse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
    })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                document.getElementById('requestNumber').textContent = "REQ" + response.requestId;
                document.getElementById('requestType').textContent = response.requestType;
                document.getElementById('submissionDate').textContent = response.submissionDate;

                showPage('confirmation');
                showNotification(response.message, 'success');

                // 🔁 إعادة التوجيه بعد ثواني قليلة
                setTimeout(() => {
                    window.location.href = "/UserReservations";
                }, 1500); // ← ينتظر 1.5 ثانية عشان يشوف رسالة "تم الإرسال"



            } else {
                showNotification(response.message || 'فشل في التسجيل', 'error');
            }
        })
        .catch(error => {
            console.error('❌ خطأ في التسجيل:', error);
            showNotification('تعذر الاتصال بالخادم', 'error');
        });
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 🔄 الانتقال بين الصفحات
function showPage(pageId) {
    document.querySelectorAll('.main-content').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId + 'Page').classList.add('active');

    const titles = {
        'services': 'الخدمات المتميزة - معمل الابتكارات',
        'booking': 'حجز الأجهزة - معمل الابتكارات',
        'loan': 'إعارة الأجهزة - معمل الابتكارات',
        'consultation': 'الاستشارات التقنية - معمل الابتكارات',
        'visit': 'زيارة المعمل - معمل الابتكارات',
        'training': 'الدورات التدريبية - معمل الابتكارات',
        'confirmation': 'تأكيد الطلب - معمل الابتكارات'
    };
    document.title = titles[pageId] || 'معمل الابتكارات - جامعة الملك عبدالعزيز';
}

// 🛎️ إشعارات
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const notificationIcon = document.getElementById('notificationIcon');

    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };

    notificationText.textContent = message;
    notificationIcon.className = icons[type] || icons['info'];
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 4000);
}



// 🔁 دالة تحقق موحدة بين تاريخ البداية والنهاية
function setupDateValidation(startId, endId) {
    const startInput = document.getElementById(startId);
    const endInput = document.getElementById(endId);

    if (startInput && endInput) {
        startInput.addEventListener('change', function () {
            endInput.min = this.value;
            if (endInput.value && endInput.value <= this.value) {
                endInput.value = '';
            }
        });
    }
}

// ✅ منع اختيار تواريخ سابقة لليوم
function preventPastDate(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        const today = new Date().toISOString().split('T')[0];
        input.min = today;
    }
}







///////////////////////////////////////////////////////////////////////////////////////////////


// ما ادري وش سالفته 
function fetchAndDisplay(endpoint, containerId) {
    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById(containerId);
            container.innerHTML = data.length === 0
                ? "<p>لا توجد بيانات حالياً</p>"
                : "<ul>" + data.map(d => `<li>${Object.values(d).join(" | ")}</li>`).join("") + "</ul>";
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
