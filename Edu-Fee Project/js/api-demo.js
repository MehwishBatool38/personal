// ============================================================
// EduFee — Local Demo Mode (No Supabase Required)
// Fully functional with localStorage
// ============================================================

// Demo data stored in localStorage
const DemoStorage = {
    getUsers() {
        return JSON.parse(localStorage.getItem('edufee_users') || JSON.stringify([{
                id: 'admin-1',
                email: 'admin@demo.com',
                password: 'Admin@123',
                role: 'admin',
                fname: 'John',
                lname: 'Admin',
                reg_no: 'ADM-001'
            },
            {
                id: 'student-1',
                email: 'student@demo.com',
                password: 'Student@123',
                role: 'student',
                fname: 'Ahmed',
                lname: 'Khan',
                reg_no: 'STU-001',
                course: 'Computer Science',
                batch: '2024',
                phone: '+92123456789'
            }
        ]));
    },

    saveUsers(users) {
        localStorage.setItem('edufee_users', JSON.stringify(users));
    },

    getFeePlans() {
        return JSON.parse(localStorage.getItem('edufee_plans') || JSON.stringify([{
            id: 1,
            name: '2024-2025 Engineering',
            total: 5000,
            installment_count: 4,
            installments: [
                { id: 1, no: 1, amount: 1250, due_date: '2024-01-15' },
                { id: 2, no: 2, amount: 1250, due_date: '2024-02-15' },
                { id: 3, no: 3, amount: 1250, due_date: '2024-03-15' },
                { id: 4, no: 4, amount: 1250, due_date: '2024-04-15' }
            ]
        }]));
    },

    saveFeePlans(plans) {
        localStorage.setItem('edufee_plans', JSON.stringify(plans));
    },

    getAssignments() {
        return JSON.parse(localStorage.getItem('edufee_assignments') || JSON.stringify([{
            id: 1,
            student_id: 'student-1',
            plan_id: 1,
            assigned_at: new Date().toISOString()
        }]));
    },

    saveAssignments(assignments) {
        localStorage.setItem('edufee_assignments', JSON.stringify(assignments));
    },

    getPayments() {
        return JSON.parse(localStorage.getItem('edufee_payments') || JSON.stringify([{
            id: 1,
            student_id: 'student-1',
            assignment_id: 1,
            installment_no: 1,
            amount: 1250,
            payment_date: '2024-01-20',
            receipt_no: 'RCP-00001',
            method: 'Cash'
        }]));
    },

    savePayments(payments) {
        localStorage.setItem('edufee_payments', JSON.stringify(payments));
    }
};

// ── LOCAL AUTH ──────────────────────────────────────────
const Auth = {
    currentUser: null,

    async signUp({ email, password, fname, lname, phone, course, batch }) {
        const users = DemoStorage.getUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('Email already registered');
        }
        const newUser = {
            id: 'student-' + Date.now(),
            email,
            password,
            role: 'student',
            fname,
            lname,
            phone,
            course,
            batch,
            reg_no: 'STU-' + Math.floor(Math.random() * 9000 + 1000)
        };
        users.push(newUser);
        DemoStorage.saveUsers(users);
        return { user: newUser };
    },

    async signIn(email, password) {
        const users = DemoStorage.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error('Invalid login credentials');
        this.currentUser = user;
        localStorage.setItem('edufee_current_user', JSON.stringify(user));
        return { user };
    },

    async signOut() {
        this.currentUser = null;
        localStorage.removeItem('edufee_current_user');
    },

    async getSession() {
        const user = localStorage.getItem('edufee_current_user');
        return { session: user ? { user: JSON.parse(user) } : null };
    }
};

