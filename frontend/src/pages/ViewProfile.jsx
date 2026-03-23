import { useState, useEffect } from "react";
import { User, Mail, BadgeCheck, IdCard } from "lucide-react";

export default function ViewProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (!user) return null;

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 p-8">
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              localStorage.getItem("avatar") ||
              "https://ui-avatars.com/api/?name=" + user.name
            }
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
          />
          <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
            {user.name}
          </h2>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>

        <div className="space-y-4 text-sm">
          <ProfileRow
            icon={<IdCard size={16} />}
            label="Employee ID"
            value={user.id || "EMP001"}
          />

          <ProfileRow
            icon={<Mail size={16} />}
            label="Email"
            value={user.email}
          />

          <ProfileRow
            icon={<BadgeCheck size={16} />}
            label="Role"
            value={user.role}
          />
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/40 px-4 py-3 rounded-xl">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        {icon}
        {label}
      </div>
      <div className="font-medium text-gray-800 dark:text-white">{value}</div>
    </div>
  );
}
