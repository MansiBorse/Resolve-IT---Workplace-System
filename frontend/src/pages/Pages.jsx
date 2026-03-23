import EmployeeLayout from "../components/EmployeeLayout";

export default function Profile() {
  const employeeName = localStorage.getItem("employeeName") || "Employee";

  // Dummy DB-ready structure
  const profile = {
    employeeId: "EMP-101",
    email: `${employeeName.toLowerCase()}@company.com`,
    department: "Human Resources",
    role: "Employee",
    joiningDate: "12 Jan 2024",
    totalGrievances: 8,
    resolved: 6,
    pending: 2,
  };

  return (
    <EmployeeLayout>
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold">My Profile</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your personal and account details.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border dark:border-gray-700">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full text-3xl font-bold">
            {employeeName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-2xl font-semibold">{employeeName}</h3>
            <p className="text-gray-500 dark:text-gray-400">{profile.role}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Employee ID
            </p>
            <p className="font-medium">{profile.employeeId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium">{profile.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Department
            </p>
            <p className="font-medium">{profile.department}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Joining Date
            </p>
            <p className="font-medium">{profile.joiningDate}</p>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-12">
          <h4 className="text-xl font-semibold mb-6">Activity Summary</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-xl text-center">
              <p className="text-sm text-gray-500 dark:text-gray-300">Total</p>
              <p className="text-2xl font-bold text-indigo-600">
                {profile.totalGrievances}
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-gray-700 p-6 rounded-xl text-center">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Pending
              </p>
              <p className="text-2xl font-bold text-yellow-500">
                {profile.pending}
              </p>
            </div>

            <div className="bg-green-50 dark:bg-gray-700 p-6 rounded-xl text-center">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Resolved
              </p>
              <p className="text-2xl font-bold text-green-600">
                {profile.resolved}
              </p>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
