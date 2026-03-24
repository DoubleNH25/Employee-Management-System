import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleCreateTask, HandleUpdateTask, HandleDeleteTask } from "../../../redux/Thunks/TaskThunk";
import { fetchEmployeesIDs } from "../../../redux/Thunks/EmployeesIDsThunk";
import { useToast } from "../../../hooks/use-toast";
import { CommonStateHandler } from "../../../utils/commonhandler";

export const CreateTaskDialog = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const TaskState = useSelector((state) => state.TaskReducer);
    const EmployeesIDsState = useSelector((state) => state.EMployeesIDReducer);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        dueDate: ""
    });

    useEffect(() => {
        if (open) {
            dispatch(fetchEmployeesIDs({ apiroute: "GETALL" }));
        }
    }, [open, dispatch]);

    useEffect(() => {
        if (TaskState.success && !TaskState.isLoading) {
            toast({
                title: "Success",
                description: TaskState.message,
                variant: "default"
            });
            setOpen(false);
            setFormData({
                title: "",
                description: "",
                assignedTo: "",
                priority: "medium",
                dueDate: ""
            });
        }
        if (TaskState.error) {
            toast({
                title: "Error",
                description: TaskState.error,
                variant: "destructive"
            });
        }
    }, [TaskState.success, TaskState.error, TaskState.isLoading, toast]);

    const handleFormChange = (event) => {
        CommonStateHandler(event.target.name, event.target.value, setFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.assignedTo) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }
        
        const taskData = {
            ...formData,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
        };
        
        dispatch(HandleCreateTask(taskData));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Create New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                        Assign a new task to an employee. Fill in all the details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter task title"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter task description"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Assign to Employee *
                        </label>
                        <select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select an employee</option>
                            {EmployeesIDsState.data && Array.isArray(EmployeesIDsState.data) ? 
                                EmployeesIDsState.data.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.firstname} {employee.lastname} - {employee.role}
                                    </option>
                                )) : 
                                <option value="" disabled>Loading employees...</option>
                            }
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={TaskState.isLoading}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {TaskState.isLoading ? "Creating..." : "Create Task"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export const UpdateTaskDialog = ({ task, children }) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const TaskState = useSelector((state) => state.TaskReducer);
    const EmployeesIDsState = useSelector((state) => state.EMployeesIDReducer);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: task?.title || "",
        description: task?.description || "",
        assignedTo: task?.assignedTo || "",
        priority: task?.priority || "medium",
        status: task?.status || "pending",
        dueDate: (() => {
            if (!task?.dueDate) return "";
            try {
                if (task.dueDate.seconds) {
                    return new Date(task.dueDate.seconds * 1000).toISOString().split('T')[0];
                }
                const date = new Date(task.dueDate);
                if (isNaN(date.getTime())) return "";
                return date.toISOString().split('T')[0];
            } catch (error) {
                return "";
            }
        })()
    });

    useEffect(() => {
        if (open) {
            dispatch(fetchEmployeesIDs({ apiroute: "GETALL" }));
        }
    }, [open, dispatch]);

    useEffect(() => {
        if (TaskState.success && !TaskState.isLoading) {
            toast({
                title: "Success",
                description: TaskState.message,
                variant: "default"
            });
            setOpen(false);
        }
        if (TaskState.error) {
            toast({
                title: "Error",
                description: TaskState.error,
                variant: "destructive"
            });
        }
    }, [TaskState.success, TaskState.error, TaskState.isLoading, toast]);

    const handleFormChange = (event) => {
        CommonStateHandler(event.target.name, event.target.value, setFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.assignedTo) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }
        
        const taskData = {
            ...formData,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
        };
        
        dispatch(HandleUpdateTask({ taskId: task.id, ...taskData }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Update Task</DialogTitle>
                    <DialogDescription>
                        Update task details and assignment.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Assign to Employee *
                        </label>
                        <select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select an employee</option>
                            {EmployeesIDsState.data && Array.isArray(EmployeesIDsState.data) ? 
                                EmployeesIDsState.data.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.firstname} {employee.lastname} - {employee.role}
                                    </option>
                                )) : 
                                <option value="" disabled>Loading employees...</option>
                            }
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={TaskState.isLoading}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {TaskState.isLoading ? "Updating..." : "Update Task"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export const DeleteTaskDialog = ({ task, children }) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const TaskState = useSelector((state) => state.TaskReducer);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (TaskState.success && !TaskState.isLoading) {
            toast({
                title: "Success",
                description: TaskState.message,
                variant: "default"
            });
            setOpen(false);
        }
        if (TaskState.error) {
            toast({
                title: "Error",
                description: TaskState.error,
                variant: "destructive"
            });
        }
    }, [TaskState.success, TaskState.error, TaskState.isLoading, toast]);

    const handleDelete = () => {
        dispatch(HandleDeleteTask({ taskId: task.id }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this task? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium">{task?.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task?.description}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleDelete}
                            disabled={TaskState.isLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {TaskState.isLoading ? "Deleting..." : "Delete Task"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
