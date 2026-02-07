import { useState } from "react";
import { useDispatch } from "react-redux";
import { HandleUpdateTaskStatus, HandleGetEmployeeTasks } from "../../redux/Thunks/EmployeeDashboardThunk";
import { useToast } from "../../hooks/use-toast";

export const EmployeeTaskList = ({ tasks }) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [updatingTaskId, setUpdatingTaskId] = useState(null);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateField) => {
        if (!dateField) return 'No due date';
        
        let date;
        if (dateField.seconds) {
            date = new Date(dateField.seconds * 1000);
        } else {
            date = new Date(dateField);
        }
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === 'completed') return false;
        
        let date;
        if (dueDate.seconds) {
            date = new Date(dueDate.seconds * 1000);
        } else {
            date = new Date(dueDate);
        }
        
        return date < new Date();
    };

    const handleStatusChange = async (taskId, newStatus) => {
        setUpdatingTaskId(taskId);
        try {
            const result = await dispatch(HandleUpdateTaskStatus({ taskId, status: newStatus }));
            if (result.type === 'HandleUpdateTaskStatus/fulfilled') {
                toast({
                    title: "Success",
                    description: "Task status updated successfully",
                    variant: "default"
                });
                dispatch(HandleGetEmployeeTasks());
            } else {
                toast({
                    title: "Error",
                    description: result.payload || "Failed to update task status",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task status",
                variant: "destructive"
            });
        } finally {
            setUpdatingTaskId(null);
        }
    };

    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No tasks assigned yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
                                    {task.priority.toUpperCase()}
                                </span>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(task.status)}`}>
                                    {task.status.replace('-', ' ').toUpperCase()}
                                </span>
                                {isOverdue(task.dueDate, task.status) && (
                                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800">
                                        OVERDUE
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                            <span className="text-gray-500">Assigned by:</span>
                            <span className="ml-2 text-gray-900">
                                {task.assignedByDetails ? 
                                    `${task.assignedByDetails.firstname} ${task.assignedByDetails.lastname}` : 
                                    'Unknown'
                                }
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">Due date:</span>
                            <span className={`ml-2 ${isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                {formatDate(task.dueDate)}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                            onClick={() => handleStatusChange(task.id, 'pending')}
                            disabled={task.status === 'pending' || updatingTaskId === task.id}
                            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                                task.status === 'pending'
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {updatingTaskId === task.id ? 'Updating...' : 'Pending'}
                        </button>
                        <button
                            onClick={() => handleStatusChange(task.id, 'in-progress')}
                            disabled={task.status === 'in-progress' || updatingTaskId === task.id}
                            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                                task.status === 'in-progress'
                                    ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                        >
                            {updatingTaskId === task.id ? 'Updating...' : 'In Progress'}
                        </button>
                        <button
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            disabled={task.status === 'completed' || updatingTaskId === task.id}
                            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                                task.status === 'completed'
                                    ? 'bg-green-100 text-green-400 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                            {updatingTaskId === task.id ? 'Updating...' : 'Complete'}
                        </button>
                    </div>

                    {task.completedAt && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <span className="text-sm text-green-600">
                                Completed: {formatDate(task.completedAt)}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
