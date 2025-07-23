let currentFilter = 'all';
let currentReservations = [];

document.addEventListener('DOMContentLoaded', function () {
    fetchReservations();
    setupEventListeners();
});

function fetchReservations() {
    fetch('/UserReservations/GetReservations')
        .then(response => response.json())
        .then(data => {
            currentReservations = data;
            initializePage();
        })
        .catch(error => console.error("خطأ في تحميل البيانات:", error));
}

function initializePage() {
    updateStatistics();
    renderReservations();
}

function setupEventListeners() {
    document.getElementById('statusFilter').addEventListener('change', handleFilterChange);
}

function handleFilterChange(event) {
    currentFilter = event.target.value;
    renderReservations();
    updateStatistics();
}

function getFilteredReservations() {
    if (currentFilter === 'all') return currentReservations;
    return currentReservations.filter(r => getStatusCategory(r.Status) === currentFilter);
}

function updateStatistics() {
    const stats = calculateStatistics(getFilteredReservations());
    document.querySelector('.stats-card.rejected .stats-number').textContent = stats.rejected;
    document.querySelector('.stats-card.accepted .stats-number').textContent = stats.accepted;
    document.querySelector('.stats-card.pending .stats-number').textContent = stats.pending;
    document.querySelector('.stats-card.total .stats-number').textContent = stats.total;
}

function calculateStatistics(reservations) {
    return {
        rejected: reservations.filter(r => getStatusCategory(r.Status) === 'مرفوض').length,
        accepted: reservations.filter(r => getStatusCategory(r.Status) === 'موافق عليه').length,
        pending: reservations.filter(r => getStatusCategory(r.Status) === 'قيد المراجعة').length,
        total: reservations.length
    };
}

// 🔍 ترجع التصنيف الأساسي للحالة من جملة طويلة
function getStatusCategory(fullStatus) {
    if (!fullStatus) return 'قيد المراجعة';
    if (fullStatus.startsWith('موافق')) return 'موافق عليه';
    if (fullStatus.startsWith('مرفوض')) return 'مرفوض';
    return 'قيد المراجعة';
}



function renderReservations() {
    const reservations = getFilteredReservations().slice().reverse(); 
    const container = document.getElementById('reservationsList');
    const emptyMessage = document.getElementById('noReservationsMessage');

    if (reservations.length === 0) {
        container.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';
    container.innerHTML = reservations.map(createReservationCard).join('');

    document.querySelectorAll('.reservation-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.1}s`;
        card.classList.add('fade-in');
    });
}