// ── PROFILES ──────────────────────────────────────────
const Profiles = {
    async getMe() {
        const session = await Auth.getSession();
        if (!session || !session.session) return null;
        return session.session.user;
    },

    async getAll() {
        const users = DemoStorage.getUsers();
        return users.filter(u => u.role === 'student');
    },

    async getById(id) {
        const users = DemoStorage.getUsers();
        return users.find(u => u.id === id) || null;
    },

    async update(id, updates) {
        const users = DemoStorage.getUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx >= 0) {
            users[idx] = {...users[idx], ...updates };
            DemoStorage.saveUsers(users);
            return users[idx];
        }
        return null;
    },

    async delete(id) {
        const users = DemoStorage.getUsers();
        const filtered = users.filter(u => u.id !== id);
        DemoStorage.saveUsers(filtered);
    }
};

// ── FEE PLANS ─────────────────────────────────────────
const FeePlans = {
    async getAll() {
        return DemoStorage.getFeePlans();
    },

    async getById(id) {
        const plans = await this.getAll();
        return plans.find(p => p.id === id);
    },

    async create({ name, total, installmentCount, installments }) {
        const plans = DemoStorage.getFeePlans();
        const newPlan = {
            id: Math.max(...plans.map(p => p.id), 0) + 1,
            name,
            total,
            installment_count: installmentCount,
            installments: installments || []
        };
        plans.push(newPlan);
        DemoStorage.saveFeePlans(plans);
        return newPlan;
    },

    async delete(id) {
        const plans = DemoStorage.getFeePlans();
        const filtered = plans.filter(p => p.id !== id);
        DemoStorage.saveFeePlans(filtered);
    }
};

// ── FEE ASSIGNMENTS ───────────────────────────────────
const FeeAssignments = {
    async getAll() {
        const assignments = DemoStorage.getAssignments();
        const plans = DemoStorage.getFeePlans();
        const users = DemoStorage.getUsers();

        return assignments.map(a => ({
            ...a,
            fee_plans: plans.find(p => p.id === a.plan_id),
            profiles: users.find(u => u.id === a.student_id)
        }));
    },

    async getForStudent(studentId) {
        const assignments = DemoStorage.getAssignments();
        const plans = DemoStorage.getFeePlans();
        const users = DemoStorage.getUsers();
        const found = assignments.find(a => a.student_id === studentId);
        if (!found) return null;
        return {
            ...found,
            fee_plans: plans.find(p => p.id === found.plan_id),
            profiles: users.find(u => u.id === found.student_id)
        };
    },

    async create(studentId, planId) {
        const assignments = DemoStorage.getAssignments();
        assignments.forEach(a => {
            if (a.student_id === studentId) a.deleted = true;
        });
        const newAssignment = {
            id: Math.max(...assignments.map(a => a.id), 0) + 1,
            student_id: studentId,
            plan_id: planId,
            assigned_at: new Date().toISOString()
        };
        assignments.push(newAssignment);
        DemoStorage.saveAssignments(assignments);
        return newAssignment;
    },

    async delete(id) {
        const assignments = DemoStorage.getAssignments();
        const filtered = assignments.filter(a => a.id !== id);
        DemoStorage.saveAssignments(filtered);
    }
};

// ── PAYMENTS ──────────────────────────────────────────
const Payments = {
    async getAll() {
        const payments = DemoStorage.getPayments();
        const users = DemoStorage.getUsers();
        const plans = DemoStorage.getFeePlans();
        return payments.map(p => ({
            ...p,
            profiles: users.find(u => u.id === p.student_id),
            fee_plans: plans.find(pl => pl.id === p.plan_id)
        }));
    },

    async getForStudent(studentId) {
        const payments = DemoStorage.getPayments();
        const users = DemoStorage.getUsers();
        const plans = DemoStorage.getFeePlans();
        return payments
            .filter(p => p.student_id === studentId)
            .map(p => ({
                ...p,
                profiles: users.find(u => u.id === p.student_id),
                fee_plans: plans.find(pl => pl.id === p.plan_id)
            }));
    },

    async create({ studentId, assignmentId, planId, installmentNo, amount, paymentDate, method, notes }) {
        const payments = DemoStorage.getPayments();
        const newPayment = {
            id: Math.max(...payments.map(p => p.id), 0) + 1,
            student_id: studentId,
            assignment_id: assignmentId,
            plan_id: planId,
            installment_no: installmentNo,
            amount,
            payment_date: paymentDate,
            method,
            notes: notes || '',
            receipt_no: 'RCP-' + String(Math.floor(Math.random() * 100000)).padStart(5, '0')
        };
        payments.push(newPayment);
        DemoStorage.savePayments(payments);
        return newPayment;
    },

    sumForAssignment(payments, assignmentId) {
        return payments
            .filter(p => p.assignment_id === assignmentId)
            .reduce((s, p) => s + parseFloat(p.amount || 0), 0);
    }
};

