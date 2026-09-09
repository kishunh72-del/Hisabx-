import "./style.css";

// Constants
const CATEGORIES = {
  "Food": "🍔",
  "Shopping": "🛒",
  "Travel": "🚗",
  "Recharge": "📱",
  "Bills": "🏠",
  "Health": "💊",
  "Education": "📚",
  "Entertainment": "🎮",
  "Work": "💼",
  "Other": "📦"
};

const DEFAULT_SETTINGS = {
  monthlyBudget: 10000,
  theme: 'light',
  language: 'en'
};

// Global State
let expenses = [];
let settings = {};
let monthlyBudgets = {};
let currentEditId = null;
let currentExpenseToDelete = null;
let currentExtraBudgetEditId = null;
let currentExtraBudgetToDelete = null;
let selectedMonthYear = "";

// i18n Translations
const TRANSLATIONS = {
  en: {
    nav_home: "Home",
    nav_analytics: "Analytics",
    nav_history: "History",
    nav_settings: "Settings",
    tab_dashboard: "Dashboard",
    title_monthly_budget: "Monthly Budget",
    title_total_spent: "Total Spent",
    title_remaining: "Remaining",
    title_today_expense: "Today's Expense",
    title_recent_expenses: "Recent Expenses",
    btn_view_all: "View All",
    tab_analytics: "Analytics",
    title_category_breakdown: "Category Breakdown",
    title_daily_trend: "Daily Trend",
    tab_history: "History",
    filter_search: "Search expenses...",
    filter_all_categories: "All Categories",
    tab_settings: "Settings",
    title_preferences: "Preferences",
    label_monthly_budget: "Monthly Budget (₹)",
    btn_save_budget: "Save",
    label_dark_mode: "Dark Mode",
    label_language: "Language",
    title_data_management: "Data Management",
    btn_export_json: "Export Data (Backup)",
    btn_export_csv: "Export Expense Report as CSV",
    btn_export_pdf: "Download PDF Report",
    btn_share_report: "Share Report",
    btn_import_data: "Import Data",
    btn_clear_data: "Clear All Data",
    modal_add_title: "Add Expense",
    label_amount: "Amount (₹) *",
    label_category: "Category *",
    select_category: "Select category",
    label_date: "Date *",
    label_note: "Note",
    btn_cancel: "Cancel",
    btn_save_expense: "Save Expense",
    modal_delete_title: "Delete Expense?",
    modal_delete_desc: "Are you sure you want to delete this expense? This action cannot be undone.",
    btn_delete: "Delete",
    toast_added: "Expense added",
    toast_updated: "Expense updated",
    toast_deleted: "Expense deleted",
    toast_budget_saved: "Budget updated successfully",
    toast_data_cleared: "All data cleared",
    empty_history: "No expenses found matching the criteria.",
    empty_recent: "No expenses yet. Add one to get started!"
  },
  hi: {
    nav_home: "होम",
    nav_analytics: "एनालिटिक्स",
    nav_history: "इतिहास",
    nav_settings: "सेटिंग्स",
    tab_dashboard: "डैशबोर्ड",
    title_monthly_budget: "मासिक बजट",
    title_total_spent: "कुल खर्च",
    title_remaining: "शेष राशि",
    title_today_expense: "आज का खर्च",
    title_recent_expenses: "हाल के खर्च",
    btn_view_all: "सभी देखें",
    tab_analytics: "एनालिटिक्स",
    title_category_breakdown: "श्रेणी विवरण",
    title_daily_trend: "दैनिक रुझान",
    tab_history: "इतिहास",
    filter_search: "खर्च खोजें...",
    filter_all_categories: "सभी श्रेणियां",
    tab_settings: "सेटिंग्स",
    title_preferences: "प्राथमिकताएं",
    label_monthly_budget: "मासिक बजट (₹)",
    btn_save_budget: "सहेजें",
    label_dark_mode: "डार्क मोड",
    label_language: "भाषा",
    title_data_management: "डेटा प्रबंधन",
    btn_export_json: "डेटा निर्यात (बैकअप)",
    btn_export_csv: "CSV के रूप में निर्यात करें",
    btn_export_pdf: "PDF रिपोर्ट डाउनलोड करें",
    btn_share_report: "रिपोर्ट साझा करें",
    btn_import_data: "डेटा आयात करें",
    btn_clear_data: "सभी डेटा मिटाएं",
    modal_add_title: "खर्च जोड़ें",
    label_amount: "राशि (₹) *",
    label_category: "श्रेणी *",
    select_category: "श्रेणी चुनें",
    label_date: "तारीख *",
    label_note: "नोट",
    btn_cancel: "रद्द करें",
    btn_save_expense: "सहेजें",
    modal_delete_title: "खर्च मिटाएं?",
    modal_delete_desc: "क्या आप वाकई इस खर्च को मिटाना चाहते हैं? यह कार्रवाई वापस नहीं ली जा सकती।",
    btn_delete: "मिटाएं",
    toast_added: "खर्च जोड़ा गया",
    toast_updated: "खर्च अपडेट किया गया",
    toast_deleted: "खर्च मिटा दिया गया",
    toast_budget_saved: "बजट सफलतापूर्वक अपडेट किया गया",
    toast_data_cleared: "सभी डेटा मिटा दिया गया",
    empty_history: "मापदंड से मेल खाने वाले कोई खर्च नहीं मिले।",
    empty_recent: "अभी तक कोई खर्च नहीं। शुरू करने के लिए एक जोड़ें!"
  }
};

