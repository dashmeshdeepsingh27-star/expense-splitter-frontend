import { useState, useEffect } from "react";
import { getGroup, addMember, getExpenses, addExpense, getSettlement, addPayment } from "./api";

function getEmailFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.sub;
}

function GroupDetail({ groupId, onBack }) {
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [splitEqually, setSplitEqually] = useState(true);
  const [customShares, setCustomShares] = useState({});
  const [paymentTo, setPaymentTo] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    loadAll();
  }, [groupId]);

  async function handleAddPayment(e) {
  e.preventDefault();
  setError("");

  if (!paymentTo || !paymentAmount) {
    setError("Select a recipient and enter an amount");
    return;
  }

  const response = await addPayment(groupId, paymentTo, parseFloat(paymentAmount));

  if (response.ok) {
    setPaymentTo("");
    setPaymentAmount("");
    loadAll();
  } else {
    const message = await response.text();
    setError(message);
  }
}

  async function loadAll() {
    const groupRes = await getGroup(groupId);
    if (groupRes.ok) setGroup(await groupRes.json());

    const expensesRes = await getExpenses(groupId);
    if (expensesRes.ok) setExpenses(await expensesRes.json());

    const balancesRes = await getSettlement(groupId);
    if (balancesRes.ok) setBalances(await balancesRes.json());
  }

  async function handleAddMember(e) {
    e.preventDefault();
    setError("");

    const response = await addMember(groupId, newMemberEmail);
    if (response.ok) {
      setNewMemberEmail("");
      loadAll();
    } else {
      const message = await response.text();
      setError(message);
    }
  }

  function handleShareChange(email, value) {
    setCustomShares({ ...customShares, [email]: value });
  }

  async function handleAddExpense(e) {
    e.preventDefault();
    setError("");

    if (!expenseAmount || !expenseDescription) {
      setError("Amount and description are required");
      return;
    }

    let shares = null;

    if (!splitEqually) {
      shares = group.members.map((m) => ({
        email: m.email,
        amount: parseFloat(customShares[m.email] || 0),
      }));

      const total = shares.reduce((sum, s) => sum + s.amount, 0);
      const roundedTotal = Math.round(total * 100) / 100;
      const roundedAmount = Math.round(parseFloat(expenseAmount) * 100) / 100;

      if (roundedTotal !== roundedAmount) {
        setError(`Shares add up to ₹${roundedTotal}, but total is ₹${roundedAmount}. They must match.`);
        return;
      }
    }

    const response = await addExpense(groupId, parseFloat(expenseAmount), expenseDescription, shares);

    if (response.ok) {
      setExpenseAmount("");
      setExpenseDescription("");
      setCustomShares({});
      loadAll();
    } else {
      const message = await response.text();
      setError(message);
    }
  }

  if (!group) return <p>Loading...</p>;

  return (
    <div>
      <button className="back-link" onClick={onBack}>← Back to Dashboard</button>
      <h1>{group.name}</h1>

      {error && <p className="error-text">{error}</p>}

      <h3>Members</h3>
      <ul>
        {group.members.map((m) => (
          <li key={m.id}>{m.name} ({m.email})</li>
        ))}
      </ul>
      <form onSubmit={handleAddMember}>
        <input
          type="email"
          placeholder="Member email to add"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
        />
        <button type="submit">Add Member</button>
      </form>

      <h3>Add Expense</h3>
      <form onSubmit={handleAddExpense}>
        <input
          type="number"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={expenseDescription}
          onChange={(e) => setExpenseDescription(e.target.value)}
        />
        <br />
        <label>
          <input
            type="checkbox"
            checked={splitEqually}
            onChange={(e) => setSplitEqually(e.target.checked)}
          />
          Split equally
        </label>

        {!splitEqually && (
          <div>
            <p>Enter each person's exact share:</p>
            {group.members.map((m) => (
              <div key={m.id}>
                <label>{m.name}: </label>
                <input
                  type="number"
                  placeholder="0"
                  value={customShares[m.email] || ""}
                  onChange={(e) => handleShareChange(m.email, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        <br />
        <button type="submit">Add Expense</button>
      </form>

      <h3>Expenses</h3>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            {exp.description} — ₹{exp.amount} (paid by {exp.paidBy.name})
          </li>
        ))}
      </ul>

      <h3>Balances</h3>
<ul>
  {balances.map((b) => (
    <li key={b.email}>
      {b.name}:{" "}
      {b.balance > 0 ? (
        <span className="balance-owed">is owed ₹{b.balance}</span>
      ) : b.balance < 0 ? (
        <span className="balance-owes">owes ₹{Math.abs(b.balance)}</span>
      ) : (
        <span className="balance-settled">settled up</span>
      )}
    </li>
  ))}
</ul>

      <h3>Settle Up</h3>
<form onSubmit={handleAddPayment}>
  <select value={paymentTo} onChange={(e) => setPaymentTo(e.target.value)}>
    <option value="">-- Select who you're paying --</option>
    {group.members
  .filter((m) => m.email !== getEmailFromToken())
  .map((m) => (
    <option key={m.id} value={m.email}>{m.name}</option>
  ))}
  </select>
  <input
    type="number"
    placeholder="Amount"
    value={paymentAmount}
    onChange={(e) => setPaymentAmount(e.target.value)}
  />
  <button type="submit">Record Payment</button>
</form>

    </div>
  );
}

export default GroupDetail;