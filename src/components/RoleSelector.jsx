// This code is written by - Asim Husain

import React from "react";

const RoleSelector = ({ role, setRole }) => (
  <div className="role-select">
    <label>Role:</label>
    <select value={role} onChange={(e) => setRole(e.target.value)}>
      <option value="Technical">Technical</option>
      <option value="HR">HR</option>
    </select>
  </div>
);

export default RoleSelector;