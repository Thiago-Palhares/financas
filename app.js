const STORAGE_KEYS = {
  users: "financas-ai-users",
  session: "financas-ai-session",
  theme: "financas-ai-theme",
  transactionsPrefix: "financas-ai-transactions:",
};

const DEMO_USER = {
  name: "Thiago",
  username: "thiago@financas.ai",
  password: "123456",
};

const seedTransactions = [
  {
    id: "seed-1",
    type: "income",
    status: "paid",
    description: "Salário",
    amount: 5200,
    date: getDateWithOffset(-8),
    category: "Trabalho",
    notes: "Entrada mensal",
  },
  {
    id: "seed-2",
    type: "expense",
    status: "paid",
    description: "Mercado",
    amount: 426.9,
    date: getDateWithOffset(-3),
    category: "Alimentação",
    notes: "Compra da semana",
  },
  {
    id: "seed-3",
    type: "expense",
    status: "paid",
    description: "Internet",
    amount: 119.9,
    date: getDateWithOffset(-2),
    category: "Moradia",
    notes: "",
  },
  {
    id: "seed-4",
    type: "expense",
    status: "planned",
    description: "Aluguel",
    amount: 1300,
    date: getDateWithOffset(6),
    category: "Moradia",
    notes: "Vencimento do mês",
  },
  {
    id: "seed-5",
    type: "expense",
    status: "planned",
    description: "Cartão de crédito",
    amount: 890,
    date: getDateWithOffset(12),
    category: "Outros",
    notes: "Fatura prevista",
  },
];

const elements = {
  authScreen: document.querySelector("#auth-screen"),
  financeApp: document.querySelector("#finance-app"),
  authForm: document.querySelector("#auth-form"),
  loginUsername: document.querySelector("#login-username"),
  loginPassword: document.querySelector("#login-password"),
  authFeedback: document.querySelector("#auth-feedback"),
  createAccountButton: document.querySelector("#create-account-button"),
  useDemoButton: document.querySelector("#use-demo-button"),
  currentUserLabel: document.querySelector("#current-user-label"),
  logoutButton: document.querySelector("#logout-button"),
  exportButton: document.querySelector("#export-button"),
  themeToggleButton: document.querySelector("#theme-toggle-button"),
  pageTitle: document.querySelector("#page-title"),
  navTabs: document.querySelectorAll(".nav-tab"),
  panels: document.querySelectorAll(".tab-panel"),
  goTabButtons: document.querySelectorAll("[data-go-tab]"),
  currentBalance: document.querySelector("#current-balance"),
  monthIncome: document.querySelector("#month-income"),
  monthExpense: document.querySelector("#month-expense"),
  projectedBalance: document.querySelector("#projected-balance"),
  heroProjectedBalance: document.querySelector("#hero-projected-balance"),
  upcomingList: document.querySelector("#upcoming-list"),
  categoryList: document.querySelector("#category-list"),
  recentTransactions: document.querySelector("#recent-transactions"),
  transactionsTable: document.querySelector("#transactions-table"),
  emptyTransactions: document.querySelector("#empty-transactions"),
  filterType: document.querySelector("#filter-type"),
  filterStatus: document.querySelector("#filter-status"),
  transactionForm: document.querySelector("#transaction-form"),
  transactionType: document.querySelector("#transaction-type"),
  transactionStatus: document.querySelector("#transaction-status"),
  transactionDescription: document.querySelector("#transaction-description"),
  transactionAmount: document.querySelector("#transaction-amount"),
  transactionDate: document.querySelector("#transaction-date"),
  transactionCategory: document.querySelector("#transaction-category"),
  transactionNotes: document.querySelector("#transaction-notes"),
  transactionFeedback: document.querySelector("#transaction-feedback"),
};

let currentUser = null;
let transactions = [];

initializeApp();

function initializeApp() {
  applySavedTheme();
  ensureDemoUser();
  elements.transactionDate.value = getDateWithOffset(0);

  const savedSession = localStorage.getItem(STORAGE_KEYS.session);
  if (savedSession) {
    const users = getUsers();
    currentUser = users.find((user) => user.username === savedSession) || null;
  }

  bindEvents();

  if (currentUser) {
    showFinanceApp();
  } else {
    showAuthScreen();
  }
}

