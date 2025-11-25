// Comprehensive Home Page Multilingual Translation Script
// This script should be added just before the closing </script> tag in home.html

// Add translation.js if not already included
if (typeof translations === 'undefined') {
    const script = document.createElement('script');
    script.src = 'translations.js';
    document.head.appendChild(script);
}

// Language selector event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Add language selector to navbar (if not exists from leaderboard)
    setupLanguageSelector();

    // Initialize language
    updateHomeLanguage();

    // Listen for language changes
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            updateHomeLanguage();
        });
    });
});

function setupLanguageSelector() {
    // Check if language selector already exists (from leaderboard page style)
    if (document.querySelector('.language-selector')) return;

    // Find the navbar search form
    const searchForm = document.querySelector('form[role="search"]');
    if (!searchForm) return;

    // Create language selector
    const langSelector = document.createElement('div');
    langSelector.className = 'dropdown me-3';
    langSelector.innerHTML = `
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-globe"></i> <span id="current-lang">English</span>
        </button>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item language-option" href="#" data-lang="en">🇺🇸 English</a></li>
            <li><a class="dropdown-item language-option" href="#" data-lang="hi">🇮🇳 हिन्दी</a></li>
            <li><a class="dropdown-item language-option" href="#" data-lang="or">🇮🇳 ଓଡ଼ିଆ</a></li>
        </ul>
    `;

    // Insert before search form
    searchForm.parentNode.insertBefore(langSelector, searchForm);
}