function t(key) {
  const lang = settings.language || 'en';
  return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });
}

// Chart Instances
let categoryChart = null;
let monthlyChart = null;
let dailyChart = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  applyTheme();
  applyTranslations(); // Initialize language
  setupEventListeners();
  populateCategoryDropdowns();
  
  // Set default date to today in form
  document.getElementById('expense-date').valueAsDate = new Date();
  
  // Initial Render
  switchTab('dashboard');
  renderAll();

  // Onboarding Logic
  checkOnboarding();
});

function checkOnboarding() {
  const onboardingCompleted = localStorage.getItem('hisabx_onboardingCompleted');
  const obOverlay = document.getElementById('onboarding-overlay');
  
  if (onboardingCompleted === 'true') {
    obOverlay.classList.add('hidden');
  } else {
    // Show Welcome screen
    obOverlay.classList.remove('hidden');
    document.getElementById('ob-welcome').classList.remove('hidden');
    document.getElementById('ob-language').classList.add('hidden');
    document.getElementById('ob-welcome').classList.add('flex');
  }
}

// --- Data Management ---
function loadData() {
  expenses = JSON.parse(localStorage.getItem('hisabx_expenses')) || [];
  settings = JSON.parse(localStorage.getItem('hisabx_settings')) || { ...DEFAULT_SETTINGS };
  monthlyBudgets = JSON.parse(localStorage.getItem('hisabx_budgets')) || {};
  
  const now = new Date();
  selectedMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const currentBudgetObj = getBudgetForMonth(selectedMonthYear);

  document.getElementById('setting-theme').checked = settings.theme === 'dark';
  document.getElementById('setting-language').value = settings.language || 'en';
}

function saveData() {
  localStorage.setItem('hisabx_expenses', JSON.stringify(expenses));
  localStorage.setItem('hisabx_settings', JSON.stringify(settings));
  localStorage.setItem('hisabx_budgets', JSON.stringify(monthlyBudgets));
}

function getBudgetForMonth(monthStr) {
  if (!monthlyBudgets[monthStr]) {
    monthlyBudgets[monthStr] = {
      monthlyBudget: settings.monthlyBudget,
      extraBudgets: []
    };
  }
  return monthlyBudgets[monthStr];
}

// --- Formatters ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

// --- Event Listeners Setup ---
function setupEventListeners() {
  // Onboarding
  document.getElementById('btn-ob-start').addEventListener('click', () => {
    document.getElementById('ob-welcome').classList.add('hidden');
    document.getElementById('ob-welcome').classList.remove('flex');
    document.getElementById('ob-language').classList.remove('hidden');
    document.getElementById('ob-language').classList.add('flex');
  });
  
  document.getElementById('btn-ob-continue').addEventListener('click', () => {
    const lang = document.querySelector('input[name="ob-lang"]:checked').value;
    settings.language = lang;
    document.getElementById('setting-language').value = lang;
    localStorage.setItem('hisabx_onboardingCompleted', 'true');
    saveData();
    applyTranslations();
    
    const obOverlay = document.getElementById('onboarding-overlay');
    obOverlay.classList.add('opacity-0');
    setTimeout(() => {
      obOverlay.classList.add('hidden');
      obOverlay.classList.remove('opacity-0');
    }, 300);
  });

  // Navigation
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.dataset.tab;
      switchTab(tab);
    });
  });

  // Month Selector
  document.querySelectorAll('.current-month-input').forEach(input => {
    input.addEventListener('change', (e) => {
      if (e.target.value) {
        selectedMonthYear = e.target.value;
        renderAll();
      }
    });
  });

  // Add Expense Buttons
  document.getElementById('btn-add-desktop').addEventListener('click', openAddModal);
  document.getElementById('btn-add-mobile').addEventListener('click', openAddModal);
  
  // Modal Actions
  document.getElementById('btn-cancel-expense').addEventListener('click', closeAddModal);
  document.getElementById('expense-form').addEventListener('submit', handleExpenseSubmit);
  
  // Extra Budget Actions
  document.getElementById('btn-add-extra-budget').addEventListener('click', openExtraBudgetModal);
  document.getElementById('btn-cancel-eb').addEventListener('click', closeExtraBudgetModal);
  document.getElementById('extra-budget-form').addEventListener('submit', handleExtraBudgetSubmit);
  document.getElementById('btn-cancel-eb-delete').addEventListener('click', closeExtraBudgetDeleteModal);
  document.getElementById('btn-confirm-eb-delete').addEventListener('click', confirmDeleteExtraBudget);

  // Delete Modal Actions
  document.getElementById('btn-cancel-delete').addEventListener('click', closeDeleteModal);
  document.getElementById('btn-confirm-delete').addEventListener('click', confirmDeleteExpense);

  // History Filters
  document.getElementById('filter-search').addEventListener('input', renderHistory);
  document.getElementById('filter-date').addEventListener('change', renderHistory);
  document.getElementById('filter-category').addEventListener('change', renderHistory);

  // Settings
  function handleSaveBudget(inputId) {
    const newBudget = Number(document.getElementById(inputId).value);
    if (newBudget > 0) {
      const currentBudgetObj = getBudgetForMonth(selectedMonthYear);
      const prevBase = currentBudgetObj.monthlyBudget || settings.monthlyBudget;
      const totalExtra = currentBudgetObj.extraBudgets.reduce((sum, b) => sum + b.amount, 0);
      const prevTotalBudget = prevBase + totalExtra;
      const newTotalBudget = newBudget + totalExtra;
      
      const totalSpent = getCurrentMonthExpenses().reduce((sum, e) => sum + e.amount, 0);
      const prevPct = prevTotalBudget > 0 ? totalSpent / prevTotalBudget : 0;
      const newPct = newTotalBudget > 0 ? totalSpent / newTotalBudget : 0;

      settings.monthlyBudget = newBudget;
      currentBudgetObj.monthlyBudget = newBudget;
      saveData();
      renderDashboard();
      
      showToast('Budget updated successfully');
      
      checkBudgetAlert(prevPct, newPct);
    }
  }

  const btnDashSave = document.getElementById('btn-dash-save-budget');
  if (btnDashSave) {
    btnDashSave.addEventListener('click', () => handleSaveBudget('dash-setting-budget'));
  }

  document.getElementById('setting-theme').addEventListener('change', (e) => {
    settings.theme = e.target.checked ? 'dark' : 'light';
    applyTheme();
    saveData();
    renderCharts(); // Redraw charts for theme colors
  });

  document.getElementById('setting-language').addEventListener('change', (e) => {
    settings.language = e.target.value;
    saveData();
    applyTranslations();
  });

  document.getElementById('btn-export-json').addEventListener('click', exportData);
  document.getElementById('btn-export-csv').addEventListener('click', exportDataCSV);
  document.getElementById('btn-export-pdf').addEventListener('click', exportDataPDF);
  document.getElementById('btn-share-report').addEventListener('click', shareReport);
  document.getElementById('btn-import').addEventListener('change', importData);
  document.getElementById('btn-clear-data').addEventListener('click', clearAllData);

  // Analytics Tabs
  document.querySelectorAll('[data-analytics-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-analytics-tab]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      const tab = e.currentTarget.dataset.analyticsTab;
      document.getElementById('analytics-charts').classList.toggle('hidden', tab !== 'charts');
      document.getElementById('analytics-charts').classList.toggle('active', tab === 'charts');
      document.getElementById('analytics-monthly').classList.toggle('hidden', tab !== 'monthly');
      document.getElementById('analytics-monthly').classList.toggle('active', tab === 'monthly');
      
      if (tab === 'monthly') {
        populateMonthlyTrackerSelect();
        renderMonthlyTrackerStats();
      }
    });
  });

  document.getElementById('monthly-tracker-select').addEventListener('change', renderMonthlyTrackerStats);
}

