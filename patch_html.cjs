const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replacements = [
  ['<span>Home</span>', '<span data-i18n="nav_home">Home</span>'],
  ['<span>Analytics</span>', '<span data-i18n="nav_analytics">Analytics</span>'],
  ['<span>History</span>', '<span data-i18n="nav_history">History</span>'],
  ['<span>Settings</span>', '<span data-i18n="nav_settings">Settings</span>'],
  ['<span class="text-xs mt-1">Home</span>', '<span class="text-xs mt-1" data-i18n="nav_home">Home</span>'],
  ['<span class="text-xs mt-1">Analytics</span>', '<span class="text-xs mt-1" data-i18n="nav_analytics">Analytics</span>'],
  ['<span class="text-xs mt-1">History</span>', '<span class="text-xs mt-1" data-i18n="nav_history">History</span>'],
  ['<span class="text-xs mt-1">Settings</span>', '<span class="text-xs mt-1" data-i18n="nav_settings">Settings</span>'],
  ['<h2 class="page-title">Dashboard</h2>', '<h2 class="page-title" data-i18n="tab_dashboard">Dashboard</h2>'],
  ['<p class="text-muted text-sm">Monthly Budget</p>', '<p class="text-muted text-sm" data-i18n="title_monthly_budget">Monthly Budget</p>'],
  ['<p class="text-muted text-sm">Total Spent</p>', '<p class="text-muted text-sm" data-i18n="title_total_spent">Total Spent</p>'],
  ['<p class="text-muted text-sm">Remaining</p>', '<p class="text-muted text-sm" data-i18n="title_remaining">Remaining</p>'],
  ['<h3 class="font-semibold text-lg">Today\'s Expense</h3>', '<h3 class="font-semibold text-lg" data-i18n="title_today_expense">Today\'s Expense</h3>'],
  ['<h3 class="font-semibold mb-4">Recent Expenses</h3>', '<h3 class="font-semibold mb-4" data-i18n="title_recent_expenses">Recent Expenses</h3>'],
  ['<button class="btn btn-outline text-sm" id="btn-view-all">View All</button>', '<button class="btn btn-outline text-sm" id="btn-view-all" data-i18n="btn_view_all">View All</button>'],
  ['<h2 class="page-title">Analytics</h2>', '<h2 class="page-title" data-i18n="tab_analytics">Analytics</h2>'],
  ['<h3 class="font-semibold mb-4 border-b pb-2">Category Breakdown</h3>', '<h3 class="font-semibold mb-4 border-b pb-2" data-i18n="title_category_breakdown">Category Breakdown</h3>'],
  ['<h3 class="font-semibold mb-4 border-b pb-2">Daily Trend</h3>', '<h3 class="font-semibold mb-4 border-b pb-2" data-i18n="title_daily_trend">Daily Trend</h3>'],
  ['<h2 class="page-title">History</h2>', '<h2 class="page-title" data-i18n="tab_history">History</h2>'],
  ['placeholder="Search expenses..."', 'placeholder="Search expenses..." data-i18n-placeholder="filter_search"'],
  ['<option value="">All Categories</option>', '<option value="" data-i18n="filter_all_categories">All Categories</option>'],
  ['<h2 class="page-title">Settings</h2>', '<h2 class="page-title" data-i18n="tab_settings">Settings</h2>'],
  ['<h3 class="font-semibold mb-4 border-b pb-2">Preferences</h3>', '<h3 class="font-semibold mb-4 border-b pb-2" data-i18n="title_preferences">Preferences</h3>'],
  ['<label class="form-label mb-1">Monthly Budget (₹)</label>', '<label class="form-label mb-1" data-i18n="label_monthly_budget">Monthly Budget (₹)</label>'],
  ['<button class="btn btn-primary" id="btn-save-budget">Save</button>', '<button class="btn btn-primary" id="btn-save-budget" data-i18n="btn_save_budget">Save</button>'],
  ['<span>Dark Mode</span>', '<span data-i18n="label_dark_mode">Dark Mode</span>'],
  ['<h3 class="font-semibold mb-4 border-b pb-2">Data Management</h3>', '<h3 class="font-semibold mb-4 border-b pb-2" data-i18n="title_data_management">Data Management</h3>'],
  ['Export Data (Backup)', '<span data-i18n="btn_export_json">Export Data (Backup)</span>'],
  ['Export Expense Report as CSV', '<span data-i18n="btn_export_csv">Export Expense Report as CSV</span>'],
  ['Download PDF Report', '<span data-i18n="btn_export_pdf">Download PDF Report</span>'],
  ['Share Report', '<span data-i18n="btn_share_report">Share Report</span>'],
  ['Import Data', '<span data-i18n="btn_import_data">Import Data</span>'],
  ['Clear All Data', '<span data-i18n="btn_clear_data">Clear All Data</span>'],
  ['<h2 id="modal-title" class="text-xl font-bold mb-4">Add Expense</h2>', '<h2 id="modal-title" class="text-xl font-bold mb-4" data-i18n="modal_add_title">Add Expense</h2>'],
  ['<label class="form-label" for="expense-amount">Amount (₹) *</label>', '<label class="form-label" for="expense-amount" data-i18n="label_amount">Amount (₹) *</label>'],
  ['<label class="form-label" for="expense-category">Category *</label>', '<label class="form-label" for="expense-category" data-i18n="label_category">Category *</label>'],
  ['<option value="" disabled selected>Select category</option>', '<option value="" disabled selected data-i18n="select_category">Select category</option>'],
  ['<label class="form-label" for="expense-date">Date *</label>', '<label class="form-label" for="expense-date" data-i18n="label_date">Date *</label>'],
  ['<label class="form-label" for="expense-note">Note</label>', '<label class="form-label" for="expense-note" data-i18n="label_note">Note</label>'],
  ['<button type="button" class="btn btn-outline flex-1" id="btn-cancel-expense">Cancel</button>', '<button type="button" class="btn btn-outline flex-1" id="btn-cancel-expense" data-i18n="btn_cancel">Cancel</button>'],
  ['<button type="submit" class="btn btn-primary flex-1" id="btn-save-expense">Save Expense</button>', '<button type="submit" class="btn btn-primary flex-1" id="btn-save-expense" data-i18n="btn_save_expense">Save Expense</button>'],
  ['<h2 class="text-xl font-bold mb-2">Delete Expense?</h2>', '<h2 class="text-xl font-bold mb-2" data-i18n="modal_delete_title">Delete Expense?</h2>'],
  ['<p class="text-muted mb-6">Are you sure you want to delete this expense? This action cannot be undone.</p>', '<p class="text-muted mb-6" data-i18n="modal_delete_desc">Are you sure you want to delete this expense? This action cannot be undone.</p>'],
  ['<button type="button" class="btn btn-outline flex-1" id="btn-cancel-delete">Cancel</button>', '<button type="button" class="btn btn-outline flex-1" id="btn-cancel-delete" data-i18n="btn_cancel">Cancel</button>'],
  ['<button type="button" class="btn btn-danger flex-1" id="btn-confirm-delete">Delete</button>', '<button type="button" class="btn btn-danger flex-1" id="btn-confirm-delete" data-i18n="btn_delete">Delete</button>']
];

for (const [search, replace] of replacements) {
  html = html.split(search).join(replace);
}

fs.writeFileSync('index.html', html);
console.log("Patched index.html with data-i18n attributes");
