import React, { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import UserInfoContext from "../../Context/User/UserInfoContext";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigning, setAssigning] = useState("");
  const [assignError, setAssignError] = useState("");
  const [deleting, setDeleting] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const { user } = useContext(UserInfoContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/User/AllUsers");
        setUsers(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`))
      return;
    setDeleting(email);
    setDeleteError("");
    try {
      await api.delete(`/User/DeleteUser${email}`);
      setUsers((prev) => prev.filter((u) => u.email !== email));
      setDeleting("");
    } catch (err) {
      setDeleteError("Failed to delete user.");
      setDeleting("");
    }
  };

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-8 text-center mt-10">
      <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>
      <p className="text-lg text-gray-300 mb-6">
        This page is only accessible to admin users.
      </p>
      {loading && <p className="text-gray-400">Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {deleteError && <p className="text-red-500">{deleteError}</p>}
      {!loading && !error && (
        <table className="w-full text-left text-white border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-700 text-lg">
                Email
              </th>
              <th className="px-4 py-2 border-b border-gray-700 text-lg">
                Username
              </th>
              {user && (user.isAdmin || user.email === "admin@admin.com") && (
                <th className="px-4 py-2 border-b border-gray-700 text-lg">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#232323]">
                <td className="px-4 py-2 border-b border-gray-700">
                  {u.email}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {u.userName}
                </td>
                {user && (user.isAdmin || user.email === "admin@admin.com") && (
                  <td className="px-4 py-2 border-b border-gray-700 flex gap-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded disabled:opacity-50"
                      onClick={() => handleDeleteUser(u.email)}
                      disabled={deleting === u.email}
                    >
                      {deleting === u.email ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
