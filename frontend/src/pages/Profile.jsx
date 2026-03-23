import EmployeeLayout from "../components/EmployeeLayout";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          My Profile
        </h2>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Department:</strong> {user.department}
          </p>
          <p>
            <strong>Employee ID:</strong> {user.employeeId}
          </p>
        </div>
      </div>
    </EmployeeLayout>
  );
}
