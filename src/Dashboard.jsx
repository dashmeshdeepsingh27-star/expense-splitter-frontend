import { useState, useEffect } from "react";
import { createGroup, getMyGroups } from "./api";

function Dashboard({ onSelectGroup, onLogout }) {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    const response = await getMyGroups();
    if (response.ok) {
      const data = await response.json();
      setGroups(data);
    } else {
      setError("Failed to load groups");
    }
  }

  async function handleCreateGroup(e) {
    e.preventDefault();
    setError("");

    if (!newGroupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }

    const response = await createGroup(newGroupName);

    if (response.ok) {
      setNewGroupName("");
      loadGroups();
    } else {
      setError("Failed to create group");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>My Groups</h1>
        <button onClick={onLogout}>Logout</button>
      </div>

      <form onSubmit={handleCreateGroup}>
        <input
          type="text"
          placeholder="New group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button type="submit">Create Group</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <button onClick={() => onSelectGroup(group.id)}>
              {group.name}
            </button>
          </li>
        ))}
      </ul>

      {groups.length === 0 && <p>No groups yet. Create one above!</p>}
    </div>
  );
}

export default Dashboard;