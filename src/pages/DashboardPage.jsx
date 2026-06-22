import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  BarChart3,
  FileDown,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  PieChart,
  Plus,
  Target,
  Trash2,
  UserCircle2,
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 8;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState({ title: "", amount: "", category: "General" });
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
    [expenses]
  );

  const monthlyIncome = useMemo(() => {
    if (totalExpenses === 0) return 12000;
    return Math.max(12000, Math.round(totalExpenses * 1.35));
  }, [totalExpenses]);

  const savingsRate = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    const value = ((monthlyIncome - totalExpenses) / monthlyIncome) * 100;
    return Math.max(0, Math.min(100, value));
  }, [monthlyIncome, totalExpenses]);

  const categoryData = useMemo(() => {
    const colorMap = {
      Food: "#f15b81",
      Transport: "#4aa8f1",
      Housing: "#f1c653",
      Entertainment: "#57b6b8",
      Shopping: "#9b82f3",
      Bills: "#8ab56a",
      General: "#8f9aa7",
    };

    const grouped = expenses.reduce((acc, item) => {
      const key = item.category || "General";
      acc[key] = (acc[key] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    const entries = Object.entries(grouped).map(([category, amount]) => ({
      category,
      amount,
      color: colorMap[category] || "#8f9aa7",
    }));

    if (entries.length > 0) return entries.sort((a, b) => b.amount - a.amount);

    return [
      { category: "Housing", amount: 6200, color: colorMap.Housing },
      { category: "Food", amount: 2400, color: colorMap.Food },
      { category: "Entertainment", amount: 1200, color: colorMap.Entertainment },
      { category: "Transport", amount: 600, color: colorMap.Transport },
      { category: "Shopping", amount: 400, color: colorMap.Shopping },
    ];
  }, [expenses]);

  const donutStyle = useMemo(() => {
    const chartTotal = categoryData.reduce((sum, item) => sum + item.amount, 0);
    if (chartTotal <= 0) {
      return { background: "conic-gradient(#d7dee8 0deg 360deg)" };
    }

    let current = 0;
    const segments = categoryData.map((item) => {
      const start = current;
      const span = (item.amount / chartTotal) * 360;
      current += span;
      return `${item.color} ${start.toFixed(2)}deg ${current.toFixed(2)}deg`;
    });

    return { background: `conic-gradient(${segments.join(", ")})` };
  }, [categoryData]);

  useEffect(() => {
    if (!toast.show) return undefined;
    const timer = setTimeout(() => {
      setToast((previous) => ({ ...previous, show: false }));
    }, 2600);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const fetchExpenses = async (targetPage, targetSearch) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/expenses", {
        params: {
          page: targetPage,
          limit: PAGE_SIZE,
          search: targetSearch,
        },
      });
      setExpenses(response.data);
      setHasMore(response.data.length === PAGE_SIZE);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchExpenses(page, search);
    }, 220);
    return () => clearTimeout(debounce);
  }, [page, search]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onAddExpense = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
      };
      const response = await api.post("/expenses", payload);
      setPage(1);
      setSearch("");
      await fetchExpenses(1, "");
      setForm({ title: "", amount: "", category: "General" });
      setToast({ show: true, message: `Added ${response.data.title}`, type: "success" });
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Could not add expense";
      setError(message);
      setToast({ show: true, message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!pendingDelete) return;
    setError("");
    try {
      await api.delete(`/expenses/${pendingDelete._id}`);
      setPendingDelete(null);
      await fetchExpenses(page, search);
      setToast({ show: true, message: "Expense deleted", type: "success" });
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Could not delete expense";
      setError(message);
      setToast({ show: true, message, type: "error" });
    }
  };

  const onLogout = () => {
    setConfirmLogoutOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const onExportData = () => {
    const payload = JSON.stringify(expenses, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expenses-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const monthLabel = new Date().toLocaleString("en-US", { month: "short", day: "numeric" });
  const barMax = Math.max(monthlyIncome, totalExpenses, 1);
  const incomeHeight = Math.max(8, (monthlyIncome / barMax) * 100);
  const expenseHeight = Math.max(8, (totalExpenses / barMax) * 100);
  const budgetDelta = monthlyIncome - totalExpenses;
  const overBudget = budgetDelta < 0;

  return (
    <main className="finance-layout">
      <aside className="finance-sidebar">
        <div className="profile-card">
          <div className="profile-avatar">
            <UserCircle2 size={44} />
          </div>
          <p>Welcome!</p>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          <button type="button" className="sidebar-link active">
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button type="button" className="sidebar-link">
            <ArrowLeftRight size={16} /> Transactions
          </button>
          <button type="button" className="sidebar-link">
            <PieChart size={16} /> Budgets
          </button>
          <button type="button" className="sidebar-link">
            <BarChart3 size={16} /> Reports
          </button>
          <button type="button" className="sidebar-link">
            <Target size={16} /> Savings Goals
          </button>
        </nav>

        <button type="button" className="sidebar-export" onClick={onExportData}>
          <FileDown size={15} /> Export Data
        </button>

        <button type="button" className="sidebar-logout" onClick={() => setConfirmLogoutOpen(true)}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <section className="finance-main">
        <section className="stats-grid">
          <article className="stat-card">
            <p>Total Balance</p>
            <h2>₹ {(monthlyIncome - totalExpenses).toLocaleString("en-IN")}</h2>
            <small>After this month expenses</small>
          </article>
          <article className="stat-card">
            <p>Monthly Income</p>
            <h2 className="income">₹ {monthlyIncome.toLocaleString("en-IN")}</h2>
            <small>This month</small>
          </article>
          <article className="stat-card">
            <p>Monthly Expenses</p>
            <h2 className="expense">₹ {totalExpenses.toLocaleString("en-IN")}</h2>
            <small>This month</small>
          </article>
          <article className="stat-card">
            <p>Savings Rate</p>
            <h2>{savingsRate.toFixed(1)}%</h2>
            <small>% of income</small>
          </article>
        </section>

        <section className="chart-grid">
          <article className="panel chart-panel">
            <h3>Spending by Category</h3>
            <div className="donut-wrap">
              <div className="donut-chart" style={donutStyle} aria-label="Spending by category chart">
                <span>₹ {Math.round(totalExpenses).toLocaleString("en-IN")}</span>
              </div>
              <ul className="donut-legend">
                {categoryData.map((item) => (
                  <li key={item.category}>
                    <span className="dot" style={{ background: item.color }} />
                    <span>{item.category}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="panel chart-panel">
            <h3>Monthly Expense Overview</h3>
            <div className="bar-wrap" aria-label="Monthly income vs expenses bar chart">
              <div className="bars">
                <div className="bar-col">
                  <div className="bar income-bar" style={{ height: `${incomeHeight}%` }} />
                  <span>Income</span>
                </div>
                <div className="bar-col">
                  <div className="bar expense-bar" style={{ height: `${expenseHeight}%` }} />
                  <span>Expenses</span>
                </div>
              </div>
              <p className="bar-month">{monthLabel}</p>
              <div className="monthly-overview-stats">
                <p className={`budget-chip ${overBudget ? "danger" : "safe"}`}>
                  {overBudget ? "Over budget" : "Within budget"}
                </p>
                <p className="overview-note">
                  Difference: ₹ {Math.abs(Math.round(budgetDelta)).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="work-grid">
          <article className="panel">
            <h3>Add Expense</h3>
            <form className="expense-form" onSubmit={onAddExpense}>
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Groceries"
                  required
                />
              </label>

              <label>
                Amount
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  name="amount"
                  value={form.amount}
                  onChange={onChange}
                  placeholder="1000"
                  required
                />
              </label>

              <label>
                Category
                <select name="category" value={form.category} onChange={onChange}>
                  <option>General</option>
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Shopping</option>
                  <option>Bills</option>
                </select>
              </label>

              {error ? <p className="form-error">{error}</p> : null}

              <button type="submit" className="btn-primary" disabled={submitting}>
                <Plus size={18} />
                {submitting ? "Adding..." : "Add Expense"}
              </button>
            </form>
          </article>

          <article className="panel">
            <div className="panel-head">
              <h3>Recent Expenses</h3>
              <div className="list-tools">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event.target.value);
                  }}
                  placeholder="Search by title"
                  aria-label="Search expenses"
                />
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  aria-label="Filter by category"
                >
                  <option value="All">All categories</option>
                  <option value="General">General</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="muted">Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p className="muted">No expenses yet. Add your first item.</p>
            ) : (
              <>
                <ul className="expense-list">
                  {expenses
                    .filter((expense) => categoryFilter === "All" || expense.category === categoryFilter)
                    .map((expense) => (
                      <li key={expense._id}>
                        <div>
                          <p className="expense-title">{expense.title}</p>
                          <p className="muted">{expense.category}</p>
                        </div>
                        <div className="expense-actions">
                          <p className="expense-amount">
                            <IndianRupee size={14} /> {Number(expense.amount).toLocaleString("en-IN")}
                          </p>
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() => setPendingDelete(expense)}
                            aria-label={`Delete ${expense.title}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>

                <div className="pagination-row">
                  <button
                    type="button"
                    className="btn-ghost"
                    disabled={page === 1 || loading}
                    onClick={() => setPage((previous) => Math.max(previous - 1, 1))}
                  >
                    Previous
                  </button>
                  <p className="muted">Page {page}</p>
                  <button
                    type="button"
                    className="btn-ghost"
                    disabled={!hasMore || loading}
                    onClick={() => setPage((previous) => previous + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </article>
        </section>
      </section>

      {toast.show ? <div className={`toast ${toast.type}`}>{toast.message}</div> : null}

      {pendingDelete ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setPendingDelete(null)}>
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm delete"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Delete expense?</h3>
            <p>
              This will permanently remove <strong>{pendingDelete.title}</strong>.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setPendingDelete(null)}>
                Cancel
              </button>
              <button type="button" className="btn-danger" onClick={onConfirmDelete}>
                Delete
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {confirmLogoutOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setConfirmLogoutOpen(false)}>
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm logout"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Log out now?</h3>
            <p>Your current session will end and you will return to login.</p>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setConfirmLogoutOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn-danger" onClick={onLogout}>
                Logout
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
