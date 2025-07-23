



function displayDevicesForCategory(categoryKey) {
    const devicesGrid = document.querySelector('#devices .devices-grid');

    // احذف الكروت القديمة
    const existingItems = devicesGrid.querySelectorAll('.device-item.device-separator, .device-card.device-item');
    existingItems.forEach(item => item.remove());

    // أضف الفاصل
    const separatorHTML = `
        <div class="device-item device-separator">
            <h3>الأجهزة المتاحة في هذه الفئة</h3>
        </div>`;
    devicesGrid.insertAdjacentHTML('beforeend', separatorHTML);

    // اجلب الأجهزة
    fetch(`/Device/GetDevicesByCategory?category=${encodeURIComponent(categoryKey)}`)
        .then(response => response.json())
        .then(devices => {
            devices.forEach(device => {
                const deviceCardHTML = createDeviceCardHTML(device, categoryKey);
                devicesGrid.insertAdjacentHTML('beforeend', deviceCardHTML);
            });

            setTimeout(() => {
                const addedDevices = devicesGrid.querySelector('.device-separator');
                if (addedDevices) {
                    addedDevices.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);

            showNotification(`تم عرض ${devices.length} جهاز في هذه الفئة`, 'info');
        })
        .catch(error => {
            console.error('خطأ في جلب الأجهزة:', error);
            showNotification('حدث خطأ أثناء تحميل الأجهزة', 'error');
        });
}

function fetchTechnologiesCards() {
    fetch('/Device/GetTechnologies')
        .then(response => response.json())
        .then(data => {
            console.log("✅ Technologies Data:", data);

            const grid = document.getElementById('technologiesGrid');
            if (grid) {
                grid.innerHTML = '';

                data.forEach(tech => {
                    const techCard = document.createElement('div');
                    techCard.className = 'device-card';
                    techCard.style.cursor = 'pointer';
                    techCard.onclick = function () {
                        displayDevicesForCategory(tech.technologyName);
                    };

                    techCard.innerHTML = `
                        <div class="device-image">
                            <i class="fas fa-cog"></i>
                        </div>
                        <div class="device-info">
                            <h4>${tech.technologyName}</h4>
                            <p>${tech.description}</p>
                            <div class="device-status status-available">
                                <i class="fas fa-circle"></i>
                                متاح الآن
                            </div>
                        </div>
                    `;
                    grid.appendChild(techCard);
                });
            }
        })
        .catch(error => {
            console.error('❌ Error fetching technologies:', error);
            showNotification('حدث خطأ أثناء تحميل التقنيات', 'error');
        });
}


// Function to close mobile navbar
function closeMobileNavbar() {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });
        bsCollapse.hide();
    }
}

// Page navigation functions
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.main-content').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageId + 'Page').classList.add('active');

    // Close mobile navbar after navigation
    closeMobileNavbar();
}


function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Close mobile navbar after scrolling
    closeMobileNavbar();
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const notificationIcon = document.getElementById('notificationIcon');

    // Set message
    notificationText.textContent = message;

    // Set icon based on type
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };

    notificationIcon.className = icons[type] || icons['info'];

    // Set notification class
    notification.className = `notification ${type}`;

    // Show notification
    notification.style.display = 'block';

    // Auto hide after 4 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 4000);
}



function getDeviceStatusText(status) {
    const statusMap = {
        'متاح': 'متاح ',
        'محجوز': 'محجوز',
        'تحت الصيانة': 'تحت الصيانة'
    };
    return statusMap[status] || status;
}

function getDeviceStatusClass(status) {
    const statusClassMap = {
        'متاح': 'status-available',
        'محجوز': 'status-busy',
        'تحت الصيانة': 'status-maintenance'
    };
    return statusClassMap[status] || 'status-available';
}


// Function to get appropriate icon for each category
function getIconClassByTechnologyId(type) {
    switch (type) {
        case 1: return "fas fa-brain";       // الذكاء الاصطناعي
        case 2: return "fas fa-video";       // الاستوديو
        case 3: return "fas fa-cube";        // الطابعات ثلاثية
        case 4: return "fas fa-robot";       // الروبوتات
        case 5: return "fas fa-mobile-alt";  // الواقع المعزز
        case 6: return "fas fa-vr-cardboard";// الواقع الافتراضي
        default: return "fas fa-cogs";       // افتراضي
    }
}


// Function to get gradient colors for each category
function getCategoryGradient(categoryKey) {
    const gradientMap = {
        'vr': 'linear-gradient(45deg, #006C35, #10B981)',
        'ar': 'linear-gradient(45deg, #1E3A8A, #3B82F6)',
        'robot': 'linear-gradient(45deg, #F59E0B, #FCD34D)',
        '3d': 'linear-gradient(45deg, #EF4444, #F87171)',
        'studio': 'linear-gradient(45deg, #8B5CF6, #A78BFA)',
        'ai': 'linear-gradient(45deg, #06B6D4, #67E8F9)'
    };
    return gradientMap[categoryKey] || 'linear-gradient(45deg, #6B7280, #9CA3AF)';
}

// Function to create a device card HTML element
function createDeviceCardHTML(device, categoryKey) {
    console.log("🔎 بيانات الجهاز داخل createDeviceCardHTML:", device);

    const statusText = getDeviceStatusText(device.status);
    const statusClass = getDeviceStatusClass(device.status);
    const icon = getIconClassByTechnologyId(device.type);
    const gradient = getCategoryGradient(categoryKey); // تقدر تتركه إذا gradient يعتمد على categoryKey

    return `
        <div class="device-card device-item" data-device-id="${device.id}">
            <div class="device-image" style="background: ${gradient};">
                <i class="${icon}"></i>
            </div>
            <div class="device-info">
                <h4>${device.name}</h4>
                <p>${device.specs || 'مواصفات متقدمة'}</p>
                <div class="device-status ${statusClass}">
                    <i class="fas fa-circle"></i>
                    ${statusText}
                </div>
            </div>
        </div>
    `;
}