function bindEvents() {
  elements.authForm.addEventListener("submit", handleLogin);
  elements.createAccountButton.addEventListener("click", handleCreateAccount);
  elements.useDemoButton.addEventListener("click", fillDemoCredentials);
  elements.logoutButton.addEventListener("click", handleLogout);
  elements.exportButton.addEventListener("click", exportCsv);
  elements.themeToggleButton.addEventListener("click", toggleTheme);
  elements.filterType.addEventListener("change", renderTransactionsTable);
  elements.filterStatus.addEventListener("change", renderTransactionsTable);
  elements.transactionForm.addEventListener("submit", handleTransactionSubmit);

  elements.navTabs.forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.tab));
  });

  elements.goTabButtons.forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.goTab));
  });

  elements.transactionsTable.addEventListener("click", handleTableAction);
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || "dark";
  setTheme(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.dataset.theme || "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  if (elements.themeToggleButton) {
    elements.themeToggleButton.textContent = theme === "dark" ? "Tema claro" : "Tema escuro";
  }
}

function handleLogin(event) {
  event.preventDefault();
  const username = elements.loginUsername.value.trim().toLowerCase();
  const password = elements.loginPassword.value;
  const users = getUsers();
  const foundUser = users.find(
    (user) => user.username === username && user.password === password,
  );

  if (!foundUser) {
    showAuthFeedback("Usuário ou senha inválidos. Tente a conta demo ou crie uma conta local.");
    return;
  }

  currentUser = foundUser;
  localStorage.setItem(STORAGE_KEYS.session, foundUser.username);
  showFinanceApp();
}

function handleCreateAccount() {
  const username = elements.loginUsername.value.trim().toLowerCase();
  const password = elements.loginPassword.value.trim();

  if (!username || !password) {
    showAuthFeedback("Informe um usuário/e-mail e uma senha para criar a conta.");
    return;
  }

  if (password.length < 4) {
    showAuthFeedback("Use uma senha com pelo menos 4 caracteres para este protótipo.");
    return;
  }

  const users = getUsers();
  const alreadyExists = users.some((user) => user.username === username);

  if (alreadyExists) {
    showAuthFeedback("Esse usuário já existe. Faça login ou escolha outro usuário.");
    return;
  }

  const newUser = {
    name: getDisplayName(username),
    username,
    password,
  };

  users.push(newUser);
  saveUsers(users);
  currentUser = newUser;
  localStorage.setItem(STORAGE_KEYS.session, newUser.username);
  initializeUserTransactions(newUser.username);
  showFinanceApp();
}

function fillDemoCredentials() {
  elements.loginUsername.value = DEMO_USER.username;
  elements.loginPassword.value = DEMO_USER.password;
  showAuthFeedback("");
}

function handleLogout() {
  currentUser = null;
  transactions = [];
  localStorage.removeItem(STORAGE_KEYS.session);
  elements.loginPassword.value = "";
  showAuthScreen();
}

function handleTransactionSubmit(event) {
  event.preventDefault();

  const amount = Number(elements.transactionAmount.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    elements.transactionFeedback.textContent = "Informe um valor maior que zero.";
    return;
  }

  const transaction = {
    id: createId(),
    type: elements.transactionType.value,
    status: elements.transactionStatus.value,
    description: elements.transactionDescription.value.trim(),
    amount,
    date: elements.transactionDate.value,
    category: elements.transactionCategory.value,
    notes: elements.transactionNotes.value.trim(),
  };

  transactions.unshift(transaction);
  saveTransactions();
  elements.transactionForm.reset();
  elements.transactionDate.value = getDateWithOffset(0);
  elements.transactionFeedback.textContent = "Lançamento salvo com sucesso.";
  setTimeout(() => {
    elements.transactionFeedback.textContent = "";
  }, 2600);
  renderAll();
}

function handleTableAction(event) {
  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) {
    return;
  }

  const transactionId = actionButton.dataset.id;
  const action = actionButton.dataset.action;

  if (action === "toggle-status") {
    transactions = transactions.map((transaction) => {
      if (transaction.id !== transactionId) {
        return transaction;
      }

      return {
        ...transaction,
        status: transaction.status === "paid" ? "planned" : "paid",
      };
    });
  }

  if (action === "delete") {
    const transaction = transactions.find((item) => item.id === transactionId);
    const shouldDelete = window.confirm(`Remover "${transaction?.description || "lançamento"}"?`);
    if (!shouldDelete) {
      return;
    }

    transactions = transactions.filter((item) => item.id !== transactionId);
  }

  saveTransactions();
  renderAll();
}

function showAuthScreen() {
  elements.financeApp.classList.add("hidden");
  elements.authScreen.classList.remove("hidden");
  showAuthFeedback("");
}

function showFinanceApp() {
  elements.authScreen.classList.add("hidden");
  elements.financeApp.classList.remove("hidden");
  elements.currentUserLabel.textContent = currentUser.name;
  transactions = getTransactions();
  activateTab("dashboard");
  renderAll();
}

