export const EmployeeStats = ({ tasks }) => {
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;

    const stats = [
        {
            title: "Total Tasks",
            value: totalTasks,
            textColor: "text-blue-600"
        },
        {
            title: "Pending",
            value: pendingTasks,
            textColor: "text-gray-600"
        },
        {
            title: "In Progress",
            value: inProgressTasks,
            textColor: "text-yellow-600"
        },
        {
            title: "Completed",
            value: completedTasks,
            textColor: "text-green-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-5">
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className={`text-2xl font-semibold ${stat.textColor}`}>{stat.value}</p>
                </div>
            ))}
        </div>
    );
};
