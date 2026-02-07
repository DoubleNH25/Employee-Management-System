import { db } from '../../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

export class Task {
    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.assignedTo = data.assignedTo;
        this.assignedBy = data.assignedBy;
        this.status = data.status || 'pending';
        this.priority = data.priority || 'medium';
        this.dueDate = data.dueDate;
        this.organizationId = data.organizationId;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.completedAt = data.completedAt || null;
        this.comments = data.comments || [];
    }

    static async create(taskData) {
        try {
            const task = new Task(taskData);
            const docRef = db.collection('tasks').doc();
            await docRef.set({
                ...task,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp()
            });
            
            if (task.assignedTo) {
                await db.collection('employees').doc(task.assignedTo).update({
                    taskIds: FieldValue.arrayUnion(docRef.id),
                    updatedAt: FieldValue.serverTimestamp()
                });
            }
            
            return { id: docRef.id, ...task };
        } catch (error) {
            throw new Error(`Error creating task: ${error.message}`);
        }
    }

    static async findByOrganization(organizationId) {
        try {
            const snapshot = await db.collection('tasks')
                .where('organizationId', '==', organizationId)
                .get();
            const tasks = [];
            for (const doc of snapshot.docs) {
                const taskData = { id: doc.id, ...doc.data() };                
                if (taskData.assignedTo) {
                    const employeeDoc = await db.collection('employees').doc(taskData.assignedTo).get();
                    if (employeeDoc.exists) {
                        const employeeData = employeeDoc.data();
                        taskData.assignedToDetails = {
                            id: employeeDoc.id,
                            firstname: employeeData.firstname,
                            lastname: employeeData.lastname,
                            email: employeeData.email
                        };
                    }
                }
                
                if (taskData.assignedBy) {
                    const hrDoc = await db.collection('humanresources').doc(taskData.assignedBy).get();
                    if (hrDoc.exists) {
                        const hrData = hrDoc.data();
                        taskData.assignedByDetails = {
                            id: hrDoc.id,
                            firstname: hrData.firstname,
                            lastname: hrData.lastname,
                            email: hrData.email
                        };
                    }
                }
                
                tasks.push(taskData);
            }
            
            tasks.sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0;
                const bTime = b.createdAt?.seconds || 0;
                return bTime - aTime;
            });
            
            return tasks;
        } catch (error) {
            throw new Error(`Error finding tasks: ${error.message}`);
        }
    }

    static async findByEmployee(employeeId) {
        try {
            const snapshot = await db.collection('tasks')
                .where('assignedTo', '==', employeeId)
                .get();
            
            const tasks = [];
            for (const doc of snapshot.docs) {
                const taskData = { id: doc.id, ...doc.data() };
                
                if (taskData.assignedBy) {
                    const hrDoc = await db.collection('humanresources').doc(taskData.assignedBy).get();
                    if (hrDoc.exists) {
                        const hrData = hrDoc.data();
                        taskData.assignedByDetails = {
                            id: hrDoc.id,
                            firstname: hrData.firstname,
                            lastname: hrData.lastname,
                            email: hrData.email
                        };
                    }
                }
                
                tasks.push(taskData);
            }
            
            tasks.sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0;
                const bTime = b.createdAt?.seconds || 0;
                return bTime - aTime;
            });
            
            return tasks;
        } catch (error) {
            throw new Error(`Error finding employee tasks: ${error.message}`);
        }
    }

    static async findById(taskId) {
        try {
            const doc = await db.collection('tasks').doc(taskId).get();
            if (!doc.exists) {
                return null;
            }
            
            const taskData = { id: doc.id, ...doc.data() };
            
            if (taskData.assignedTo) {
                const employeeDoc = await db.collection('employees').doc(taskData.assignedTo).get();
                if (employeeDoc.exists) {
                    const employeeData = employeeDoc.data();
                    taskData.assignedToDetails = {
                        id: employeeDoc.id,
                        firstname: employeeData.firstname,
                        lastname: employeeData.lastname,
                        email: employeeData.email
                    };
                }
            }
            
            if (taskData.assignedBy) {
                const hrDoc = await db.collection('humanresources').doc(taskData.assignedBy).get();
                if (hrDoc.exists) {
                    const hrData = hrDoc.data();
                    taskData.assignedByDetails = {
                        id: hrDoc.id,
                        firstname: hrData.firstname,
                        lastname: hrData.lastname,
                        email: hrData.email
                    };
                }
            }
            
            return taskData;
        } catch (error) {
            throw new Error(`Error finding task: ${error.message}`);
        }
    }

    static async update(taskId, updateData) {
        try {
            const updateObj = {
                ...updateData,
                updatedAt: FieldValue.serverTimestamp()
            };
            
            if (updateData.status === 'completed') {
                updateObj.completedAt = FieldValue.serverTimestamp();
            }
            
            await db.collection('tasks').doc(taskId).update(updateObj);
            return await Task.findById(taskId);
        } catch (error) {
            throw new Error(`Error updating task: ${error.message}`);
        }
    }

    static async delete(taskId) {
        try {
            const task = await Task.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            
            if (task.assignedTo) {
                await db.collection('employees').doc(task.assignedTo).update({
                    taskIds: FieldValue.arrayRemove(taskId),
                    updatedAt: FieldValue.serverTimestamp()
                });
            }
            
            await db.collection('tasks').doc(taskId).delete();
            return true;
        } catch (error) {
            throw new Error(`Error deleting task: ${error.message}`);
        }
    }

    static async addComment(taskId, comment) {
        try {
            const commentData = {
                id: db.collection('tasks').doc().id,
                text: comment.text,
                authorId: comment.authorId,
                authorType: comment.authorType,
                createdAt: FieldValue.serverTimestamp()
            };
            
            await db.collection('tasks').doc(taskId).update({
                comments: FieldValue.arrayUnion(commentData),
                updatedAt: FieldValue.serverTimestamp()
            });
            
            return await Task.findById(taskId);
        } catch (error) {
            throw new Error(`Error adding comment: ${error.message}`);
        }
    }

    static async getStatistics(organizationId) {
        try {
            const snapshot = await db.collection('tasks')
                .where('organizationId', '==', organizationId)
                .get();
            
            let totalTasks = 0;
            let pendingTasks = 0;
            let inProgressTasks = 0;
            let completedTasks = 0;
            let overdueTasks = 0;
            
            const now = new Date();
            
            snapshot.docs.forEach(doc => {
                const task = doc.data();
                totalTasks++;
                
                switch (task.status) {
                    case 'pending':
                        pendingTasks++;
                        break;
                    case 'in-progress':
                        inProgressTasks++;
                        break;
                    case 'completed':
                        completedTasks++;
                        break;
                }
                
                if (task.dueDate && task.status !== 'completed') {
                    const dueDate = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
                    if (dueDate < now) {
                        overdueTasks++;
                    }
                }
            });
            
            return {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                overdueTasks
            };
        } catch (error) {
            throw new Error(`Error getting task statistics: ${error.message}`);
        }
    }
}