function activateTab(tabName) {
  const titles = {
    dashboard: "Dashboard financeiro",
    transactions: "Extrato financeiro",
    "add-expense": "Adicionar gastos",
  };

  elements.navTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  elements.panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${tabName}-panel`);
  });

  elements.pageTitle.textContent = titles[tabName] || "Finanças AI";
}

function renderAll() {
  renderMetrics();
  renderUpcomingList();
  renderCategoryList();
  renderRecentTransactions();
  renderTransactionsTable();
}

function renderMetrics() {
  const currentBalance = transactions
    .filter((transaction) => transaction.status === "paid")
    .reduce((total, transaction) => total + getSignedAmount(transaction), 0);

  const projectedBalance = transactions.reduce(
    (total, transaction) => total + getSignedAmount(transaction),
    0,
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthTransactions = transactions.filter((transaction) => {
    const transactionDate = parseLocalDate(transaction.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const monthIncome = monthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const monthExpense = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  elements.currentBalance.textContent = formatCurrency(currentBalance);
  elements.projectedBalance.textContent = formatCurrency(projectedBalance);
  elements.heroProjectedBalance.textContent = formatCurrency(projectedBalance || 8420);
  elements.monthIncome.textContent = formatCurrency(monthIncome);
  elements.monthExpense.textContent = formatCurrency(monthExpense);
}

function renderUpcomingList() {
  const upcomingTransactions = transactions
    .filter((transaction) => transaction.status === "planned")
    .sort((first, second) => first.date.localeCompare(second.date))
    .slice(0, 5);

  if (!upcomingTransactions.length) {
    elements.upcomingList.innerHTML = getEmptyListMarkup(
      "Nada previsto por enquanto",
      "Adicione gastos futuros para planejar o saldo.",
    );
    return;
  }

  elements.upcomingList.innerHTML = upcomingTransactions
    .map(
      (transaction) => `
        <div class="list-item">
          <div>
            <strong>${escapeHtml(transaction.description)}</strong>
            <div class="meta">${formatDate(transaction.date)} • ${escapeHtml(transaction.category)}</div>
          </div>
          <span class="amount ${transaction.type}">${formatSignedCurrency(transaction)}</span>
        </div>
      `,
    )
    .join("");
}

function renderCategoryList() {
  const expenses = transactions.filter((transaction) => transaction.type === "expense");
  const totalExpenses = expenses.reduce((total, transaction) => total + transaction.amount, 0);
  const totalsByCategory = expenses.reduce((summary, transaction) => {
    summary[transaction.category] = (summary[transaction.category] || 0) + transaction.amount;
    return summary;
  }, {});

  const sortedCategories = Object.entries(totalsByCategory)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 6);

  if (!sortedCategories.length) {
    elements.categoryList.innerHTML = getEmptyListMarkup(
      "Sem gastos cadastrados",
      "As categorias aparecem conforme você registra despesas.",
    );
    return;
  }

  elements.categoryList.innerHTML = sortedCategories
    .map(([category, amount]) => {
      const percent = totalExpenses ? Math.round((amount / totalExpenses) * 100) : 0;
      return `
        <div class="list-item">
          <div>
            <strong>${escapeHtml(category)}</strong>
            <div class="progress-track" aria-label="${percent}% dos gastos">
              <div class="progress-bar" style="width: ${percent}%"></div>
            </div>
          </div>
          <span class="amount expense">${formatCurrency(amount)}</span>
        </div>
      `;
    })
    .join("");
}

function renderRecentTransactions() {
  const recentTransactions = [...transactions]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 6);

  elements.recentTransactions.innerHTML = recentTransactions.length
    ? recentTransactions.map(getRecentTransactionRow).join("")
    : `<tr><td colspan="5">Nenhum lançamento ainda.</td></tr>`;
}

function renderTransactionsTable() {
  const typeFilter = elements.filterType.value;
  const statusFilter = elements.filterStatus.value;
  const filteredTransactions = transactions
    .filter((transaction) => typeFilter === "all" || transaction.type === typeFilter)
    .filter((transaction) => statusFilter === "all" || transaction.status === statusFilter)
    .sort((first, second) => second.date.localeCompare(first.date));

  elements.emptyTransactions.classList.toggle("hidden", filteredTransactions.length > 0);
  elements.transactionsTable.innerHTML = filteredTransactions.map(getTransactionRow).join("");
}

function getRecentTransactionRow(transaction) {
  return `
    <tr>
      <td data-label="Data">${formatDate(transaction.date)}</td>
      <td data-label="Descrição">${escapeHtml(transaction.description)}</td>
      <td data-label="Categoria">${escapeHtml(transaction.category)}</td>
      <td data-label="Status">${getStatusBadge(transaction.status)}</td>
      <td data-label="Valor" class="amount ${transaction.type}">${formatSignedCurrency(transaction)}</td>
    </tr>
  `;
}

function getTransactionRow(transaction) {
  const toggleLabel = transaction.status === "paid" ? "Marcar futuro" : "Marcar realizado";

  return `
    <tr>
      <td data-label="Data">${formatDate(transaction.date)}</td>
      <td data-label="Descrição">
        <strong>${escapeHtml(transaction.description)}</strong>
        ${transaction.notes ? `<div class="meta">${escapeHtml(transaction.notes)}</div>` : ""}
      </td>
      <td data-label="Tipo">${getTypeBadge(transaction.type)}</td>
      <td data-label="Categoria">${escapeHtml(transaction.category)}</td>
      <td data-label="Status">${getStatusBadge(transaction.status)}</td>
      <td data-label="Valor" class="amount ${transaction.type}">${formatSignedCurrency(transaction)}</td>
      <td data-label="Ações">
        <div class="row-actions">
          <button data-action="toggle-status" data-id="${transaction.id}" type="button">${toggleLabel}</button>
          <button data-action="delete" data-id="${transaction.id}" type="button">Excluir</button>
        </div>
      </td>
    </tr>
  `;
}

function exportCsv() {
  if (!transactions.length) {
    window.alert("Ainda não há lançamentos para exportar.");
    return;
  }

  const header = ["data", "descricao", "tipo", "categoria", "status", "valor", "observacao"];
  const rows = transactions.map((transaction) => [
    transaction.date,
    transaction.description,
    getTypeLabel(transaction.type),
    transaction.category,
    getStatusLabel(transaction.status),
    transaction.amount.toFixed(2).replace(".", ","),
    transaction.notes,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(";"))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = `extrato-financas-ai-${getDateWithOffset(0)}.csv`;
  downloadLink.click();
  URL.revokeObjectURL(downloadUrl);
}

function ensureDemoUser() {
  const users = getUsers();
  const hasDemoUser = users.some((user) => user.username === DEMO_USER.username);

  if (!hasDemoUser) {
    users.push(DEMO_USER);
    saveUsers(users);
  }

  initializeUserTransactions(DEMO_USER.username);
}

function initializeUserTransactions(username) {
  const transactionKey = getTransactionKey(username);
  const savedTransactions = localStorage.getItem(transactionKey);

  if (!savedTransactions) {
    localStorage.setItem(transactionKey, JSON.stringify(seedTransactions));
  }
}

function getUsers() {
  const savedUsers = localStorage.getItem(STORAGE_KEYS.users);
  return savedUsers ? JSON.parse(savedUsers) : [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function getTransactions() {
  initializeUserTransactions(currentUser.username);
  const savedTransactions = localStorage.getItem(getTransactionKey(currentUser.username));
  return savedTransactions ? JSON.parse(savedTransactions) : [];
}

function saveTransactions() {
  localStorage.setItem(getTransactionKey(currentUser.username), JSON.stringify(transactions));
}

function getTransactionKey(username) {
  return `${STORAGE_KEYS.transactionsPrefix}${username}`;
}

function showAuthFeedback(message) {
  elements.authFeedback.textContent = message;
}

function getSignedAmount(transaction) {
  return transaction.type === "income" ? transaction.amount : -transaction.amount;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatSignedCurrency(transaction) {
  const sign = transaction.type === "income" ? "+" : "-";
  return `${sign} ${formatCurrency(transaction.amount)}`;
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parseLocalDate(dateValue));
}

function parseLocalDate(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getDateWithOffset(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStatusBadge(status) {
  return `<span class="status-pill ${status}">${getStatusLabel(status)}</span>`;
}

function getTypeBadge(type) {
  return `<span class="type-pill ${type}">${getTypeLabel(type)}</span>`;
}

function getStatusLabel(status) {
  return status === "paid" ? "Realizado" : "Futuro";
}

function getTypeLabel(type) {
  return type === "income" ? "Entrada" : "Gasto";
}

function getDisplayName(username) {
  const namePart = username.split("@")[0] || "Usuário";
  return namePart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getEmptyListMarkup(title, subtitle) {
  return `
    <div class="empty-state">
      <strong>${title}</strong>
      <span>${subtitle}</span>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