function createReservationCard(reservation) {
    const statusClass = getStatusClass(reservation.Status);
    const statusIcon = getStatusIcon(reservation.Status);

    const supervisorInfo = reservation.Status.startsWith("موافق") ?  `
        <div class="detail-item">
            <i class="fas fa-user-tie detail-icon"></i>
            <div class="detail-content">
                <p class="detail-label">المشرف المسند</p>
                <p class="detail-value"> ${reservation.Supervisor}</p>
            </div>
        </div>` : "";

    return `
        <div class="reservation-card">
            <div class="reservation-header">
                <div class="reservation-type">
                    <i class="fas fa-calendar-check"></i>
                    ${reservation.RequestType}
                </div>
                <div class="reservation-id">  رقم الطلب : ${reservation.RequestId}</div>
            </div>

            <div class="reservation-body">
                <div class="reservation-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar detail-icon"></i>
                        <div class="detail-content">
                            <p class="detail-label">تاريخ إرسال الطلب </p>
                            <p class="detail-value">${formatDate(reservation.RequestDate)}</p>
                        </div>
                    </div>

                   <div class="detail-item">
                        <i class="fas fa-clock detail-icon"></i>
                        <div class="detail-content">
                            <p class="detail-label">وقت إرسال الطلب</p>
                            <p class="detail-value">${reservation.RequestTime}</p>
                        </div>
                    </div>

                    ${supervisorInfo}
                </div>

             ${(reservation.Status.startsWith('مرفوض') ||
            (reservation.Status.startsWith('موافق') && reservation.RequestType === 'دورات تدريبية'))
            ? `
      <div class="purpose-section">
          <div class="purpose-label">
              <i class="fas fa-clipboard-list detail-icon"></i>
              ملاحظات 
          </div>
          <div class="purpose-text">${reservation.Notes || 'لا توجد ملاحظات'}</div>
      </div>`
            : ''
}




                <div class="reservation-footer">
                    <span class="status-badge ${statusClass}">
                        <i class="${statusIcon}"></i>
                        ${reservation.Status}
                    </span>
                    <button class="btn btn-details" onclick="showReservationDetails(${reservation.RequestId})">
                        <i class="fas fa-eye"></i> عرض التفاصيل
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getStatusClass(status) {
    if (!status) return 'status-pending';
    if (status.startsWith('موافق عليه')) return 'status-accepted';
    if (status.startsWith('مرفوض')) return 'status-rejected';
    return 'status-pending';
}

function getStatusIcon(status) {
    if (!status) return 'fas fa-clock';
    if (status.startsWith('موافق عليه')) return 'fas fa-check-circle';
    if (status.startsWith('مرفوض')) return 'fas fa-times-circle';
    return 'fas fa-clock';
}



function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}

window.showReservationDetails = function (id) {
    const reservation = currentReservations.find(r => r.RequestId === id);
    if (!reservation) return;
    const modalBody = document.getElementById('modalBody');
    const statusClass = getStatusClass(reservation.Status);
    const statusIcon = getStatusIcon(reservation.Status);

    let reservationInfoHTML = '';
    switch (reservation.RequestType) {

        case "استشارة":
            const c = reservation.Consultation?.[0] || {};
            reservationInfoHTML = `
                <div class="detail-item mb-3"><i class="fas fa-folder-open detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">نوع الخدمة </p>
                    <p class="detail-value">${reservation.RequestType || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-toolbox detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">مجال الخدمة </p>
                    <p class="detail-value">${c.Major || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-comment-dots detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">وصف الاستشارة</p>
                    <p class="detail-value">${c.ConsultationDescription || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-calendar detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">موعد الحجز </p>
                    <p class="detail-value">${c.ConsultationDate || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-clock detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">المدة المتاحة</p>
                    <p class="detail-value">${c.AvailableTimes || "غير محدد"}</p></div>
                </div>`;
            break;

        case "حجز أجهزة":
            const b = reservation.Booking?.[0] || {};
            reservationInfoHTML = `

                <div class="detail-item mb-3"><i class="fas fa-folder-open detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">نوع الخدمة </p>
                    <p class="detail-value">${reservation.RequestType || "غير محدد"}</p></div>
                </div>


                <div class="detail-item mb-3"><i class="fas fa-tag detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">اسم المشروع</p>
                    <p class="detail-value">${b.ProjectName || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-project-diagram detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">وصف المشروع</p>
                    <p class="detail-value">${b.ProjectDescription || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-microchip detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">اسم الجهاز </p>
                    <p class="detail-value">${b.DeviceName || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-info detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">الموقع</p>
                    <p class="detail-value">${b.DeviceLocation || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-calendar detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">تاريخ الحجز</p>
                    <p class="detail-value">${b.BookingDate || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-calendar-alt detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">الوقت</p>
                    <p class="detail-value">${b.StartTime} - ${b.EndTime}</p></div>
                </div>`;
            break;

        case "زيارة":
            const l = reservation.LabVisit?.[0] || {};
            reservationInfoHTML = `
                <div class="detail-item mb-3"><i class="fas fa-list detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">نوع الزيارة</p>
                    <p class="detail-value">${l.VisitType || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-calendar detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">تاريخ الزيارة</p>
                    <p class="detail-value">${l.VisitDate || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-clock detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">الوقت المفضل</p>
                    <p class="detail-value">${l.PreferredTime || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-users detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">عدد الزوار</p>
                    <p class="detail-value">${l.NumberOfVisitors || "غير محدد"}</p></div>
                </div>

                <div class="detail-item mb-3"><i class="fas fa-phone detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">طريقة التواصل </p>
                    <p class="detail-value">${l.PreferredContactMethod || "غير محدد"}</p></div>
                </div> `;
            break;

        case "إعارة":
            const d = reservation.DeviceLoan?.[0] || {};
            reservationInfoHTML = `
                <div class="detail-item mb-3"><i class="fas fa-microchip detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">اسم الجهاز</p>
                    <p class="detail-value">${d.DeviceName || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-sticky-note detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">موقع الجهاز</p>
                    <p class="detail-value">${d.DeviceLocation || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-bullseye detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">الغرض</p>
                    <p class="detail-value">${d.Purpose || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-calendar-check detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">من</p>
                    <p class="detail-value">${d.StartDate || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-calendar-times detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">إلى</p>
                    <p class="detail-value">${d.EndDate || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-phone detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">طريقة التواصل </p>
                    <p class="detail-value">${d.PreferredContactMethod || "غير محدد"}</p></div>
                </div>

                `;
            break;

        case "دورات تدريبية":
            const crs = reservation.Course || {};
            reservationInfoHTML = `
                <div class="detail-item mb-3"><i class="fas fa-book detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">اسم الدورة</p>
                    <p class="detail-value">${crs.CourseName || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-book detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">مجال الدورة</p>
                    <p class="detail-value">${crs.CourseField || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-book detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">وصف الدورة</p>
                    <p class="detail-value">${crs.CourseDescription || "غير محدد"}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-chalkboard-teacher detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">المدرب</p>
                    <p class="detail-value">${crs.PresenterName || "غير محدد"}</p></div>
                </div>`;
            break;
    }

    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-primary mb-3"><i class="fas fa-user"></i> معلومات العميل</h6>
                <div class="detail-item mb-3"><i class="fas fa-user detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">الاسم</p>
                    <p class="detail-value">${reservation.FirstName} ${reservation.LastName}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-phone detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">الهاتف</p>
                    <p class="detail-value">${reservation.PhoneNumber}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-envelope detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">الإيميل</p>
                    <p class="detail-value">${reservation.Email}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-building detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">الكلية</p>
                    <p class="detail-value">${reservation.UserFaculty}</p></div>
                </div>
                <div class="detail-item mb-3"><i class="fas fa-building detail-icon"></i>
                    <div class="detail-content"><p class="detail-label">القسم</p>
                    <p class="detail-value">${reservation.UserDepartment}</p></div>
                </div>
            </div>
             
            <div class="col-md-6">
                <h6 class="text-primary mb-3"><i class="fas fa-info-circle"></i> معلومات الحجز</h6>
                ${reservationInfoHTML}
            </div>
        </div>

        <hr>
          ${( reservation.Status.startsWith('مرفوض') ||
            (reservation.Status.startsWith('موافق') && reservation.RequestType === 'دورة تدريبية')) ? `
             <div class="mb-3">
              <h6 class="text-primary mb-3"><i class="fas fa-clipboard-list"></i> ملاحظات</h6>
             <div class="purpose-text">${reservation.Notes || "غير محدد"}</div>
              </div>` : ''}

                 <div class="text-center">
                 <span class="status-badge ${statusClass}" style="font-size: 1rem; padding: 10px 20px;">
                 <i class="${statusIcon}"></i> ${reservation.Status}
            </span>
              ${reservation.Supervisor && reservation.Status.startsWith("موافق") && reservation.RequestType !== 'دورة تدريبية'
            ? `<p class="mt-2 text-muted">المشرف المسند: ${reservation.Supervisor}</p>` : ''}
             </div> `;

    const modal = new bootstrap.Modal(document.getElementById('reservationModal'));
    modal.show();
};
