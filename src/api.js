export const BASE_URL = "https://expense-splitter-backend-q8p0.onrender.com/api";\


function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export async function signup(name, email, password) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return response;
}

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response;
}

export async function createGroup(name) {
  const response = await fetch(`${BASE_URL}/groups`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  return response;
}

export async function getMyGroups() {
  const response = await fetch(`${BASE_URL}/groups/mine`, {
    headers: authHeaders(),
  });
  return response;
}

export async function getGroup(groupId) {
  const response = await fetch(`${BASE_URL}/groups/${groupId}`, {
    headers: authHeaders(),
  });
  return response;
}

export async function addMember(groupId, email) {
  const response = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email }),
  });
  return response;
}

export async function getExpenses(groupId) {
  const response = await fetch(`${BASE_URL}/groups/${groupId}/expenses`, {
    headers: authHeaders(),
  });
  return response;
}

export async function addExpense(groupId, amount, description, shares) {
  const body = { amount, description };
  if (shares) {
    body.shares = shares;
  }
  const response = await fetch(`${BASE_URL}/groups/${groupId}/expenses`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return response;
}

export async function getSettlement(groupId) {
  const response = await fetch(`${BASE_URL}/groups/${groupId}/expenses/settlement`, {
    headers: authHeaders(),
  });
  return response;
}

export async function addPayment(groupId, paidToEmail, amount) {
  const response = await fetch(`${BASE_URL}/groups/${groupId}/payments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ paidToEmail, amount }),
  });
  return response;
}