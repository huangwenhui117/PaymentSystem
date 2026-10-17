import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Download,
  Ellipsis,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

type PaymentStatus = "Completed" | "Pending" | "Failed";
type Payment = {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  description: string;
  date: string;
  amount: number;
  status: PaymentStatus;
};

const chartBars = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 53 },
  { day: "Thu", value: 78 },
  { day: "Fri", value: 59 },
  { day: "Sat", value: 88 },
  { day: "Sun", value: 70 },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);

const formatPaymentDate = (value: string) => {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const day = date.toLocaleDateString();
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (day === today.toLocaleDateString()) return `Today, ${time}`;
  if (day === yesterday.toLocaleDateString()) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, ${time}`;
};

function App() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<"All payments" | PaymentStatus>("All payments");
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/payments")
      .then((response) => {
        if (!response.ok) throw new Error("The server could not load transactions.");
        return response.json() as Promise<Payment[]>;
      })
      .then((data) => {
        if (!cancelled) setPayments(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "Unable to load transactions.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPayments = useMemo(() => payments.filter((payment) => {
    const matchesStatus = filter === "All payments" || payment.status === filter;
    const searchText = `${payment.name} ${payment.email} ${payment.id} ${payment.description}`.toLowerCase();
    return matchesStatus && searchText.includes(query.toLowerCase());
  }), [filter, payments, query]);

  async function addPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const description = String(formData.get("description")).trim();
    const amount = Number(formData.get("amount"));
    if (!name || !email || !description || !Number.isFinite(amount) || amount <= 0) return;

    setFormError("");
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, description, amount }),
      });
      if (!response.ok) throw new Error("The server could not save this payment.");
      const payment: Payment = await response.json();
      setPayments((current) => [payment, ...current]);
      setFilter("All payments");
      setQuery("");
      setIsCreateOpen(false);
    } catch (error: unknown) {
      setFormError(error instanceof Error ? error.message : "Unable to save this payment.");
    }
  }

  function exportPayments() {
    const rows = [
      ["Payment ID", "Customer", "Email", "Description", "Date", "Amount", "Status"],
      ...filteredPayments.map((payment) => [
        payment.id, payment.name, payment.email, payment.description, formatPaymentDate(payment.date), payment.amount.toFixed(2), payment.status,
      ]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "payflow-payments.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Payflow home">
          <span className="brand-mark"><span /></span>
          <span>payflow</span>
        </a>
        <div className="workspace-switcher">
          <div className="workspace-avatar">S</div>
          <div className="workspace-copy"><strong>Studio North</strong><span>Free plan</span></div>
          <ChevronDown size={15} />
        </div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link selected" href="#overview"><LayoutDashboard size={17} />Overview</a>
          <a className="nav-link" href="#transactions"><ArrowDownLeft size={17} />Transactions<span className="nav-count">{payments.length}</span></a>
          <a className="nav-link" href="#payments"><CreditCard size={17} />Payment links</a>
          <a className="nav-link" href="#customers"><ShoppingBag size={17} />Customers</a>
        </nav>
        <div className="sidebar-label tools-label">PREFERENCES</div>
        <nav className="main-nav" aria-label="Preferences">
          <a className="nav-link" href="#settings"><Settings size={17} />Settings</a>
          <a className="nav-link" href="#help"><CircleHelp size={17} />Help & support</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card">
            <div className="plan-icon"><Sparkles size={16} /></div>
            <strong>Make more happen</strong>
            <p>Get more from every payment with Payflow Pro.</p>
            <button className="plan-button" type="button">Explore plans <ArrowRight size={14} /></button>
          </div>
          <button className="profile-button" type="button">
            <div className="profile-avatar">JD</div>
            <span className="profile-copy"><strong>Jordan Davis</strong><small>jordan@studionorth.co</small></span>
            <Ellipsis size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-divider">/</span><strong>Overview</strong></div>
          <div className="topbar-actions">
            <span className="environment-tag"><span />Demo workspace</span>
            <button className="icon-button" aria-label="Notifications" type="button"><Bell size={18} /><i /></button>
            <div className="topbar-avatar">JD</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">FRIDAY, OCTOBER 17, 2025</p>
              <h1>Good morning, Jordan <span className="wave">✳</span></h1>
              <p className="welcome-subtitle">Here&apos;s what&apos;s happening with your payments today.</p>
            </div>
            <button className="button button-primary" onClick={() => setIsCreateOpen(true)} type="button"><Plus size={17} />Create payment</button>
          </section>

          <section className="metrics-grid" aria-label="Payment summary">
            <article className="metric-card">
              <div className="metric-heading"><span>Total revenue</span><button type="button" aria-label="More about total revenue"><Ellipsis size={18} /></button></div>
              <div className="metric-value">$24,680<span className="metric-cents">.00</span></div>
              <div className="metric-foot"><span className="change positive"><ArrowUpRight size={14} />12.8%</span><span>vs. last month</span></div>
              <div className="metric-sparkline revenue-spark" aria-hidden="true"><svg viewBox="0 0 120 34" preserveAspectRatio="none"><path d="M1 28 C12 24 13 29 24 20 S39 25 50 16 S67 23 78 13 S94 19 102 8 S113 14 119 3" /></svg></div>
            </article>
            <article className="metric-card">
              <div className="metric-heading"><span>Successful payments</span><button type="button" aria-label="More about successful payments"><Ellipsis size={18} /></button></div>
              <div className="metric-value">1,284</div>
              <div className="metric-foot"><span className="change positive"><ArrowUpRight size={14} />8.2%</span><span>vs. last month</span></div>
              <div className="metric-sparkline payments-spark" aria-hidden="true"><svg viewBox="0 0 120 34" preserveAspectRatio="none"><path d="M1 29 C12 23 16 27 25 18 S42 22 49 15 S64 21 74 10 S89 16 98 9 S111 12 119 2" /></svg></div>
            </article>
            <article className="metric-card">
              <div className="metric-heading"><span>Average order value</span><button type="button" aria-label="More about average order value"><Ellipsis size={18} /></button></div>
              <div className="metric-value">$86<span className="metric-cents">.40</span></div>
              <div className="metric-foot"><span className="change negative"><ArrowDownRight size={14} />2.4%</span><span>vs. last month</span></div>
              <div className="metric-sparkline value-spark" aria-hidden="true"><svg viewBox="0 0 120 34" preserveAspectRatio="none"><path d="M1 8 C12 12 15 4 26 13 S39 10 49 19 S65 12 76 21 S93 15 102 24 S112 19 119 29" /></svg></div>
            </article>
          </section>

          <section className="insights-grid">
            <article className="panel revenue-panel">
              <div className="panel-heading">
                <div><h2>Revenue overview</h2><p>Track your income over time</p></div>
                <button className="select-button" type="button">This week <ChevronDown size={15} /></button>
              </div>
              <div className="chart-legend"><span className="legend-dot" />Revenue <strong>$8,492.00</strong><span className="legend-change">+14.2%</span></div>
              <div className="chart-wrap" role="img" aria-label="Bar chart of weekly revenue, highest on Saturday">
                <div className="chart-y-labels"><span>$3k</span><span>$2k</span><span>$1k</span><span>$0</span></div>
                <div className="chart-area">
                  <div className="chart-gridlines"><i /><i /><i /><i /></div>
                  <div className="bars">{chartBars.map((bar, index) => <div className="bar-column" key={bar.day}><div className={`bar ${index === 5 ? "bar-highlight" : ""}`} style={{ height: `${bar.value}%` }} /> <span>{bar.day}</span></div>)}</div>
                </div>
              </div>
            </article>
            <article className="panel activity-panel">
              <div className="panel-heading">
                <div><h2>Payment activity</h2><p>A quick look at your payments</p></div>
                <button className="more-button" type="button" aria-label="More payment activity options"><Ellipsis size={19} /></button>
              </div>
              <div className="activity-total"><span>Payments this week</span><strong>342</strong></div>
              <div className="activity-track" aria-label="89% successful, 8% pending, 3% failed"><span className="track-success" /><span className="track-pending" /><span className="track-failed" /></div>
              <div className="activity-legend">
                <div><span className="activity-label"><i className="legend-success" />Successful</span><strong>89% <small>304 payments</small></strong></div>
                <div><span className="activity-label"><i className="legend-pending" />Pending</span><strong>8% <small>27 payments</small></strong></div>
                <div><span className="activity-label"><i className="legend-failed" />Failed</span><strong>3% <small>11 payments</small></strong></div>
              </div>
              <a className="text-link" href="#transactions">View all activity <ArrowRight size={14} /></a>
            </article>
          </section>

          <section className="panel transactions-panel" id="transactions">
            <div className="transactions-heading">
              <div><h2>Recent transactions</h2><p>A list of payments made to your business</p></div>
              <button className="button button-secondary export-button" onClick={exportPayments} type="button"><Download size={15} />Export</button>
            </div>
            <div className="table-toolbar">
              <div className="filter-tabs" role="tablist" aria-label="Filter transactions">
                {(["All payments", "Completed", "Pending", "Failed"] as const).map((tab) => (
                  <button className={filter === tab ? "filter-tab active" : "filter-tab"} key={tab} onClick={() => setFilter(tab)} role="tab" aria-selected={filter === tab} type="button">{tab}{tab === "All payments" && <span>{payments.length}</span>}</button>
                ))}
              </div>
              <label className="search-field"><Search size={15} /><input aria-label="Search transactions" onChange={(event) => setQuery(event.target.value)} placeholder="Search" value={query} /><kbd>⌘ K</kbd></label>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th><span className="check-box" aria-hidden="true" />CUSTOMER</th><th>DESCRIPTION</th><th>DATE</th><th>STATUS</th><th className="amount-heading">AMOUNT</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td><div className="customer-cell"><div className={`customer-avatar ${payment.color}`}>{payment.initials}</div><div><strong>{payment.name}</strong><span>{payment.email}</span></div></div></td>
                      <td><span className="description-text">{payment.description}</span><small className="payment-id">{payment.id}</small></td>
                      <td className="date-cell">{formatPaymentDate(payment.date)}</td>
                      <td><span className={`status status-${payment.status.toLowerCase()}`}><i />{payment.status}</span></td>
                      <td className="amount-cell">{money(payment.amount)}</td>
                      <td><button className="row-action" type="button" aria-label={`More options for ${payment.id}`}><Ellipsis size={18} /></button></td>
                    </tr>
                  ))}
                  {isLoading && <tr><td className="empty-state" colSpan={6}>Loading transactions...</td></tr>}
                  {!isLoading && loadError && <tr><td className="empty-state" colSpan={6} role="alert">{loadError}</td></tr>}
                  {!isLoading && !loadError && filteredPayments.length === 0 && <tr><td className="empty-state" colSpan={6}>No payments match your search.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing <strong>{filteredPayments.length}</strong> of <strong>{payments.length}</strong> payments</span><button type="button" className="view-transactions">View all transactions <ArrowRight size={14} /></button></div>
          </section>
          <footer className="page-footer"><span>© 2025 Payflow, Inc.</span><span><i /> Demo workspace — payments are not processed.</span><a href="#help">Need help?</a></footer>
        </div>
      </main>

      {isCreateOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsCreateOpen(false); }}>
        <section aria-labelledby="create-payment-title" aria-modal="true" className="payment-modal" role="dialog">
          <div className="modal-heading"><div><div className="modal-icon"><CreditCard size={18} /></div><h2 id="create-payment-title">Create a payment</h2><p>Add a demo payment to your activity.</p></div><button className="modal-close" onClick={() => setIsCreateOpen(false)} type="button" aria-label="Close"><X size={18} /></button></div>
          <form onSubmit={addPayment}>
            <label>Customer name<input autoFocus name="name" placeholder="e.g. Alex Morgan" required /></label>
            <label>Email address<input name="email" type="email" placeholder="alex@example.com" required /></label>
            <label>Description<input name="description" placeholder="e.g. Invoice #1049" required /></label>
            <label>Amount (USD)<div className="amount-input"><span>$</span><input min="0.01" name="amount" placeholder="0.00" required step="0.01" type="number" /></div></label>
            {formError && <p className="modal-notice" role="alert">{formError}</p>}
            <p className="modal-notice"><Check size={15} /> This is a local demo entry. No money will be moved.</p>
            <div className="modal-actions"><button className="button button-secondary" onClick={() => setIsCreateOpen(false)} type="button">Cancel</button><button className="button button-primary" type="submit"><Plus size={16} />Add payment</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}

export default App;
