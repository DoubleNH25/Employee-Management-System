import { db } from '../config/firebase.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function seedDatabase() {
    try {
        const organizationRef = db.collection('organizations').doc();
        const organizationData = {
            name: 'TechCorp Solutions',
            description: 'A modern technology company focused on innovative solutions',
            address: '123 Tech Street, Silicon Valley, CA',
            phone: '+1-555-0123',
            email: 'info@techcorp.com',
            website: 'https://techcorp.com',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await organizationRef.set(organizationData);
        const organizationId = organizationRef.id;

        const departments = [
            {
                name: 'Engineering',
                description: 'Software development and technical operations',
                employeeIds: [],
                humanResourceIds: [],
                organizationId: organizationId
            },
            {
                name: 'Marketing',
                description: 'Marketing and customer outreach',
                employeeIds: [],
                humanResourceIds: [],
                organizationId: organizationId
            },
            {
                name: 'Sales',
                description: 'Sales and business development',
                employeeIds: [],
                humanResourceIds: [],
                organizationId: organizationId
            }
        ];

        const departmentIds = {};
        for (const dept of departments) {
            const deptRef = db.collection('departments').doc();
            await deptRef.set({
                ...dept,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            departmentIds[dept.name] = deptRef.id;
        }

        const hrUsers = [
            {
                firstname: 'Sarah',
                lastname: 'Johnson',
                email: 'sarah.johnson@techcorp.com',
                password: await bcrypt.hash('password123', 10),
                contactnumber: '+84912345678',
                role: 'HR-Admin',
                departmentId: null,
                organizationId: organizationId,
                isverified: true,
                lastlogin: new Date(),
                accessCode: '',
                accessCodeExpires: null,
                otpCode: null,
                otpExpires: null
            },
            {
                firstname: 'Michael',
                lastname: 'Chen',
                email: 'michael.chen@techcorp.com', 
                password: await bcrypt.hash('password123', 10),
                contactnumber: '+84987654321',
                role: 'HR-Manager',
                departmentId: departmentIds['Engineering'],
                organizationId: organizationId,
                isverified: true,
                lastlogin: new Date(),
                accessCode: '',
                accessCodeExpires: null,
                otpCode: null,
                otpExpires: null
            }
        ];

        const hrIds = {};
        for (const hr of hrUsers) {
            const hrRef = db.collection('humanresources').doc();
            await hrRef.set({
                ...hr,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            hrIds[hr.email] = hrRef.id;
        }

        const employees = [
            {
                firstname: 'John',
                lastname: 'Doe',
                email: 'john.doe@techcorp.com',
                password: await bcrypt.hash('password123', 10),
                phone: '+1-555-0201',
                role: 'Software Engineer',
                departmentId: departmentIds['Engineering'],
                organizationId: organizationId,
                isverified: false,
                verificationtoken: null,
                verificationtokenexpires: null,
                accessCode: '',
                accessCodeExpires: null,
                taskIds: [],
                schedule: {
                    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    workHours: {
                        start: '09:00',
                        end: '17:00'
                    }
                }
            },
            {
                firstname: 'Jane',
                lastname: 'Smith',
                email: 'jane.smith@techcorp.com',
                password: await bcrypt.hash('password123', 10),
                phone: '+1-555-0202',
                role: 'Frontend Developer',
                departmentId: departmentIds['Engineering'],
                organizationId: organizationId,
                isverified: false,
                verificationtoken: null,
                verificationtokenexpires: null,
                accessCode: '',
                accessCodeExpires: null,
                taskIds: [],
                schedule: {
                    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    workHours: {
                        start: '10:00',
                        end: '18:00'
                    }
                }
            },
            {
                firstname: 'Alice',
                lastname: 'Wilson',
                email: 'alice.wilson@techcorp.com',
                password: await bcrypt.hash('password123', 10),
                phone: '+1-555-0203',
                role: 'Marketing Specialist',
                departmentId: departmentIds['Marketing'],
                organizationId: organizationId,
                isverified: false,
                verificationtoken: null,
                verificationtokenexpires: null,
                accessCode: '',
                accessCodeExpires: null,
                taskIds: [],
                schedule: {
                    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    workHours: {
                        start: '08:30',
                        end: '16:30'
                    }
                }
            },
            {
                firstname: 'Bob',
                lastname: 'Brown',
                email: 'bob.brown@techcorp.com',
                password: await bcrypt.hash('password123', 10),
                phone: '+1-555-0204',
                role: 'Sales Representative',
                departmentId: departmentIds['Sales'],
                organizationId: organizationId,
                isverified: false,
                verificationtoken: null,
                verificationtokenexpires: null,
                accessCode: '',
                accessCodeExpires: null,
                taskIds: [],
                schedule: {
                    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    workHours: {
                        start: '09:00',
                        end: '17:00'
                    }
                }
            }
        ];

        const employeeIds = {};
        for (const employee of employees) {
            const empRef = db.collection('employees').doc();
            await empRef.set({
                ...employee,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            employeeIds[employee.email] = empRef.id;
        }

        await db.collection('departments').doc(departmentIds['Engineering']).update({
            employeeIds: [employeeIds['john.doe@techcorp.com'], employeeIds['jane.smith@techcorp.com']],
            humanResourceIds: [hrIds['michael.chen@techcorp.com']],
            updatedAt: new Date()
        });

        await db.collection('departments').doc(departmentIds['Marketing']).update({
            employeeIds: [employeeIds['alice.wilson@techcorp.com']],
            updatedAt: new Date()
        });

        await db.collection('departments').doc(departmentIds['Sales']).update({
            employeeIds: [employeeIds['bob.brown@techcorp.com']],
            updatedAt: new Date()
        });

        const sampleTasks = [
            {
                title: 'Setup Development Environment',
                description: 'Install and configure development tools, IDE, and project dependencies for the new employee onboarding process.',
                assignedTo: employeeIds['john.doe@techcorp.com'],
                assignedBy: hrIds['michael.chen@techcorp.com'],
                priority: 'high',
                status: 'pending',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                organizationId: organizationId
            },
            {
                title: 'Code Review - Authentication Module',
                description: 'Review the authentication module code for security vulnerabilities and best practices compliance.',
                assignedTo: employeeIds['jane.smith@techcorp.com'],
                assignedBy: hrIds['michael.chen@techcorp.com'],
                priority: 'medium',
                status: 'in-progress',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                organizationId: organizationId
            },
            {
                title: 'Marketing Campaign Analysis',
                description: 'Analyze the performance of the Q4 marketing campaign and prepare a comprehensive report with recommendations.',
                assignedTo: employeeIds['alice.wilson@techcorp.com'],
                assignedBy: hrIds['sarah.johnson@techcorp.com'],
                priority: 'medium',
                status: 'pending',
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                organizationId: organizationId
            },
            {
                title: 'Client Presentation Preparation',
                description: 'Prepare presentation materials for the upcoming client meeting including product demos and pricing proposals.',
                assignedTo: employeeIds['bob.brown@techcorp.com'],
                assignedBy: hrIds['sarah.johnson@techcorp.com'],
                priority: 'high',
                status: 'completed',
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                organizationId: organizationId
            },
            {
                title: 'Database Optimization',
                description: 'Optimize database queries and implement indexing strategies to improve application performance.',
                assignedTo: employeeIds['john.doe@techcorp.com'],
                assignedBy: hrIds['michael.chen@techcorp.com'],
                priority: 'low',
                status: 'pending',
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                organizationId: organizationId
            }
        ];

        const taskIds = {};
        for (const task of sampleTasks) {
            const taskRef = db.collection('tasks').doc();
            await taskRef.set({
                ...task,
                createdAt: new Date(),
                updatedAt: new Date(),
                comments: []
            });
            taskIds[task.title] = taskRef.id;
            
            await db.collection('employees').doc(task.assignedTo).update({
                taskIds: [...(await db.collection('employees').doc(task.assignedTo).get()).data().taskIds || [], taskRef.id],
                updatedAt: new Date()
            });
        }

        const oldStructureDoc = await db.collection('tasks').doc('_structure').get();
        if (oldStructureDoc.exists) {
            await db.collection('tasks').doc('_structure').delete();
        }

        const chatRef = db.collection('chatMessages').doc('_structure');
        await chatRef.set({
            description: 'This collection will store real-time chat messages',
            fields: {
                senderId: 'userId (HR or Employee)',
                receiverId: 'userId (HR or Employee)',
                message: 'string',
                timestamp: 'timestamp',
                isRead: 'boolean',
                organizationId: 'string'
            },
            createdAt: new Date()
        });

    } catch (error) {
        throw error;
    }
}

seedDatabase()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        process.exit(1);
    });