function updateHomeLanguage() {
    if (typeof t !== 'function') {
        // Translations not loaded yet, try again in 100ms
        setTimeout(updateHomeLanguage, 100);
        return;
    }

    const lang = getCurrentLanguage();
    const langNames = { en: 'English', hi: 'हिन्दी', or: 'ଓଡ଼ିଆ' };

    // Update language selector
    const currentLangSpan = document.getElementById('current-lang');
    if (currentLangSpan) currentLangSpan.textContent = langNames[lang];

    // Update page title
    document.title = t('brandName').replace('🎓 ', '');

    // Update Navbar
    const navHome = document.querySelector('.nav-link[href="#"]');
    if (navHome && navHome.textContent.trim() === 'Home') navHome.textContent = t('home');

    const navLeaderboard = document.querySelector('.nav-link[href="leaderboard.html"]');
    if (navLeaderboard) navLeaderboard.textContent = t('leaderboard');

    const navRewards = document.querySelector('.nav-link[data-bs-target="#rewardsModal"]');
    if (navRewards) {
        const badge = navRewards.querySelector('.badge');
        const badgeHTML = badge ? badge.outerHTML : '';
        navRewards.innerHTML = t('rewards') + ' ' + badgeHTML;
    }

    const navTeacher = document.querySelector('.nav-link[href="teacher.html"]');
    if (navTeacher) navTeacher.textContent = t('teacher');

    const navMore = document.querySelector('.nav-link.dropdown-toggle');
    if (navMore) navMore.textContent = t('moreOptions');

    // Dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    if (dropdownItems[0]) dropdownItems[0].textContent = t('settings');
    if (dropdownItems[1]) dropdownItems[1].textContent = t('points');
    if (dropdownItems[3]) dropdownItems[3].textContent = t('accountInfo');

    const navDisabled = document.querySelector('.nav-link.disabled');
    if (navDisabled) navDisabled.textContent = t('disabled');

    // Search
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) searchInput.placeholder = t('search');

    const searchBtn = document.querySelector('form[role="search"] .btn');
    if (searchBtn) searchBtn.textContent = t('search');

    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) logoutBtn.textContent = t('logout');

    // Sidebar
    const sidebarTitle = document.querySelector('.sidebar-title');
    if (sidebarTitle) sidebarTitle.textContent = t('selectGrade');

    // Welcome Screen
    const welcomeH2 = document.querySelector('#welcome-screen h2');
    if (welcomeH2) welcomeH2.textContent = t('welcomeTitle');

    const welcomeP = document.querySelectorAll('#welcome-screen .welcome-header p');
    if (welcomeP[0]) welcomeP[0].textContent = t('welcomeSubtitle');
    if (welcomeP[1]) welcomeP[1].textContent = t('welcomeInstruction');

    // Feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards[0]) {
        featureCards[0].querySelector('h4').textContent = t('scienceFeature');
        featureCards[0].querySelector('p').textContent = t('scienceDesc');
    }
    if (featureCards[1]) {
        featureCards[1].querySelector('h4').textContent = t('mathFeature');
        featureCards[1].querySelector('p').textContent = t('mathDesc');
    }
    if (featureCards[2]) {
        featureCards[2].querySelector('h4').textContent = t('techFeature');
        featureCards[2].querySelector('p').textContent = t('techDesc');
    }
    if (featureCards[3]) {
        featureCards[3].querySelector('h4').textContent = t('engineeringFeature');
        featureCards[3].querySelector('p').textContent = t('engineeringDesc');
    }

    // Subject Selection
    const backToGrades = document.getElementById('back-to-grades');
    if (backToGrades) backToGrades.textContent = t('backToGrades');

    // Subject descriptions
    const scienceDesc = document.getElementById('science-description');
    if (scienceDesc) scienceDesc.textContent = t('scienceDescription');

    const mathDesc = document.getElementById('math-description');
    if (mathDesc) mathDesc.textContent = t('mathDescription');

    const techDesc = document.getElementById('tech-description');
    if (techDesc) techDesc.textContent = t('techDescription');

    const engDesc = document.getElementById('eng-description');
    if (engDesc) engDesc.textContent = t('engineeringDescription');

    // Subject buttons - using querySelector to get first of each class
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.textContent = t('startQuiz');
    });

    document.querySelectorAll('.flashcards-btn').forEach(btn => {
        btn.textContent = t('startFlashcards');
    });

    document.querySelectorAll('.modules-btn').forEach(btn => {
        btn.textContent = t('learnModules');
    });

    document.querySelectorAll('.crossword-btn').forEach(btn => {
        btn.textContent = t('playCrossword');
    });

    document.querySelectorAll('.chem-lab-btn').forEach(btn => {
        btn.textContent = t('virtualChemLab');
    });

    document.querySelectorAll('.shooter-btn').forEach(btn => {
        btn.textContent = t('playMathShooter');
    });

    // Quiz Screen
    const backToSubjects = document.getElementById('back-to-subjects');
    if (backToSubjects) backToSubjects.textContent = t('backToSubjects');

    const nextQuestion = document.getElementById('next-question');
    if (nextQuestion) nextQuestion.textContent = t('nextQuestion');

    const submitQuiz = document.getElementById('submit-quiz');
    if (submitQuiz) submitQuiz.textContent = t('submitQuiz');

    // Results Screen
    const retryQuiz = document.getElementById('retry-quiz');
    if (retryQuiz) retryQuiz.textContent = t('retryQuiz');

    const newSubject = document.getElementById('new-subject');
    if (newSubject) newSubject.textContent = t('tryDifferentSubject');

    const newGrade = document.getElementById('new-grade');
    if (newGrade) newGrade.textContent = t('chooseDifferentGrade');

    // Flashcards
    const backFromFlashcards = document.getElementById('back-to-subjects-from-flashcards');
    if (backFromFlashcards) backFromFlashcards.textContent = t('backToSubjects');

    const flipCard = document.getElementById('flip-card');
    if (flipCard) flipCard.textContent = t('flip');

    const prevCard = document.getElementById('prev-card');
    if (prevCard) prevCard.textContent = t('prev');

    const nextCard = document.getElementById('next-card');
    if (nextCard) nextContent = t('next');

    // Math Shooter
    const backFromShooter = document.getElementById('back-to-subjects-from-shooter');
    if (backFromShooter) backFromShooter.textContent = t('backToSubjects');

    const controlHint = document.querySelector('.control-hint');
    if (controlHint) controlHint.textContent = t('controlHint');

    // Crossword
    const backFromCrossword = document.getElementById('back-to-subjects-from-crossword');
    if (backFromCrossword) backFromCrossword.textContent = t('backToSubjects');

    const crosswordCheck = document.getElementById('crossword-check');
    if (crosswordCheck) crosswordCheck.textContent = t('checkAnswers');

    // Chemistry Lab
    const backFromChem = document.getElementById('back-to-subjects-from-chem');
    if (backFromChem) backFromChem.textContent = t('backToSubjects');

    const chemMix = document.getElementById('chem-mix');
    if (chemMix) chemMix.textContent = t('mix');

    const chemClear = document.getElementById('chem-clear');
    if (chemClear) chemClear.textContent = t('clear');

    // Modules
    const backToModules = document.getElementById('back-to-modules');
    if (backToModules) backToModules.textContent = t('backToModules');

    const backFromModules = document.getElementById('back-to-subjects-from-modules');
    if (backFromModules) backFromModules.textContent = t('backToSubjects');

    const moduleQuizBtn = document.getElementById('module-quiz-btn');
    if (moduleQuizBtn) moduleQuizBtn.textContent = t('takeQuiz');

    const prevSection = document.getElementById('prev-section');
    if (prevSection) prevSection.textContent = t('previous');

    const nextSection = document.getElementById('next-section');
    if (nextSection) nextSection.textContent = t('next');

    // Rewards Modal
    const modalTitle = document.querySelector('#rewardsModal .modal-title');
    if (modalTitle) modalTitle.textContent = t('rewardsUnlocks');

    const modalClose = document.querySelector('#rewardsModal .btn-secondary');
    if (modalClose) modalClose.textContent = t('close');
}
