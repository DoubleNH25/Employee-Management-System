import { UpdateTaskDialog, DeleteTaskDialog } from "./TaskDialogs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const TaskList = ({ tasks }) => {
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
        
        try {
            let date;
            if (dateField.seconds) {
                date = new Date(dateField.seconds * 1000);
            } else if (dateField._seconds) {
                date = new Date(dateField._seconds * 1000);
            } else {
                date = new Date(dateField);
            }
            
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === 'completed') return false;
        
        try {
            let date;
            if (dueDate.seconds) {
                date = new Date(dueDate.seconds * 1000);
            } else if (dueDate._seconds) {
                date = new Date(dueDate._seconds * 1000);
            } else {
                date = new Date(dueDate);
            }
            
            if (isNaN(date.getTime())) {
                return false;
            }
            
            return date < new Date();
        } catch (error) {
            return false;
        }
    };

    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No tasks found</p>
                <p className="text-gray-400 text-sm mt-2">Create a new task to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                                <Badge className={getPriorityColor(task.priority)}>
                                    {task.priority.toUpperCase()}
                                </Badge>
                                <Badge className={getStatusColor(task.status)}>
                                    {task.status.replace('-', ' ').toUpperCase()}
                                </Badge>
                                {isOverdue(task.dueDate, task.status) && (
                                    <Badge className="bg-red-100 text-red-800 border-red-200">
                                        OVERDUE
                                    </Badge>
                                )}
                            </div>
                            <p className="text-gray-600 mb-3">{task.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <UpdateTaskDialog task={task}>
                                <Button variant="outline" size="sm">
                                    Edit
                                </Button>
                            </UpdateTaskDialog>
                            <DeleteTaskDialog task={task}>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    Delete
                                </Button>
                            </DeleteTaskDialog>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">Assigned to:</span>
                            <p className="mt-1">
                                {task.assignedToDetails ? 
                                    `${task.assignedToDetails.firstname} ${task.assignedToDetails.lastname}` : 
                                    'Unknown Employee'
                                }
                            </p>
                        </div>
                        <div>
                            <span className="font-medium">Assigned by:</span>
                            <p className="mt-1">
                                {task.assignedByDetails ? 
                                    `${task.assignedByDetails.firstname} ${task.assignedByDetails.lastname}` : 
                                    'Unknown HR'
                                }
                            </p>
                        </div>
                        <div>
                            <span className="font-medium">Due date:</span>
                            <p className={`mt-1 ${isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : ''}`}>
                                {formatDate(task.dueDate)}
                            </p>
                        </div>
                    </div>
                    
                    {task.completedAt && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <span className="text-sm text-green-600 font-medium">
                                Completed on: {formatDate(task.completedAt)}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