// ── DASHBOARD ─────────────────────────────────────────
const Dashboard = {
    async getStats() {
        const users = DemoStorage.getUsers().filter(u => u.role === 'student');
        const assignments = DemoStorage.getAssignments();
        const payments = DemoStorage.getPayments();
        const plans = DemoStorage.getFeePlans();

        const totalFees = assignments.reduce((sum, a) => {
            const plan = plans.find(p => p.id === a.plan_id);
            const amount = plan && plan.total ? plan.total : 0;
            return sum + amount;
        }, 0);

        const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

        return {
            studentCount: users.length,
            totalFees,
            totalPaid,
            pendingDue: totalFees - totalPaid,
            completionRate: totalFees > 0 ? ((totalPaid / totalFees) * 100).toFixed(1) : 0
        };
    }
};

// ── NOTIFICATIONS ─────────────────────────────────────
const Notifications = {
    async getForUser(userId, role) {
        const notifs = JSON.parse(localStorage.getItem('edufee_notifications') || '[]');
        return notifs.filter(n => n.user_id === userId && !n.deleted);
    },

    async add(userId, type, message) {
        const notifs = JSON.parse(localStorage.getItem('edufee_notifications') || '[]');
        notifs.push({
            id: Math.max(...notifs.map(n => n.id), 0) + 1,
            user_id: userId,
            type,
            message,
            is_read: false,
            created_at: new Date().toISOString()
        });
        localStorage.setItem('edufee_notifications', JSON.stringify(notifs));
    },

    async markRead(id) {
        const notifs = JSON.parse(localStorage.getItem('edufee_notifications') || '[]');
        const idx = notifs.findIndex(n => n.id === id);
        if (idx >= 0) notifs[idx].is_read = true;
        localStorage.setItem('edufee_notifications', JSON.stringify(notifs));
    },

    async markAllRead(userId, role) {
        const notifs = JSON.parse(localStorage.getItem('edufee_notifications') || '[]');
        notifs.forEach(n => {
            if (n.user_id === userId) n.is_read = true;
        });
        localStorage.setItem('edufee_notifications', JSON.stringify(notifs));
    }
};

// ── REALTIME ──────────────────────────────────────────
const Realtime = {
    subscribeToNotifications(userId, callback) {
        const interval = setInterval(() => {
            callback();
        }, 2000);
        return { unsubscribe: () => clearInterval(interval) };
    }
};

// Add missing methods to Auth
Auth.onAuthStateChange = function(callback) {
    const user = localStorage.getItem('edufee_current_user');
    if (user) {
        callback('SIGNED_IN', { user: JSON.parse(user) });
    }
};

// Add missing methods to Payments
Payments.getById = async function(id) {
    const payments = DemoStorage.getPayments();
    const users = DemoStorage.getUsers();
    const plans = DemoStorage.getFeePlans();
    const p = payments.find(x => x.id === id);
    if (!p) return null;
    return {
        ...p,
        profiles: users.find(u => u.id === p.student_id),
        fee_plans: plans.find(pl => pl.id === p.plan_id),
        fee_assignments: { id: p.assignment_id }
    };
};

Payments.sumForInstallment = function(payments, assignmentId, installmentNo) {
    return payments
        .filter(p => p.assignment_id === assignmentId && p.installment_no === installmentNo)
        .reduce((s, p) => s + parseFloat(p.amount || 0), 0);
};