// Function to add click interactions to category cards
function initializeDeviceCategoryClicks() {
    const devicesGrid = document.querySelector('#devices .devices-grid');
    if (!devicesGrid) {
        console.warn('Devices grid not found');
        return;
    }

    const categoryCards = devicesGrid.querySelectorAll('.device-card:not(.device-item)');

    categoryCards.forEach((card, index) => {
        if (index < 6 && deviceCategoryMapping.hasOwnProperty(index)) {

            // ✅ تحقق إذا تمت تهيئة الـ card مسبقًا
            if (!card.dataset.initialized) {

                // Add visual cursor indication
                card.style.cursor = 'pointer';
                card.style.transition = 'all 0.3s ease';

                card.addEventListener('click', function (e) {
                    e.preventDefault();
                    const categoryKey = deviceCategoryMapping[index];

                    if (categoryKey) {
                        displayDevicesForCategory(categoryKey);

                        // Animation
                        this.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            this.style.transform = '';
                        }, 150);
                    }
                });

                card.addEventListener('mouseenter', function () {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                    this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
                });

                card.addEventListener('mouseleave', function () {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                });

                // Add click indicator
                const cardInfo = card.querySelector('.device-info');
                if (cardInfo) {
                    const clickIndicator = document.createElement('div');
                    clickIndicator.innerHTML = '<i class="fas fa-mouse-pointer"></i> انقر لعرض الأجهزة';
                    clickIndicator.style.cssText = `
                    color: #006C35; 
                    font-size: 0.8rem; 
                    margin-top: 0.5rem; 
                    font-weight: 500;
                    opacity: 0.7;
                `;
                    cardInfo.appendChild(clickIndicator);
                }

                // ✅ نحط علامة إنه تمت التهيئة
                card.dataset.initialized = "true";
            }
        }
    });


    console.log('Device category click interactions initialized successfully');
}

// Function to reset/clear device display
function clearDeviceDisplay() {
    const devicesGrid = document.querySelector('#devices .devices-grid');
    if (devicesGrid) {
        const deviceItems = devicesGrid.querySelectorAll('.device-item');
        deviceItems.forEach(item => item.remove());
    }
}

// Initialize the interaction when DOM is ready
function initializeWhenReady() {
    if (deviceClicksInitialized) return;

    if (document.querySelector('#devices .devices-grid')) {
        initializeDeviceCategoryClicks();
        deviceClicksInitialized = true;
    } else {
        setTimeout(initializeWhenReady, 500);
    }

}

// Bootstrap integration - Close navbar on outside click and escape key
document.addEventListener('click', function (event) {
    const navbar = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const mobileControls = document.querySelector('.mobile-controls');

    if (navbar && navbar.classList.contains('show') &&
        !navbar.contains(event.target) &&
        !navbarToggler.contains(event.target) &&
        !mobileControls.contains(event.target)) {

        closeMobileNavbar();
    }
});

// Close navbar on escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeMobileNavbar();
    }
});

// Initialize Bootstrap tooltips and ensure proper functionality
document.addEventListener('DOMContentLoaded', function () {
    // Ensure Bootstrap JavaScript is loaded
    if (typeof bootstrap !== 'undefined') {
        console.log('Bootstrap 5 loaded successfully');
    }

    // Initialize navbar close functionality
    initializeNavbarClose();

    // Initialize contact form
    initializeContactForm();

    // Initialize FAQ functionality
    initializeFAQ();
});

// Initialize navbar close functionality
function initializeNavbarClose() {
    // Add click event listeners to all navigation links
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Close mobile navbar when any nav link is clicked
            setTimeout(() => {
                closeMobileNavbar();
            }, 100);
        });
    });

    // Also close on logo click
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function () {
            closeMobileNavbar();
        });
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;

            if (name && email && subject && message) {
                // Show success notification
                showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'success');

                // Reset form
                this.reset();

                // Add visual feedback
                const submitBtn = this.querySelector('.btn-send');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> تم الإرسال';
                submitBtn.style.background = '#10B981';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '#006C35';
                }, 3000);
            } else {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'warning');
            }
        });

        // Add input validation styling
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '#006C35';
                }
            });

            input.addEventListener('focus', function () {
                this.style.borderColor = '#006C35';
            });
        });
    }
}

// FAQ functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const answer = this.nextElementSibling;
            const isVisible = answer.style.display === 'block';

            // Hide all other answers
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.style.display = 'none';
            });

            // Toggle current answer
            if (!isVisible) {
                answer.style.display = 'block';
                answer.style.animation = 'fadeIn 0.3s ease';
            }
        });
    });
}

// Multiple initialization approaches to ensure it works
document.addEventListener('DOMContentLoaded', initializeWhenReady);

// Also initialize if script runs after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWhenReady);
} else {
    initializeWhenReady();
}

// Expose functions globally for potential external use
window.displayDevicesForCategory = displayDevicesForCategory;
window.clearDeviceDisplay = clearDeviceDisplay;

console.log('معمل الابتكارات - نظام عرض الأجهزة التفاعلي محمل بنجاح 🚀');



document.addEventListener('DOMContentLoaded', function () {
    const footer = document.querySelector('footer.main-footer');
    const observer = new MutationObserver(() => {
        const isHomeActive = document.getElementById('homePage')?.classList.contains('active');
        if (footer) footer.style.display = isHomeActive ? 'block' : 'none';
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
});


document.addEventListener('DOMContentLoaded', fetchTechnologiesCards);

