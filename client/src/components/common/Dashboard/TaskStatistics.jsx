import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleGetTaskStatistics } from "../../../redux/Thunks/TaskThunk";

export const TaskStatistics = () => {
    const dispatch = useDispatch();
    const TaskState = useSelector((state) => state.TaskReducer);

    useEffect(() => {
        dispatch(HandleGetTaskStatistics());
    }, []);

    const statistics = TaskState.statistics || {
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        overdueTasks: 0
    };

    const StatCard = ({ title, value, color, icon }) => (
        <div className={`bg-white border-l-4 ${color} rounded-lg p-4 shadow-sm`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className="statistics-container mb-6">
            <h2 className="text-lg font-semibold mb-4">Task Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    title="Total Tasks"
                    value={statistics.totalTasks}
                    color="border-l-purple-500"
                    icon={
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    }
                />
                <StatCard
                    title="Pending"
                    value={statistics.pendingTasks}
                    color="border-l-gray-500"
                    icon={
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="In Progress"
                    value={statistics.inProgressTasks}
                    color="border-l-yellow-500"
                    icon={
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Completed"
                    value={statistics.completedTasks}
                    color="border-l-green-500"
                    icon={
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Overdue"
                    value={statistics.overdueTasks}
                    color="border-l-red-500"
                    icon={
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    }
                />
            </div>
        </div>
    );
};