function applyTheme() {
  if (settings.theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

// --- Navigation ---
function switchTab(tabId) {
  // Update Nav highlighting
  document.querySelectorAll('.nav-menu .nav-item, .bottom-nav .nav-item').forEach(btn => {
    if (btn.dataset.tab) {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    }
  });

  // Show View
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(`view-${tabId}`).classList.add('active');

  // Specific view rendering
  if (tabId === 'dashboard') renderDashboard();
  if (tabId === 'history') renderHistory();
  if (tabId === 'analytics') {
    renderCharts();
    populateMonthlyTrackerSelect();
  }
  if (tabId === 'settings') {
    // nothing required here for now
  }
}

// --- Modals ---
function openAddModal(expense = null) {
  const modal = document.getElementById('expense-modal');
  const form = document.getElementById('expense-form');
  const title = document.getElementById('modal-title');
  
  if (expense && expense.id) {
    title.textContent = 'Edit Expense';
    document.getElementById('expense-id').value = expense.id;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-category').value = expense.category;
    document.getElementById('expense-date').value = expense.date;
    document.getElementById('expense-note').value = expense.note || '';
    currentEditId = expense.id;
  } else {
    title.textContent = 'Add Expense';
    form.reset();
    document.getElementById('expense-id').value = '';
    document.getElementById('expense-date').valueAsDate = new Date();
    currentEditId = null;
  }
  
  modal.classList.remove('hidden');
}

function closeAddModal() {
  document.getElementById('expense-modal').classList.add('hidden');
  currentEditId = null;
}

function openDeleteModal(id) {
  currentExpenseToDelete = id;
  document.getElementById('confirm-modal').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('confirm-modal').classList.add('hidden');
  currentExpenseToDelete = null;
}

function populateCategoryDropdowns() {
  const expenseSelect = document.getElementById('expense-category');
  const filterSelect = document.getElementById('filter-category');
  
  let options = '';
  for (const [name, icon] of Object.entries(CATEGORIES)) {
    options += `<option value="${name}">${icon} ${name}</option>`;
  }
  
  expenseSelect.innerHTML += options;
  filterSelect.innerHTML += options;
}

// --- CRUD Operations ---
function checkBudgetAlert(prevPct, newPct) {
  if (prevPct < 1.0 && newPct >= 1.0) {
    setTimeout(() => showToast('⚠️ Alert: You have reached 100% of your monthly budget!', 'error'), 400);
  } else if (prevPct < 0.9 && newPct >= 0.9) {
    setTimeout(() => showToast('⚠️ Alert: You have reached 90% of your monthly budget!', 'error'), 400);
  } else if (prevPct < 0.8 && newPct >= 0.8) {
    setTimeout(() => showToast('⚠️ Alert: You have reached 80% of your monthly budget!', 'error'), 400);
  }
}

function handleExpenseSubmit(e) {
  e.preventDefault();
  
  const amount = Number(document.getElementById('expense-amount').value);
  const category = document.getElementById('expense-category').value;
  const date = document.getElementById('expense-date').value;
  const note = document.getElementById('expense-note').value.trim();
  
  if (amount <= 0 || !category || !date) {
    showToast('Please fill all required fields correctly', 'error');
    return;
  }
  
  const [yearStr, monthStr] = date.split('-');
  const now = new Date();
  const isCurrentMonth = parseInt(monthStr, 10) - 1 === now.getMonth() && parseInt(yearStr, 10) === now.getFullYear();
  
  let prevTotal = 0;
  if (isCurrentMonth) {
    prevTotal = getCurrentMonthExpenses().reduce((sum, e) => sum + e.amount, 0);
  }

  const expenseData = {
    id: currentEditId || Date.now().toString(),
    amount,
    category,
    date,
    note,
    createdAt: currentEditId ? expenses.find(x => x.id === currentEditId).createdAt : new Date().toISOString()
  };
  
  if (currentEditId) {
    const index = expenses.findIndex(x => x.id === currentEditId);
    expenses[index] = expenseData;
    showToast('Expense updated');
  } else {
    expenses.push(expenseData);
    showToast('Expense added');
  }
  
  if (isCurrentMonth) {
    const currentBudgetObj = getBudgetForMonth(selectedMonthYear);
    const baseBudget = currentBudgetObj.monthlyBudget || settings.monthlyBudget;
    const totalExtra = currentBudgetObj.extraBudgets.reduce((sum, b) => sum + b.amount, 0);
    const totalBudget = baseBudget + totalExtra;
    
    if (totalBudget > 0) {
      const newTotal = getCurrentMonthExpenses().reduce((sum, e) => sum + e.amount, 0);
      const prevPct = prevTotal / totalBudget;
      const newPct = newTotal / totalBudget;
      checkBudgetAlert(prevPct, newPct);
    }
  }
  
  saveData();
  closeAddModal();
  renderAll();
}

function editExpense(id) {
  const expense = expenses.find(e => e.id === id);
  if (expense) openAddModal(expense);
}

function confirmDeleteExpense() {
  if (currentExpenseToDelete) {
    expenses = expenses.filter(e => e.id !== currentExpenseToDelete);
    saveData();
    closeDeleteModal();
    renderAll();
    showToast('Expense deleted');
  }
}

// --- Extra Budget Logic ---
function openExtraBudgetModal() {
  document.getElementById('extra-budget-form').reset();
  document.getElementById('eb-date').valueAsDate = new Date();
  document.getElementById('eb-id').value = '';
  document.getElementById('eb-modal-title').textContent = 'Add Extra Budget';
  document.getElementById('extra-budget-modal').classList.remove('hidden');
}

function closeExtraBudgetModal() {
  document.getElementById('extra-budget-modal').classList.add('hidden');
  currentExtraBudgetEditId = null;
}

function editExtraBudget(id) {
  const currentBudget = getBudgetForMonth(selectedMonthYear);
  const eb = currentBudget.extraBudgets.find(b => b.id === id);
  if (!eb) return;
  
  currentExtraBudgetEditId = id;
  document.getElementById('eb-id').value = eb.id;
  document.getElementById('eb-amount').value = eb.amount;
  document.getElementById('eb-reason').value = eb.reason || '';
  document.getElementById('eb-date').value = eb.date;
  document.getElementById('eb-note').value = eb.note || '';
  
  document.getElementById('eb-modal-title').textContent = 'Edit Extra Budget';
  document.getElementById('extra-budget-modal').classList.remove('hidden');
}

function handleExtraBudgetSubmit(e) {
  e.preventDefault();
  
  const amount = Number(document.getElementById('eb-amount').value);
  const reason = document.getElementById('eb-reason').value.trim();
  const date = document.getElementById('eb-date').value;
  const note = document.getElementById('eb-note').value.trim();
  
  if (amount <= 0 || !date) {
    showToast('Please fill all required fields correctly', 'error');
    return;
  }
  
  const [yearStr, monthStr] = date.split('-');
  const ebMonthYear = `${yearStr}-${monthStr}`;
  
  const budgetObj = getBudgetForMonth(ebMonthYear);
  
  const ebData = {
    id: currentExtraBudgetEditId || Date.now().toString(),
    amount,
    reason,
    date,
    note,
    createdAt: currentExtraBudgetEditId ? budgetObj.extraBudgets.find(x => x.id === currentExtraBudgetEditId).createdAt : new Date().toISOString()
  };
  
  if (currentExtraBudgetEditId) {
    // Check if month changed
    if (ebMonthYear !== selectedMonthYear) {
       // Remove from old month
       const oldBudgetObj = getBudgetForMonth(selectedMonthYear);
       oldBudgetObj.extraBudgets = oldBudgetObj.extraBudgets.filter(x => x.id !== currentExtraBudgetEditId);
       budgetObj.extraBudgets.push(ebData);
    } else {
       const index = budgetObj.extraBudgets.findIndex(x => x.id === currentExtraBudgetEditId);
       if (index > -1) budgetObj.extraBudgets[index] = ebData;
    }
    showToast('Extra budget updated');
  } else {
    budgetObj.extraBudgets.push(ebData);
    showToast('Extra budget added');
  }
  
  saveData();
  renderAll();
  closeExtraBudgetModal();
}

function openExtraBudgetDeleteModal(id) {
  currentExtraBudgetToDelete = id;
  document.getElementById('confirm-eb-delete-modal').classList.remove('hidden');
}

function closeExtraBudgetDeleteModal() {
  document.getElementById('confirm-eb-delete-modal').classList.add('hidden');
  currentExtraBudgetToDelete = null;
}

function confirmDeleteExtraBudget() {
  if (currentExtraBudgetToDelete) {
    const budgetObj = getBudgetForMonth(selectedMonthYear);
    budgetObj.extraBudgets = budgetObj.extraBudgets.filter(x => x.id !== currentExtraBudgetToDelete);
    saveData();
    renderAll();
    showToast('Extra budget deleted');
    closeExtraBudgetDeleteModal();
  }
}

// --- Render Logic ---
function renderAll() {
  renderDashboard();
  if (document.getElementById('view-history').classList.contains('active')) renderHistory();
  if (document.getElementById('view-analytics').classList.contains('active')) {
    renderCharts();
    populateMonthlyTrackerSelect();
    renderMonthlyTrackerStats();
  }
}

function getCurrentMonthExpenses() {
  const [yearStr, monthStr] = selectedMonthYear.split('-');
  const currentYear = parseInt(yearStr, 10);
  const currentMonth = parseInt(monthStr, 10) - 1;
  
  return expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
}

function renderDashboard() {
  document.querySelectorAll('.current-month-input').forEach(input => {
    if (input.value !== selectedMonthYear) {
      input.value = selectedMonthYear;
    }
  });
  
  const currentMonthExpenses = getCurrentMonthExpenses();
  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const todaySpent = expenses.filter(e => e.date === todayStr).reduce((sum, e) => sum + e.amount, 0);
  
  const currentBudgetObj = getBudgetForMonth(selectedMonthYear);
  const baseBudget = currentBudgetObj.monthlyBudget || settings.monthlyBudget;
  const totalExtra = currentBudgetObj.extraBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalBudget = baseBudget + totalExtra;
  const remaining = totalBudget - totalSpent;
  
  const dashSettingBudget = document.getElementById('dash-setting-budget');
  if (dashSettingBudget && dashSettingBudget.value !== baseBudget.toString()) {
    dashSettingBudget.value = baseBudget;
  }
  
  document.getElementById('dash-monthly-budget').textContent = formatCurrency(baseBudget);
  document.getElementById('dash-extra-budget').textContent = formatCurrency(totalExtra);
  document.getElementById('dash-budget').textContent = formatCurrency(totalBudget);
  
  document.getElementById('dash-spent').textContent = formatCurrency(totalSpent);
  document.getElementById('dash-remaining').textContent = formatCurrency(remaining);
  document.getElementById('dash-today').textContent = formatCurrency(todaySpent);
  
  // Progress bar
  const percentUsed = Math.min((totalSpent / totalBudget) * 100, 100);
  const fill = document.getElementById('dash-progress-fill');
  fill.style.width = `${percentUsed}%`;
  
  fill.className = 'progress-bar-fill';
  const warning = document.getElementById('dash-warning');
  warning.classList.add('hidden');
  
  if (percentUsed >= 100) {
    fill.classList.add('danger');
    warning.textContent = (t('label_over_budget') || 'Over Budget') + ` by ${formatCurrency(totalSpent - totalBudget)}`;
    warning.classList.remove('hidden');
    document.getElementById('dash-progress-text').textContent = t('label_over_budget') || 'Over Budget';
    document.getElementById('dash-progress-text').className = 'text-danger font-medium';
  } else if (percentUsed >= 80) {
    fill.classList.add('warning');
    document.getElementById('dash-progress-text').textContent = `${percentUsed.toFixed(0)}% ` + (t('label_used') || 'Used') + ' (Warning)';
    document.getElementById('dash-progress-text').className = 'text-muted font-medium';
  } else if (percentUsed >= 50) {
    document.getElementById('dash-progress-text').textContent = `${percentUsed.toFixed(0)}% ` + (t('label_used') || 'Used');
    document.getElementById('dash-progress-text').className = 'text-muted';
  } else {
    document.getElementById('dash-progress-text').textContent = `${percentUsed.toFixed(0)}% ` + (t('label_used') || 'Used');
    document.getElementById('dash-progress-text').className = 'text-muted';
  }
  
  document.getElementById('dash-progress-spent').textContent = `Spent: ${formatCurrency(totalSpent)}`;
  document.getElementById('dash-progress-remaining').textContent = `Remaining: ${formatCurrency(Math.max(0, remaining))}`;

  renderInsights(currentMonthExpenses, totalSpent, totalBudget, todaySpent);
  renderExtraBudgets(currentBudgetObj.extraBudgets);
}

function renderExtraBudgets(extraBudgets) {
  const section = document.getElementById('extra-budget-section');
  const list = document.getElementById('extra-budget-list');
  const monthDisplay = document.getElementById('setting-eb-month-display');
  
  if (monthDisplay) {
    const [yearStr, monthStr] = selectedMonthYear.split('-');
    const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
    monthDisplay.textContent = dateObj.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  }

  list.innerHTML = '';
  
  if (extraBudgets.length === 0) {
    section.classList.add('hidden');
    return;
  }
  
  section.classList.remove('hidden');
  
  extraBudgets.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  extraBudgets.forEach(eb => {
    const el = document.createElement('div');
    el.className = 'expense-item border-l-4 border-l-primary pl-3 bg-surface-color p-3 rounded-lg flex justify-between items-center';
    el.innerHTML = `
      <div class="flex-1">
        <h4 class="font-semibold text-primary mb-1">+ ${formatCurrency(eb.amount)}</h4>
        <p class="text-sm font-medium mb-1">${eb.reason || 'Extra Budget'}</p>
        <p class="text-xs text-muted">${formatDate(eb.date)} ${eb.note ? '• ' + eb.note : ''}</p>
      </div>
      <div class="flex gap-2">
        <button class="icon-btn" onclick="app.editExtraBudget('${eb.id}')">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        </button>
        <button class="icon-btn danger" onclick="app.openExtraBudgetDeleteModal('${eb.id}')">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    `;
    list.appendChild(el);
  });
}

function renderInsights(monthExps, totalSpent, budget, todaySpent) {
  const list = document.getElementById('dash-insights-list');
  list.innerHTML = '';
  
  if (monthExps.length === 0) {
    list.innerHTML = `<li class="text-muted">Add more expenses to see your spending insights.</li>`;
    return;
  }

  const categoryTotals = {};
  monthExps.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  
  let topCategory = '';
  let topCatAmount = 0;
  for (const cat in categoryTotals) {
    if (categoryTotals[cat] > topCatAmount) {
      topCatAmount = categoryTotals[cat];
      topCategory = cat;
    }
  }

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const avgDaily = totalSpent / currentDay;

  const insights = [
    `You have spent <b>${formatCurrency(totalSpent)}</b> this month so far.`,
    `Your highest spending category is <b>${CATEGORIES[topCategory]} ${topCategory}</b> (${formatCurrency(topCatAmount)}).`,
    `Your average daily spending is <b>${formatCurrency(avgDaily)}</b>.`,
    todaySpent > 0 ? `You spent <b>${formatCurrency(todaySpent)}</b> today.` : 'You haven\'t spent anything today.'
  ];

  if (totalSpent > budget) {
    insights.push(`<span class="text-danger">Warning: You are over your monthly budget!</span>`);
  } else {
    insights.push(`You have <b>${formatCurrency(budget - totalSpent)}</b> remaining for the rest of the month.`);
  }

  insights.forEach(text => {
    const li = document.createElement('li');
    li.innerHTML = text;
    list.appendChild(li);
  });
}

function renderHistory() {
  const list = document.getElementById('history-list');
  const searchTerm = document.getElementById('filter-search').value.toLowerCase();
  const dateFilter = document.getElementById('filter-date').value;
  const catFilter = document.getElementById('filter-category').value;
  
  let filtered = [...expenses];
  
  // Apply Search
  if (searchTerm) {
    filtered = filtered.filter(e => 
      e.note.toLowerCase().includes(searchTerm) || 
      e.category.toLowerCase().includes(searchTerm) ||
      e.amount.toString().includes(searchTerm)
    );
  }
  
  // Apply Category
  if (catFilter !== 'all') {
    filtered = filtered.filter(e => e.category === catFilter);
  }
  
  // Apply Date Filter
  const now = new Date();
  if (dateFilter === 'today') {
    const todayStr = now.toISOString().split('T')[0];
    filtered = filtered.filter(e => e.date === todayStr);
  } else if (dateFilter === 'week') {
    const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
    filtered = filtered.filter(e => e.date >= weekAgo);
  } else if (dateFilter === 'month') {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    filtered = filtered.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }

  // Sort by date desc
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <p>${t('empty_history')}</p>
      </div>`;
    return;
  }

  list.innerHTML = '';
  filtered.forEach(exp => {
    const el = document.createElement('div');
    el.className = 'expense-item';
    el.innerHTML = `
      <div class="expense-info">
        <div class="expense-icon">${CATEGORIES[exp.category] || '📦'}</div>
        <div class="expense-details">
          <h4>${exp.category}</h4>
          <p>${exp.note || 'No note'}</p>
        </div>
      </div>
      <div class="expense-meta">
        <div class="expense-amount text-danger">- ${formatCurrency(exp.amount)}</div>
        <div class="text-xs text-muted mb-1">${formatDate(exp.date)}</div>
        <div class="expense-actions">
          <button class="icon-btn" onclick="app.editExpense('${exp.id}')">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </button>
          <button class="icon-btn danger" onclick="app.openDeleteModal('${exp.id}')">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    `;
    list.appendChild(el);
  });
}

// --- Analytics & Charts ---
function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: isDark ? '#f8fafc' : '#0f172a',
    grid: isDark ? '#1e293b' : '#f1f5f9',
    primary: isDark ? '#34d399' : '#059669',
    primaryLight: isDark ? 'rgba(5, 150, 105, 0.2)' : '#d1fae5',
    colors: [
      '#6366f1', // Indigo
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#a855f7', // Purple
      '#06b6d4', // Cyan
      '#ec4899', // Pink
      '#f97316', // Orange
      '#3b82f6', // Blue
      '#84cc16', // Lime
      '#14b8a6', // Teal
      '#64748b'  // Slate
    ]
  };
}

function renderCharts() {
  if (!document.getElementById('view-analytics').classList.contains('active')) return;
  
  const themeColors = getChartColors();
  Chart.defaults.color = themeColors.text;
  Chart.defaults.font.family = "'Inter', sans-serif";

  // Category Doughnut
  if (categoryChart) categoryChart.destroy();
  const categoryData = {};
  expenses.forEach(e => {
    categoryData[e.category] = (categoryData[e.category] || 0) + e.amount;
  });
  
  categoryChart = new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(categoryData),
      datasets: [{
        data: Object.values(categoryData),
        backgroundColor: themeColors.colors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right' } }
    }
  });

  // Monthly Bar
  if (monthlyChart) monthlyChart.destroy();
  const monthlyData = {};
  expenses.forEach(e => {
    const d = new Date(e.date);
    const m = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyData[m] = (monthlyData[m] || 0) + e.amount;
  });
  
  // Sort months chronologically roughly
  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    const [ma, ya] = a.split(' ');
    const [mb, yb] = b.split(' ');
    return new Date(`${ma} 1, 20${ya}`) - new Date(`${mb} 1, 20${yb}`);
  });

  monthlyChart = new Chart(document.getElementById('monthlyChart'), {
    type: 'bar',
    data: {
      labels: sortedMonths,
      datasets: [{
        label: 'Total Spent',
        data: sortedMonths.map(m => monthlyData[m]),
        backgroundColor: themeColors.primary,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { grid: { color: themeColors.grid }, beginAtZero: true },
        x: { grid: { display: false } }
      }
    }
  });

  // Daily Line (Current Month)
  if (dailyChart) dailyChart.destroy();
  const currentMonthExps = getCurrentMonthExpenses();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dailyData = Array(daysInMonth).fill(0);
  
  currentMonthExps.forEach(e => {
    const day = new Date(e.date).getDate();
    dailyData[day - 1] += e.amount;
  });

  dailyChart = new Chart(document.getElementById('dailyChart'), {
    type: 'line',
    data: {
      labels: Array.from({length: daysInMonth}, (_, i) => i + 1),
      datasets: [{
        label: 'Daily Spent',
        data: dailyData,
        borderColor: themeColors.primary,
        backgroundColor: themeColors.primaryLight,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { grid: { color: themeColors.grid }, beginAtZero: true },
        x: { grid: { display: false } }
      }
    }
  });
}

function populateMonthlyTrackerSelect() {
  const select = document.getElementById('monthly-tracker-select');
  const months = new Set();
  
  expenses.forEach(e => {
    const d = new Date(e.date);
    months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  });
  
  if (months.size === 0) {
    const d = new Date();
    months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  const sortedMonths = Array.from(months).sort().reverse();
  select.innerHTML = '';
  
  sortedMonths.forEach(m => {
    const [year, month] = m.split('-');
    const date = new Date(year, month - 1);
    const label = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    select.innerHTML += `<option value="${m}">${label}</option>`;
  });
}

function renderMonthlyTrackerStats() {
  const select = document.getElementById('monthly-tracker-select');
  if (!select.value) return;
  
  const [year, month] = select.value.split('-');
  const monthExps = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() == year && (d.getMonth() + 1) == month;
  });

  const total = monthExps.reduce((sum, e) => sum + e.amount, 0);
  const count = monthExps.length;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  const avg = count > 0 ? total / daysInMonth : 0;
  
  let highestExpense = null;
  const catTotals = {};
  
  monthExps.forEach(e => {
    if (!highestExpense || e.amount > highestExpense.amount) highestExpense = e;
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  
  let topCat = 'None';
  let topCatVal = 0;
  for (const c in catTotals) {
    if (catTotals[c] > topCatVal) {
      topCatVal = catTotals[c];
      topCat = c;
    }
  }

  const budgetObj = getBudgetForMonth(select.value);
  const baseBudget = budgetObj.monthlyBudget || settings.monthlyBudget;
  const totalExtra = budgetObj.extraBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalBudget = baseBudget + totalExtra;

  const grid = document.getElementById('monthly-stats-grid');
  grid.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total Spending</div>
      <div class="stat-value text-danger">${formatCurrency(total)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Budget</div>
      <div class="stat-value">${formatCurrency(totalBudget)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Transactions</div>
      <div class="stat-value">${count}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Average Daily</div>
      <div class="stat-value">${formatCurrency(avg)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Highest Category</div>
      <div class="stat-value">${CATEGORIES[topCat] || ''} ${topCat} <span class="text-sm text-muted">(${formatCurrency(topCatVal)})</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Highest Single Expense</div>
      <div class="stat-value text-sm truncate">${highestExpense ? `${highestExpense.category} - ${highestExpense.note || 'No note'} (${formatCurrency(highestExpense.amount)})` : 'None'}</div>
    </div>
  `;
}

// --- Data Management (Export/Import/Clear) ---
function exportDataPDF() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    showToast('PDF library is loading, please try again in a moment.', 'error');
    return;
  }

  const currentMonthExps = getCurrentMonthExpenses();
  const [yearStr, monthStr] = selectedMonthYear.split('-');
  const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const monthName = dateObj.toLocaleDateString('en-IN', { month: 'long' });
  const year = dateObj.getFullYear();
  const titleMonth = `${monthName}-${year}`;
  const displayMonth = `${monthName} ${year}`;
  
  if (currentMonthExps.length === 0) {
    showToast('No expenses found for the current month to generate a report.', 'error');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Helper function to format currency as Rs. to avoid unicode issues in PDF
  const formatCurrencyPDF = (amount) => {
    return 'Rs. ' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  // Data Calculations
  const currentBudgetObj = getBudgetForMonth(selectedMonthYear);
  const baseBudget = currentBudgetObj.monthlyBudget || settings.monthlyBudget;
  const totalExtra = currentBudgetObj.extraBudgets.reduce((sum, b) => sum + b.amount, 0);
  const budget = baseBudget + totalExtra;
  
  const totalSpent = currentMonthExps.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;
  const txCount = currentMonthExps.length;

  const catTotals = {};
  currentMonthExps.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const categoryArray = Object.keys(catTotals).map(k => [k, formatCurrencyPDF(catTotals[k])]);

  // Styling variables
  const primaryColor = [5, 150, 105]; // emerald-600

  // Header
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("HisabX", 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text(`Monthly Expense Report: ${displayMonth}`, 14, 30);

  // Summary Section
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Monthly Budget: ${formatCurrencyPDF(budget)}`, 14, 45);
  doc.text(`Total Expense: ${formatCurrencyPDF(totalSpent)}`, 14, 52);
  doc.text(`Remaining Budget: ${formatCurrencyPDF(remaining)}`, 14, 59);
  doc.text(`Number of Transactions: ${txCount}`, 14, 66);

  // Category-wise spending table
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text("Category-wise Spending", 14, 80);

  doc.autoTable({
    startY: 85,
    head: [['Category', 'Amount']],
    body: categoryArray,
    theme: 'grid',
    headStyles: { fillColor: primaryColor },
    styles: { fontSize: 10 },
    margin: { left: 14 }
  });

  // Expense List table
  const finalY = doc.lastAutoTable.finalY || 85;
  doc.text("Expense List", 14, finalY + 15);

  const expenseData = [...currentMonthExps].sort((a, b) => new Date(a.date) - new Date(b.date)).map(e => [
    formatDate(e.date),
    e.category,
    e.note || '-',
    formatCurrencyPDF(e.amount)
  ]);
  
  // Add total row
  expenseData.push(['', '', 'Total', formatCurrencyPDF(totalSpent)]);

  doc.autoTable({
    startY: finalY + 20,
    head: [['Date', 'Category', 'Note', 'Amount']],
    body: expenseData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    styles: { fontSize: 10 },
    margin: { left: 14 }
  });

  // Save PDF
  const fileName = `HisabX-Expense-Report-${titleMonth}.pdf`;
  doc.save(fileName);
  showToast('PDF report downloaded successfully');
}

function generateCSV() {
  if (expenses.length === 0) return null;
  let csv = 'Date,Category,Note,Amount\n';
  let total = 0;
  
  const sorted = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  sorted.forEach(e => {
    const date = e.date;
    const cat = `"${e.category}"`;
    const note = `"${(e.note || '').replace(/"/g, '""')}"`;
    const amt = e.amount;
    total += amt;
    csv += `${date},${cat},${note},${amt}\n`;
  });
  
  csv += `,,,${total}\n`; // Total row
  return csv;
}

