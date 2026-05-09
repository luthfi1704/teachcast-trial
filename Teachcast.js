/**
 * TeachCast Trial Registration - JavaScript
 * Handles navigation, form validation, and WhatsApp integration
 */

(function() {
    'use strict';

    // ========== CONFIGURATION ==========
    const CONFIG = {
        whatsappPhone: '6281393491201',
        forbiddenDomains: ['.ac.id', '.edu'],
        personalEmailDomain: '@gmail.com'
    };

    // ========== DOM ELEMENTS ==========
    const elements = {
        // Sections
        welcomeSection: document.getElementById('welcomeSection'),
        formSection: document.getElementById('formSection'),
        
        // Buttons
        btnStartRegistration: document.getElementById('btnStartRegistration'),
        btnBack: document.getElementById('btnBack'),
        btnSubmit: document.getElementById('btnSubmit'),
        btnCloseError: document.getElementById('btnCloseError'),
        btnCloseSuccess: document.getElementById('btnCloseSuccess'),
        
        // Form Inputs
        inputName: document.getElementById('inputName'),
        inputEmail: document.getElementById('inputEmail'),
        
        // Error Elements
        nameError: document.getElementById('nameError'),
        emailError: document.getElementById('emailError'),
        
        // Modals
        errorModal: document.getElementById('errorModal'),
        successModal: document.getElementById('successModal'),
        errorMsg: document.getElementById('errorMsg')
    };

    // ========== NAVIGATION ==========
    
    /**
     * Show registration form section
     */
    function showRegistrationForm() {
        toggleSection(elements.welcomeSection, false);
        toggleSection(elements.formSection, true);
        scrollToTop();
        elements.inputName.focus();
    }

    /**
     * Return to welcome section
     */
    function showWelcomeSection() {
        toggleSection(elements.formSection, false);
        toggleSection(elements.welcomeSection, true);
        scrollToTop();
        clearFormErrors();
    }

    /**
     * Toggle section visibility with animation
     * @param {HTMLElement} section 
     * @param {boolean} show 
     */
    function toggleSection(section, show) {
        if (!section) return;
        
        if (show) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    }

    /**
     * Smooth scroll to top
     */
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ========== FORM VALIDATION ==========

    /**
     * Validate name input
     * @param {string} name 
     * @returns {boolean}
     */
    function validateName(name) {
        const trimmed = name.trim();
        if (!trimmed) {
            showError(elements.nameError, 'Nama lengkap harus diisi');
            return false;
        }
        if (trimmed.length < 3) {
            showError(elements.nameError, 'Nama minimal 3 karakter');
            return false;
        }
        clearError(elements.nameError);
        return true;
    }

    /**
     * Validate email input
     * @param {string} email 
     * @returns {boolean}
     */
    function validateEmail(email) {
        const trimmed = email.trim().toLowerCase();
        
        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            showError(elements.emailError, 'Format email tidak valid');
            return false;
        }

        // Check for personal Gmail
        if (!trimmed.endsWith(CONFIG.personalEmailDomain)) {
            showError(elements.emailError, `Gunakan Gmail pribadi (${CONFIG.personalEmailDomain})`);
            return false;
        }

        // Check for forbidden domains
        const hasForbiddenDomain = CONFIG.forbiddenDomains.some(domain => 
            trimmed.includes(domain)
        );
        
        if (hasForbiddenDomain) {
            showError(elements.emailError, 'Email kampus tidak diperbolehkan');
            return false;
        }

        clearError(elements.emailError);
        return true;
    }

    /**
     * Show error message for a field
     * @param {HTMLElement} errorElement 
     * @param {string} message 
     */
    function showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    /**
     * Clear error message for a field
     * @param {HTMLElement} errorElement 
     */
    function clearError(errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    /**
     * Clear all form errors
     */
    function clearFormErrors() {
        clearError(elements.nameError);
        clearError(elements.emailError);
    }

    /**
     * Validate entire form
     * @returns {boolean}
     */
    function validateForm() {
        clearFormErrors();
        
        const name = elements.inputName?.value || '';
        const email = elements.inputEmail?.value || '';
        
        const isNameValid = validateName(name);
        const isEmailValid = validateEmail(email);
        
        return isNameValid && isEmailValid;
    }

    // ========== MODAL HANDLING ==========

    /**
     * Show error modal with message
     * @param {string} message 
     */
    function showErrorModal(message) {
        if (elements.errorMsg) {
            elements.errorMsg.textContent = message;
        }
        if (elements.errorModal && typeof elements.errorModal.showModal === 'function') {
            elements.errorModal.showModal();
        } else {
            // Fallback for older browsers
            elements.errorModal?.classList.add('active');
        }
    }

    /**
     * Show success modal
     */
    function showSuccessModal() {
        if (elements.successModal && typeof elements.successModal.showModal === 'function') {
            elements.successModal.showModal();
        } else {
            elements.successModal?.classList.add('active');
        }
    }

    /**
     * Close all modals
     */
    function closeAllModals() {
        if (elements.errorModal) {
            if (typeof elements.errorModal.close === 'function') {
                elements.errorModal.close();
            } else {
                elements.errorModal.classList.remove('active');
            }
        }
        if (elements.successModal) {
            if (typeof elements.successModal.close === 'function') {
                elements.successModal.close();
            } else {
                elements.successModal.classList.remove('active');
            }
        }
    }

    // ========== WHATSAPP INTEGRATION ==========

    /**
     * Generate WhatsApp message and open chat
     * @param {string} name 
     * @param {string} email 
     */
    function openWhatsApp(name, email) {
        const message = `Halo kak, Saya ingin mencoba Trial Aplikasi TeachCast

📋 Data Pendaftar:
👤 Nama: ${name}
📧 Gmail: ${email}

Mohon berikan kode uniknya ya kak. Terima kasih! 🙏`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${CONFIG.whatsappPhone}?text=${encodedMessage}`;
        
        // Open in new tab with security measures
        const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            // Fallback if popup blocked
            window.location.href = whatsappUrl;
        }
    }

    /**
     * Handle form submission
     */
    function handleSubmit() {
        if (!validateForm()) {
            const firstError = elements.nameError.textContent || elements.emailError.textContent;
            showErrorModal(firstError || 'Mohon periksa kembali data Anda');
            return;
        }

        const name = elements.inputName.value.trim();
        const email = elements.inputEmail.value.trim();

        // Show success modal before redirecting
        showSuccessModal();
        
        // Small delay for better UX
        setTimeout(() => {
            openWhatsApp(name, email);
            closeAllModals();
        }, 1500);
    }

    // ========== REAL-TIME VALIDATION ==========

    /**
     * Setup real-time validation listeners
     */
    function setupRealTimeValidation() {
        // Name validation on blur
        elements.inputName?.addEventListener('blur', function() {
            if (this.value) validateName(this.value);
        });

        // Email validation on blur
        elements.inputEmail?.addEventListener('blur', function() {
            if (this.value) validateEmail(this.value);
        });

        // Clear errors on input
        elements.inputName?.addEventListener('input', () => clearError(elements.nameError));
        elements.inputEmail?.addEventListener('input', () => clearError(elements.emailError));
    }

    // ========== EVENT LISTENERS ==========

    function setupEventListeners() {
        // Navigation
        elements.btnStartRegistration?.addEventListener('click', showRegistrationForm);
        elements.btnBack?.addEventListener('click', showWelcomeSection);
        
        // Form submission
        elements.btnSubmit?.addEventListener('click', handleSubmit);
        
        // Modal close buttons
        elements.btnCloseError?.addEventListener('click', closeAllModals);
        elements.btnCloseSuccess?.addEventListener('click', () => {
            closeAllModals();
            const name = elements.inputName?.value.trim();
            const email = elements.inputEmail?.value.trim();
            if (name && email) openWhatsApp(name, email);
        });

        // Close modal on backdrop click
        elements.errorModal?.addEventListener('click', (e) => {
            if (e.target === elements.errorModal) closeAllModals();
        });
        
        elements.successModal?.addEventListener('click', (e) => {
            if (e.target === elements.successModal) {
                closeAllModals();
                const name = elements.inputName?.value.trim();
                const email = elements.inputEmail?.value.trim();
                if (name && email) openWhatsApp(name, email);
            }
        });

        // Keyboard support for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });
    }

    // ========== INITIALIZATION ==========

    function init() {
        setupRealTimeValidation();
        setupEventListeners();
        
        // Pre-fill from localStorage if available (optional enhancement)
        const savedName = localStorage.getItem('teachcast_name');
        const savedEmail = localStorage.getItem('teachcast_email');
        
        if (savedName && elements.inputName) {
            elements.inputName.value = savedName;
        }
        if (savedEmail && elements.inputEmail) {
            elements.inputEmail.value = savedEmail;
        }

        // Save to localStorage on input change (optional)
        elements.inputName?.addEventListener('change', (e) => {
            localStorage.setItem('teachcast_name', e.target.value);
        });
        elements.inputEmail?.addEventListener('change', (e) => {
            localStorage.setItem('teachcast_email', e.target.value);
        });

        console.log('✅ TeachCast Trial Page initialized');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();