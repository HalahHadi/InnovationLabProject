// ==================== الإعدادات ====================
// قائمة بحالات الإعارة المرتبطة بالمشرف
const penStatuses = [
    'بانتظار اسناد المشرف',
    'مرفوض من قبل المشرف',
    'موافق عليه من قبل المشرف'
];
// مصفوفة لتخزين كل الطلبات التي سيتم تحميلها
let allRequests = [];

// ==================== جلب البيانات ====================
/* دالة fetchDeviceLoans: تجلب بيانات إعارة الأجهزة وتحوّلها لكائنات موحدة */
async function fetchDeviceLoans() {
    try {
        // إرسال طلب جلب بيانات من السيرفر
        const response = await fetch('/Requests/GetDeviceLoans');
        // التحقق من نجاح الاستجابة
        if (!response.ok) throw new Error('خطأ في جلب بيانات الإعارة');
        // تحويل الاستجابة إلى JSON
        const data = await response.json();
        // إعادة تنسيق كل عنصر إلى كائن بصيغة موحدة
        return data.map(dl => ({
            id: dl.id,
            deviceLoanId: dl.deviceLoanId,
            user: dl.user,
            serviceType: 'اعارة',
            device: dl.device,
            date: dl.startDate,
            endDate: dl.endDate,
            purpose: dl.purpose,
            supervisor: dl.supervisor,
            status: dl.status
        }));
    } catch (err) {
        // طباعة الخطأ في وحدة التحكم
        console.error(err);
        return [];
    }
}
/* دالة fetchConsultations: تجلب بيانات الاستشارات وتعيدها بشكل منظم */
async function fetchConsultations() {
    try {
        const response = await fetch('/Requests/GetConsultations');
        if (!response.ok) throw new Error('خطأ في جلب بيانات الاستشارات');
        const data = await response.json();
        return data.map(c => ({
            id: c.id,
            consultationId: c.consultationId,
            user: c.user,
            serviceType: 'استشارة',
            date: c.date,
            consultationDescription: c.consultationDescription,
            department: c.department,
            major: c.major,
            supervisor: c.supervisor,
            status: c.status
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
}
/* دالة fetchLabVisits: تجلب بيانات زيارات المعمل وتعيدها ككائنات موحدة */
async function fetchLabVisits() {
    try {
        const response = await fetch('/Requests/GetLabVisits');
        if (!response.ok) throw new Error('خطأ في جلب بيانات الزيارة');
        const data = await response.json();
        return data.map(v => ({
            id: v.id,
            labVisitId: v.labVisitId,
            user: v.user,
            serviceType: 'زيارة',
            date: v.date,
            time: v.time,
            numberOfVisitors: v.numberOfVisitors,
            additionalNotes: v.additionalNotes,
            supervisor: v.supervisor,
            status: v.status
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
}
/* دالة fetchCourses: تجلب بيانات الدورات التدريبية وتعيدها ككائنات موحدة */
async function fetchCourses() {
    try {
        const response = await fetch('/Requests/GetCourses');
        if (!response.ok) throw new Error('خطأ في جلب بيانات الدورات');
        const data = await response.json();
        return data.map(c => ({
            id: c.id,
            courseId: c.courseId,
            user: c.user,
            serviceType: 'دورة تدريبية',
            courseName: c.courseName,
            courseField: c.courseField,
            presenterName: c.presenterName,
            courseDescription: c.courseDescription,
            supervisor: c.supervisor,
            status: c.status
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
}
/* دالة fetchBookingDevices: تجلب بيانات حجز الأجهزة وتعيدها ككائنات موحدة */
async function fetchBookingDevices() {
    try {
        const response = await fetch('/Requests/GetBookingDevices');
        if (!response.ok) throw new Error('خطأ في جلب بيانات الحجز');
        const data = await response.json();
        return data.map(bd => ({
            id: bd.id,
            bookingDeviceId: bd.bookingDeviceId,
            user: bd.user,
            serviceType: 'حجز جهاز',
            device: bd.device,
            projectName: bd.projectName,
            projectDescription: bd.projectDescription,
            faculty: bd.faculty,
            department: bd.department,
            filePath: bd.filePath,
            date: bd.date,
            stime: bd.stime,
            etime: bd.etime,
            supervisor: bd.supervisor,
            status: bd.status
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
}

// ==================== فلترة وملء الجداول ====================
/* دالة filterRequests: تقوم بجلب جميع أنواع الطلبات، وفلترتها حسب المدخلات، ثم تعبئة الجداول بالنتائج */
async function filterRequests() {
    // جلب جميع أنواع الطلبات بشكل متزامن
    const [deviceLoans, consultations, labVisits, courses, bookingDevices] = await Promise.all([
        fetchDeviceLoans(),
        fetchConsultations(),
        fetchLabVisits(),
        fetchCourses(),
        fetchBookingDevices()
    ]);
    // دمج جميع الطلبات في مصفوفة واحدة
    allRequests = [
        ...deviceLoans,
        ...consultations,
        ...labVisits,
        ...courses,
        ...bookingDevices
    ];
    // الحصول على قيم الفلاتر من واجهة المستخدم
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const serviceTypeFilter = document.getElementById('serviceTypeFilter').value;
    // أنواع الخدمات المتاحة
    const serviceTypes = ['اعارة', 'استشارة', 'زيارة', 'دورة تدريبية', 'حجز جهاز'];
    // مصفوفات لتخزين الجداول التي تم تعبئتها والفارغة
    let filledTables = [];
    let emptyTables = [];
    // تكرار لكل نوع خدمة لتعبئة الجدول الخاص بها
    serviceTypes.forEach(type => {
        const tableBody = document.getElementById(`${type}TableBody`);
        const tableWrapper = document.getElementById(`${type}TableWrapper`);
        if (!tableBody || !tableWrapper) return;

        // مسح محتوى الجدول الحالي
        tableBody.innerHTML = '';
        // إخفاء الجداول مؤقتاً حتى نعيد ترتيبها لاحقاً
        if (serviceTypeFilter === '' || serviceTypeFilter === type) {
            // Hide all tables initially, we'll add them in order later
            tableWrapper.style.display = 'none';
        } else {
            tableWrapper.style.display = 'none';
        }
        // فلترة الطلبات بناءً على نوع الخدمة والكلمات المفتاحية والفلاتر الأخرى
        let filteredServiceRequests = allRequests.filter(request => {
            const matchesSearchTerm = searchTerm === '' ||
                (request.user && request.user.toLowerCase().includes(searchTerm)) ||
                (request.device && request.device.toLowerCase().includes(searchTerm)) ||
                (request.supervisor && request.supervisor.toLowerCase().includes(searchTerm)) ||
                (request.status && request.status.toLowerCase().includes(searchTerm));
            const requestDateForFilter = request.date ? String(request.date).split('T')[0] : '';
            const matchesDate = dateFilter === '' || requestDateForFilter.includes(dateFilter);
            const matchesStatus = statusFilter === '' || request.status === statusFilter;

            return request.serviceType === type && matchesSearchTerm && matchesDate && matchesStatus;
        });
        // معالجة الحالات التي لا توجد فيها بيانات لهذا النوع من الطلبات
        if (filteredServiceRequests.length === 0) {
            let colspanValue = 8;
            if (type === 'استشارة') colspanValue = 5;
            if (type === 'دورة تدريبية') colspanValue = 4;
            // عرض رسالة "لا توجد طلبات" داخل الجدول
            tableBody.innerHTML = `<tr><td colspan="${colspanValue}" class="text-center">لا توجد طلبات للخدمة</td></tr>`;
            emptyTables.push(tableWrapper);
        } else {
            // تعبئة صفوف الجدول بالبيانات المناسبة لكل نوع خدمة
            filteredServiceRequests.forEach(r => {
                let rowContent = '';
                switch (r.serviceType) {
                    case 'اعارة':
                        rowContent = `
                            <td><div class="user-cell"><span>${r.user}</span></div></td>
                            <td>${r.device || 'لا يوجد'}</td>
                            <td>${r.date || '—'}</td>
                            <td>${r.endDate || '—'}</td>
                            <td class="center-col">${r.supervisor}</td>
                            <td class="center-col"><span class="badge ${getStatusClass(r.status)}">${r.status}</span></td>
                            <td>
                                <button class="icon-btn" onclick="showDetails(${r.id})" title="عرض التفاصيل">
                                    <svg viewBox="0 0 24 24"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
                                </button>
                                ${getPenButton(r)}
                            </td>`;
                        break;
                    case 'استشارة':
                        rowContent = `
                            <td><div class="user-cell"><span>${r.user}</span></div></td>
                            <td>${r.date || '—'}</td>
                            <td class="center-col">${r.supervisor}</td>
                            <td class="center-col"><span class="badge ${getStatusClass(r.status)}">${r.status}</span></td>
                            <td>
                                <button class="icon-btn" onclick="showDetails(${r.id})" title="عرض التفاصيل">
                                    <svg viewBox="0 0 24 24"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
                                </button>
                                ${getPenButton(r)}
                            </td>`;
                        break;
                    case 'زيارة':
                        rowContent = `
                            <td><div class="user-cell"><span>${r.user}</span></div></td>
                            <td>${r.date || '—'}</td>
                            <td>${r.time || '—'}</td>
                            <td class="center-col">${r.supervisor}</td>
                            <td class="center-col"><span class="badge ${getStatusClass(r.status)}">${r.status}</span></td>
                            <td>
                                <button class="icon-btn" onclick="showDetails(${r.id})" title="عرض التفاصيل">
                                    <svg viewBox="0 0 24 24"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
                                </button>
                                ${getPenButton(r)}
                            </td>`;
                        break;
                    case 'دورة تدريبية':
                        rowContent = `
                            <td><div class="user-cell"><span>${r.user}</span></div></td>
                            <td class="center-col">${r.supervisor}</td>
                            <td class="center-col"><span class="badge ${getStatusClass(r.status)}">${r.status}</span></td>
                            <td>
                                <button class="icon-btn" onclick="showDetails(${r.id})" title="عرض التفاصيل">
                                    <svg viewBox="0 0 24 24"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
                                </button>
                                ${getPenButton(r)}
                            </td>`;
                        break;
                    case 'حجز جهاز':
                        rowContent = `
                            <td><div class="user-cell"><span>${r.user}</span></div></td>
                            <td>${r.device || 'لا يوجد'}</td>
                            <td>${r.date || '—'}</td>
                            <td>${r.stime || '—'}</td>
                            <td>${r.etime || '—'}</td>
                            <td class="center-col">${r.supervisor}</td>
                            <td class="center-col"><span class="badge ${getStatusClass(r.status)}">${r.status}</span></td>
                            <td>
                                <button class="icon-btn" onclick="showDetails(${r.id})" title="عرض التفاصيل">
                                    <svg viewBox="0 0 24 24"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
                                </button>
                                ${getPenButton(r)}
                            </td>`;
                        break;
                }
                // إضافة الصف إلى الجدول
                tableBody.insertAdjacentHTML('beforeend', `<tr>${rowContent}</tr>`);
            });
            filledTables.push(tableWrapper);
        }
    });

    // ترتيب عرض الجداول بحيث تظهر الجداول التي تحتوي على بيانات أولاً ثم الفارغة
    const parent = document.getElementById('requests');
    [...filledTables, ...emptyTables].forEach(tw => parent.appendChild(tw));
    filledTables.forEach(tw => tw.style.display = 'block');
    emptyTables.forEach(tw => tw.style.display = 'block');
}

/* دالة getPenButton: تُرجع زر "إجراء" (أيقونة القلم) إذا كان الطلب من الحالات المسموح بها */
function getPenButton(r) {
    return penStatuses.includes(r.status) ? `
        <button class="icon-btn" onclick="handleAction(${r.id})" title="إجراء">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </button>
    ` : '';
}

// ==================== منطق زر القلم ====================
/* دالة handleAction: تعالج الضغط على زر الإجراء (القلم) حسب حالة الطلب */
function handleAction(requestId) {
    // البحث عن الطلب في جميع الطلبات حسب المعرف
    const r = allRequests.find(x => x.id === requestId);
    if (!r) return;
    // فتح نافذة اسناد مشرف إذا كان الطلب بانتظار اسناد أو مرفوض من المشرف
    if (
        r.status === "بانتظار اسناد المشرف" ||
        r.status === "مرفوض من قبل المشرف"
    ) {
        renderAssignModal(r);
        // فتح نافذة القرار النهائي إذا تم الموافقة من المشرف
    } else if (r.status === "موافق عليه من قبل المشرف") {
        renderFinalDecisionModal(r);
        document.getElementById('finalDecisionModal').classList.add('show');
    }
}

// ========== نافذة اسناد مشرف ==========
/* دالة renderAssignModal: تعرض نافذة اختيار مشرف لطلب معين */
async function renderAssignModal(r) {
    let supervisors = [];
    try {
        // جلب قائمة المشرفين من السيرفر
        const resp = await fetch('/Requests/GetSupervisors');
        if (resp.ok) supervisors = await resp.json();
    } catch (e) {
        // في حال فشل الجلب، نترك القائمة فارغة
        supervisors = [];
    }
    // بناء خيارات قائمة المشرفين للعرض في القائمة المنسدلة
    let options = supervisors.length
        ? supervisors.map(s =>
            `<option value="${s.id}">${s.name}</option>`
        ).join('')
        : `<option value="">لا يوجد مشرفين متاحين</option>`;
    // بناء المحتوى التفصيلي للنافذة مع بيانات الطلب وقائمة المشرفين
    let detailsHtml = `
        <div style="margin-bottom:20px;">
            <div><b>المستفيد:</b> ${r.user || '-'}</div>
            <div><b>الجهاز:</b> ${r.device || 'لا يوجد جهاز'}</div>
            <div><b>التاريخ:</b> ${r.date || '-'}</div>
            <div><b>الوقت:</b> ${r.time || 'لا يوجد وقت محدد'}</div>
            <div><b>الغرض:</b> ${r.purpose || '-'}</div>
        </div>
        <div><b>اختر المشرف:</b></div>
        <select id="assignSupervisorSelect" style="margin-top:8px; min-width:180px;">
            <option value="">-- اختر --</option>
            ${options}
        </select>
        <input type="hidden" id="assignRequestId" value="${r.id}" />
    `;
    // وضع المحتوى داخل جسم النافذة
    document.getElementById('assignBody').innerHTML = detailsHtml;
    // إخفاء رسالة الخطأ في البداية
    document.getElementById('assignErrorMessage').style.display = "none";
    // إظهار نافذة الإسناد
    document.getElementById('assignModal').classList.add('show');
}
/* دالة confirmAssign: تأكيد اختيار مشرف وإرسال الطلب للسيرفر */
async function confirmAssign() {
    // الحصول على المعرفات من النافذة
    const supervisorId = document.getElementById('assignSupervisorSelect').value;
    const requestId = document.getElementById('assignRequestId').value;
    // التحقق من اختيار مشرف
    if (!supervisorId) {
        // إظهار رسالة الخطأ إذا لم يتم الاختيار
        document.getElementById('assignErrorMessage').style.display = "flex";
        return;
    }
    // إرسال طلب إسناد المشرف إلى السيرفر
    await fetch('/Requests/AssignSupervisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, supervisorId })
    });
    // إغلاق نافذة الإسناد بعد الإرسال
    document.getElementById('assignModal').classList.remove('show');
    // عرض رسالة نجاح
    showSuccess("تم اسناد المشرف بنجاح!");
    // تحديث عرض الطلبات بعد التغيير
    filterRequests();
}

// ========== نافذة القرار النهائي ==========
/* دالة renderFinalDecisionModal: تعرض نافذة اختيار القرار النهائي للطلب */
async function renderFinalDecisionModal(request) {
    let html = `
        <div style="margin-bottom:18px;">
            <div><b>المستفيد:</b> ${request.user || '-'}</div>
            <div><b>نوع الخدمة:</b> ${request.serviceType || '-'}</div>
            <div><b>الحالة الحالية:</b> ${request.status || '-'}</div>
        </div>
        <div><b>اختر القرار:</b></div>
        <select id="finalDecisionSelect" style="margin-top:8px; min-width:160px;">
            <option value="">-- اختر --</option>
            <option value="مقبول">مقبول</option>
            <option value="مرفوض">مرفوض</option>
        </select>
        <input type="hidden" id="finalDecisionRequestId" value="${request.id}" />
        <div style="margin-top:18px;">
            <label style="font-weight:700; display:block; margin-bottom:6px;">ملاحظات:</label>
            <textarea id="finalDecisionNotes" placeholder="أضف ملاحظات..." style="width:100%;min-height:80px;resize:vertical;direction:rtl;padding:8px;border-radius:6px;border:1px solid #ccc;font-family:'Tajawal',sans-serif;"></textarea>
        </div>
    `;
    // وضع المحتوى داخل جسم نافذة القرار النهائي
    document.getElementById('finalDecisionBody').innerHTML = html;
    // إخفاء رسالة الخطأ في البداية
    document.getElementById('finalDecisionErrorMessage').style.display = "none";
    // إظهار نافذة القرار النهائي
    document.getElementById('finalDecisionModal').classList.add('show');
}

/* دالة confirmFinalDecision: تأكيد القرار النهائي وإرساله للسيرفر */
async function confirmFinalDecision() {
    // الحصول على القرار، معرف الطلب، والملاحظات من النافذة
    const decision = document.getElementById('finalDecisionSelect').value;
    const requestId = document.getElementById('finalDecisionRequestId').value;
    const notes = document.getElementById('finalDecisionNotes').value;
    // التحقق من اختيار القرار
    if (!decision) {
        // إظهار رسالة الخطأ إذا لم يتم اختيار القرار
        document.getElementById('finalDecisionErrorMessage').style.display = "flex";
        return;
    }
    // إرسال القرار النهائي مع الملاحظات إلى السيرفر
    await fetch('/Requests/FinalDecision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, decision, notes })
    });
    // إغلاق نافذة القرار النهائي بعد الإرسال
    document.getElementById('finalDecisionModal').classList.remove('show');
    // عرض رسالة نجاح
    showSuccess("تم حفظ القرار بنجاح!");
    // تحديث عرض الطلبات بعد التغيير
    filterRequests();
}


// ========== دوال إغلاق المودالات ==========
/* إخفاء نافذة إسناد المشرف */
function hideAssign() {
    document.getElementById('assignModal').classList.remove('show');
}
/* إخفاء نافذة القرار النهائي */
function hideFinalDecision() {
    document.getElementById('finalDecisionModal').classList.remove('show');
}
/* إخفاء نافذة عرض التفاصيل */
function hideView() {
    document.getElementById('viewModal').classList.remove('show');
}

// ========== تفاصيل الطلب (زر العين) ==========
// ====== دوال تفاصيل منفصلة لكل خدمة ======
// دالة رئيسية: تحدد أي دالة تفاصيل تُستخدم حسب نوع الخدمة
/* دالة showDetails: تعرض تفاصيل الطلب حسب نوع الخدمة */
async function showDetails(itemId) {
    // البحث عن الطلب حسب المعرف
    const r = allRequests.find(x => x.id === itemId);
    if (!r) return;

    let details = {};
    try {
        // جلب التفاصيل الكاملة من السيرفر
        const resp = await fetch(`/Requests/GetRequestFullDetails?id=${r.id}&type=${encodeURIComponent(r.serviceType)}`);
        details = resp.ok ? await resp.json() : r;
    } catch {
        // في حال فشل الجلب نستخدم البيانات المتوفرة مسبقاً
        details = r;
    }
    // اختيار دالة العرض المناسبة حسب نوع الخدمة
    let html = '';
    switch (details.serviceType) {
        case 'اعارة':
            html = renderDeviceLoanDetails(details); break;
        case 'استشارة':
            html = renderConsultationDetails(details); break;
        case 'زيارة':
            html = renderLabVisitDetails(details); break;
        case 'حجز جهاز':
            html = renderBookingDeviceDetails(details); break;
        case 'دورة تدريبية':
            html = renderCourseDetails(details); break;
        default:
            html = '<div class="details-section">لا توجد تفاصيل متوفرة لهذا الطلب</div>';
    }
    // عرض التفاصيل في نافذة العرض
    document.getElementById('viewBody').innerHTML = html;
    document.getElementById('viewModal').classList.add('show');
}

// ===== دوال منفصلة لكل نوع خدمة =====

// دالة عرض تفاصيل إعارة جهاز
function renderDeviceLoanDetails(details) {
    return `
    <div class="details-modal-grid">
        <div class="details-section">
            <h3>معلومات المستفيد</h3>
            <div><b>الاسم:</b> ${details.user || '-'}</div>
        </div>
        <div class="details-section">
            <h3>تفاصيل الطلب</h3>
            <div><b>نوع الخدمة:</b>اعارة</div>
            <div><b>الجهاز:</b> ${details.device || '-'}</div>
            <div><b>تاريخ البداية:</b> ${details.date || '-'}</div>
            <div><b>تاريخ النهاية:</b> ${details.endDate || '-'}</div>
            <div><b>الغرض:</b> ${details.purpose || '-'}</div>
            <div><b>المشرف:</b> ${details.supervisor || '-'}</div>
            <div><b>الحالة:</b> ${details.status || '-'}</div>
        </div>
    </div>`;
}


// دالة عرض تفاصيل استشارة
function renderConsultationDetails(details) {
    return `
    <div class="details-modal-grid">
        <div class="details-section">
            <h3>معلومات المستفيد</h3>
            <div><b>الاسم:</b> ${details.user || '-'}</div>
        </div>
        <div class="details-section">
            <h3>تفاصيل الطلب</h3>
            <div><b>نوع الخدمة:</b> استشارة</div>
            <div><b>التاريخ:</b> ${details.date || '-'}</div>
            <div><b>الوصف:</b> ${details.consultationDescription || '-'}</div>
            <div><b>القسم:</b> ${details.department || '-'}</div>
            <div><b>التخصص:</b> ${details.major || '-'}</div>
            <div><b>المشرف:</b> ${details.supervisor || '-'}</div>
            <div><b>الحالة:</b> ${details.status || '-'}</div>
        </div>
    </div>`;
}

// دالة عرض تفاصيل زيارة معمل
function renderLabVisitDetails(details) {
    return `
    <div class="details-modal-grid">
        <div class="details-section">
            <h3>معلومات المستفيد</h3>
            <div><b>الاسم:</b> ${details.user || '-'}</div>
        </div>
        <div class="details-section">
            <h3>تفاصيل الطلب</h3>
            <div><b>نوع الخدمة:</b> زيارة</div>
            <div><b>تاريخ الزيارة:</b> ${details.date || '-'}</div>
            <div><b>الوقت:</b> ${details.time || '-'}</div>
            <div><b>عدد الزوار:</b> ${details.numberOfVisitors || '-'}</div>
            <div><b>الملاحظات:</b> ${details.additionalNotes || '-'}</div>
            <div><b>المشرف:</b> ${details.supervisor || '-'}</div>
            <div><b>الحالة:</b> ${details.status || '-'}</div>
        </div>
    </div>`;
}

// دالة عرض تفاصيل حجز جهاز
function renderBookingDeviceDetails(details) {
    return `
    <div class="details-modal-grid">
        <div class="details-section">
            <h3>معلومات المستفيد</h3>
            <div><b>الاسم:</b> ${details.user || '-'}</div>
        </div>
        <div class="details-section">
            <h3>تفاصيل الطلب</h3>
            <div><b>نوع الخدمة:</b>حجز جهاز</div>
            <div><b>الجهاز:</b> ${details.device || '-'}</div>
            <div><b>اسم المشروع:</b> ${details.projectName || '-'}</div>
            <div><b>وصف المشروع:</b> ${details.projectDescription || '-'}</div>
            <div><b>الكلية:</b> ${details.faculty || '-'}</div>
            <div><b>القسم:</b> ${details.department || '-'}</div>
            <div><b>التاريخ:</b> ${details.date || '-'}</div>
            <div><b>وقت البداية:</b> ${details.stime || '-'}</div>
            <div><b>وقت النهاية:</b> ${details.etime || '-'}</div>
            ${details.filePath ? `<div><b>ملف مرفق:</b> <a href="${details.filePath}" target="_blank">تحميل</a></div>` : ''}
            <div><b>المشرف:</b> ${details.supervisor || '-'}</div>
            <div><b>الحالة:</b> ${details.status || '-'}</div>
        </div>
    </div>`;
}

// دالة عرض تفاصيل دورة تدريبية
function renderCourseDetails(details) {
    return `
    <div class="details-modal-grid">
        <div class="details-section">
            <h3>معلومات المستفيد</h3>
            <div><b>الاسم:</b> ${details.user || '-'}</div>
        </div>
        <div class="details-section">
            <h3>تفاصيل الطلب</h3>
            <div><b>نوع الخدمة:</b> دورة تدريبية</div>
            <div><b>اسم الدورة:</b> ${details.courseName || '-'}</div>
            <div><b>المجال:</b> ${details.courseField || '-'}</div>
            <div><b>المدرب:</b> ${details.presenterName || '-'}</div>
            <div><b>الوصف:</b> ${details.courseDescription || '-'}</div>
            <div><b>المشرف:</b> ${details.supervisor || '-'}</div>
            <div><b>الحالة:</b> ${details.status || '-'}</div>
        </div>
    </div>`;
}




// ========== دالة تحديد لون الشارة حسب الحالة ==========
function getStatusClass(s) {
    return {
        'بانتظار اسناد المشرف': 'badge-yellow',
        'بانتظار موافقة المشرف': 'badge-lightblue',
        'مرفوض من قبل المشرف': 'badge-red',
        'موافق عليه من قبل المشرف': 'badge-green',
        'موافق عليه من قبل المسؤول': 'badge-purple',
        'مرفوض من قبل المسؤول': 'badge-red',
        'مقبول': 'badge-green',
        'مرفوض': 'badge-red'
        // اللون الافتراضي إذا كانت الحالة غير معروفة
    }[s] || 'badge-grey';
}

// ========== رسالة نجاح ==========
function showSuccess(message) {
    // وضع نص الرسالة في العنصر المخصص
    document.getElementById('successMessageText').innerText = message;
    // إظهار نافذة الرسالة
    document.getElementById('successMessageModal').classList.add('show');
    // إخفاء النافذة بعد 1.5 ثانية تلقائياً
    setTimeout(() => {
        document.getElementById('successMessageModal').classList.remove('show');
    }, 1500);
}

// ========== تحميل الصفحة ==========
document.addEventListener('DOMContentLoaded', () => {
    // عند تحميل الصفحة، يتم فلترة وعرض الطلبات
    filterRequests();
});