function exportDataCSV() {
  const csv = generateCSV();
  if (!csv) {
    showToast('No expenses to export', 'error');
    return;
  }
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hisabx_report_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV report exported successfully');
}

async function shareReport() {
  const csv = generateCSV();
  if (!csv) {
    showToast('No expenses to share', 'error');
    return;
  }
  
  const fileName = `hisabx_report_${new Date().toISOString().split('T')[0]}.csv`;
  const file = new File([csv], fileName, { type: 'text/csv' });
  const shareData = {
    title: 'Hisabx Expense Report',
    text: 'Here is my expense report from Hisabx.',
  };
  
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    shareData.files = [file];
  } else {
    // Fallback: Just share a text summary if file sharing isn't supported
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    shareData.text = `Here is my expense report from Hisabx. Total spent: ${formatCurrency(total)} across ${expenses.length} transactions.`;
  }
  
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      showToast('Report shared successfully');
    } catch (err) {
      if (err.name !== 'AbortError') {
         showToast('Error sharing report', 'error');
         console.error(err);
      }
    }
  } else {
    showToast('Web Share API is not supported on this browser', 'error');
  }
}

function exportData() {
  const data = JSON.stringify({ expenses, settings, monthlyBudgets }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hisabx_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported successfully');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);
      if (data && data.expenses && Array.isArray(data.expenses)) {
        expenses = data.expenses;
        if (data.settings) settings = { ...DEFAULT_SETTINGS, ...data.settings };
        if (data.monthlyBudgets) monthlyBudgets = data.monthlyBudgets;
        
        saveData();
        renderAll();
        applyTheme();
        
        const currentBudgetObj = getBudgetForMonth(selectedMonthYear);
        document.getElementById('setting-theme').checked = settings.theme === 'dark';
        showToast('Data imported successfully');
      } else if (Array.isArray(data)) {
        // Fallback for older array-only formats
        expenses = data;
        saveData();
        renderAll();
        showToast('Data imported successfully');
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      showToast('Error importing file. Invalid format.', 'error');
    }
    // reset input so the same file can be imported again if needed
    e.target.value = '';
  };
  reader.onerror = function() {
    showToast('Error reading file.', 'error');
    e.target.value = '';
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (confirm("Are you absolutely sure you want to delete ALL your expense data? This cannot be undone.")) {
    expenses = [];
    saveData();
    renderAll();
    showToast('All data cleared');
  }
}

// --- UI Utilities ---
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  
  const icon = type === 'error' 
    ? `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    : `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    
  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Make globally available for onclick handlers in HTML
window.app = {
  switchTab,
  editExpense,
  openDeleteModal,
  editExtraBudget,
  openExtraBudgetDeleteModal
};
