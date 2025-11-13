<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion Scolaire</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
    </style>
</head>
<body class="bg-gray-100">
    <div id="app"></div>

    <script>
        // Configuration Supabase
        const SUPABASE_URL = 'https://hsercitkdpjgftcnctze.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzZXJjaXRrZHBqZ2Z0Y25jdHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODY0ODcsImV4cCI6MjA3ODQ2MjQ4N30.LY66K60q4NXV4A_MzVWL9Dd5rhov9ihFUUvbfDFsPSI';

        // Client Supabase
        const supabase = {
            from: (table) => ({
                select: async (columns = '*') => {
                    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}`, {
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                        }
                    });
                    return { data: await res.json(), error: res.ok ? null : 'Error' };
                },
                insert: async (data) => {
                    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify(data)
                    });
                    return { data: await res.json(), error: res.ok ? null : 'Error' };
                },
                update: async (data) => ({
                    eq: async (column, value) => {
                        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`, {
                            method: 'PATCH',
                            headers: {
                                'apikey': SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                                'Content-Type': 'application/json',
                                'Prefer': 'return=representation'
                            },
                            body: JSON.stringify(data)
                        });
                        return { data: await res.json(), error: res.ok ? null : 'Error' };
                    }
                }),
                delete: async () => ({
                    eq: async (column, value) => {
                        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`, {
                            method: 'DELETE',
                            headers: {
                                'apikey': SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                            }
                        });
                        return { error: res.ok ? null : 'Error' };
                    }
                })
            })
        };

        // État global
        let state = {
            currentUser: null,
            activeTab: 'dashboard',
            accounts: [],
            classes: [],
            students: [],
            messages: [],
            alerts: [],
            attendance: [],
            homework: [],
            schedules: [],
            loading: true
        };

        // Chargement des données
        async function loadData() {
            state.loading = true;
            render();
            
            try {
                const [acc, cls, stu, msg, alt, att, hmw, sch] = await Promise.all([
                    supabase.from('accounts').select(),
                    supabase.from('classes').select(),
                    supabase.from('students').select(),
                    supabase.from('messages').select(),
                    supabase.from('alerts').select(),
                    supabase.from('attendance').select(),
                    supabase.from('homework').select(),
                    supabase.from('schedules').select()
                ]);

                state.accounts = acc.data || [];
                state.classes = cls.data || [];
                state.students = stu.data || [];
                state.messages = msg.data || [];
                state.alerts = alt.data || [];
                state.attendance = att.data || [];
                state.homework = hmw.data || [];
                state.schedules = sch.data || [];
            } catch (e) {
                console.error('Erreur:', e);
            }
            
            state.loading = false;
            render();
        }

        // Login
        function handleLogin(username, password) {
            const user = state.accounts.find(a => a.username === username && a.password === password);
            if (user) {
                state.currentUser = user;
                render();
            } else {
                alert('Identifiants incorrects');
            }
        }

        // Logout
        function handleLogout() {
            state.currentUser = null;
            state.activeTab = 'dashboard';
            render();
        }

        // Render
        function render() {
            const app = document.getElementById('app');

            if (state.loading) {
                app.innerHTML = `
                    <div class="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                        <div class="text-white text-2xl">Chargement...</div>
                    </div>
                `;
                return;
            }

            if (!state.currentUser) {
                app.innerHTML = `
                    <div class="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
                        <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                            <svg class="w-16 h-16 mx-auto mb-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">Connexion</h1>
                            <div class="space-y-4">
                                <input type="text" id="username" placeholder="Nom d'utilisateur" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                <input type="password" id="password" placeholder="Mot de passe" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                <button onclick="login()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                                    Se connecter
                                </button>
                            </div>
                            <p class="text-sm text-gray-500 text-center mt-4">Connecté à Supabase ✓</p>
                        </div>
                    </div>
                `;
                
                document.getElementById('password').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') login();
                });
                return;
            }

            // Interface principale
            app.innerHTML = `
                <div class="min-h-screen bg-gray-100">
                    <div class="bg-white shadow-md">
                        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                <div>
                                    <h1 class="text-2xl font-bold text-gray-800">Gestion Scolaire</h1>
                                    <p class="text-sm text-gray-600">${state.currentUser.name} - ${state.currentUser.role === 'admin' ? 'Administrateur' : 'Enseignant'}</p>
                                </div>
                            </div>
                            <button onclick="handleLogout()" class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                                Déconnexion
                            </button>
                        </div>
                    </div>

                    <div class="max-w-7xl mx-auto px-4 py-6">
                        <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
                            <button onclick="changeTab('dashboard')" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${state.activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                📊 Tableau de bord
                            </button>
                            ${state.currentUser.role === 'admin' ? `
                                <button onclick="changeTab('accounts')" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${state.activeTab === 'accounts' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                    👥 Comptes
                                </button>
                                <button onclick="changeTab('classes')" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${state.activeTab === 'classes' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                    🏫 Classes
                                </button>
                                <button onclick="changeTab('students')" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${state.activeTab === 'students' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                    🎓 Élèves
                                </button>
                                <button onclick="changeTab('alerts')" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${state.activeTab === 'alerts' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                    🚨 Alertes
                                </button>
                            ` : `
                                <button onclick="changeTab('alerts')" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${state.activeTab === 'alerts' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                    🚨 Alertes
                                </button>
                                <button onclick="changeTab('attendance')" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${state.activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                    ✓ Faire l'appel
                                </button>
                                <button onclick="changeTab('schedule')" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${state.activeTab === 'schedule' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                    🕐 Emploi du temps
                                </button>
                            `}
                            <button onclick="changeTab('messages')" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${state.activeTab === 'messages' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                💬 Messages
                            </button>
                            <button onclick="changeTab('homework')" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${state.activeTab === 'homework' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">
                                📚 Cahier de texte
                            </button>
                        </div>

                        <div class="bg-white rounded-xl shadow-lg p-6" id="content">
                            ${renderContent()}
                        </div>
                    </div>
                </div>
            `;
        }

        function renderContent() {
            if (state.activeTab === 'dashboard') {
                return `
                    <h2 class="text-2xl font-bold mb-6">Tableau de bord</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-blue-100 p-6 rounded-lg">
                            <div class="text-4xl mb-2">👥</div>
                            <h3 class="text-3xl font-bold text-blue-600">${state.students.length}</h3>
                            <p class="text-gray-700">Élèves</p>
                        </div>
                        <div class="bg-green-100 p-6 rounded-lg">
                            <div class="text-4xl mb-2">🏫</div>
                            <h3 class="text-3xl font-bold text-green-600">${state.classes.length}</h3>
                            <p class="text-gray-700">Classes</p>
                        </div>
                        <div class="bg-purple-100 p-6 rounded-lg">
                            <div class="text-4xl mb-2">💬</div>
                            <h3 class="text-3xl font-bold text-purple-600">${state.messages.length}</h3>
                            <p class="text-gray-700">Messages</p>
                        </div>
                    </div>
                    ${state.currentUser.role === 'teacher' && state.alerts.length > 0 ? `
                        <div class="mt-6">
                            <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                                🚨 Alertes importantes
                            </h3>
                            <div class="space-y-2">
                                ${state.alerts.slice(-5).reverse().map(alert => `
                                    <div class="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                                        <div class="flex-1">
                                            <p class="font-semibold text-red-800">${alert.title}</p>
                                            <p class="text-sm text-gray-700">${alert.description}</p>
                                            <p class="text-xs text-gray-500 mt-1">Par ${alert.created_by} - ${new Date(alert.date).toLocaleString()}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                `;
            }

            if (state.activeTab === 'alerts') {
                if (state.currentUser.role === 'admin') {
                    return `
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold">Gestion des alertes</h2>
                            <button onclick="showAlertForm()" class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                ➕ Créer une alerte
                            </button>
                        </div>
                        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <p class="text-sm text-gray-700"><strong>Info:</strong> Ces alertes seront visibles par tous les enseignants.</p>
                        </div>
                        <div class="space-y-3">
                            ${state.alerts.map(alert => `
                                <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded flex justify-between">
                                    <div class="flex-1">
                                        <h3 class="font-bold text-red-800">${alert.title}</h3>
                                        <p class="text-sm text-gray-700 mt-1">${alert.description}</p>
                                        <p class="text-xs text-gray-500 mt-2">Par ${alert.created_by} - ${new Date(alert.date).toLocaleString()}</p>
                                    </div>
                                    <button onclick="deleteAlert(${alert.id})" class="text-red-600 hover:text-red-800 ml-4">🗑️</button>
                                </div>
                            `).join('')}
                        </div>
                    `;
                } else {
                    return `
                        <h2 class="text-2xl font-bold mb-6">Alertes de l'administration</h2>
                        ${state.alerts.length === 0 ? '<p class="text-gray-500">Aucune alerte pour le moment</p>' : `
                            <div class="space-y-3">
                                ${state.alerts.map(alert => `
                                    <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                                        <h3 class="font-bold text-red-800">${alert.title}</h3>
                                        <p class="text-sm text-gray-700 mt-1">${alert.description}</p>
                                        <p class="text-xs text-gray-500 mt-2">Par ${alert.created_by} - ${new Date(alert.date).toLocaleString()}</p>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    `;
                }
            }

            if (state.activeTab === 'messages') {
                const userMessages = state.currentUser.role === 'teacher' 
                    ? state.messages.filter(m => {
                        const teacherClass = state.classes.find(c => c.teacher_id === state.currentUser.id);
                        return teacherClass && m.class_id === teacherClass.id;
                    })
                    : state.messages;

                return `
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">Messages</h2>
                        ${state.currentUser.role === 'admin' ? `
                            <button onclick="showMessageForm()" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                ➕ Nouveau message
                            </button>
                        ` : ''}
                    </div>
                    <div class="space-y-3">
                        ${userMessages.map(msg => {
                            const bgColor = msg.category === 'sortie' ? 'bg-green-50 border-green-300' : msg.category === 'information' ? 'bg-blue-50 border-blue-300' : 'bg-orange-50 border-orange-300';
                            return `
                                <div class="${bgColor} p-4 border-l-4 rounded">
                                    <div class="flex justify-between items-start">
                                        <h3 class="font-bold">${msg.title}</h3>
                                        <span class="text-xs text-gray-500">${new Date(msg.date).toLocaleString()}</span>
                                    </div>
                                    <p class="text-sm text-gray-700 mt-1">${msg.content}</p>
                                    <p class="text-xs text-gray-500 mt-2">
                                        Classe: ${state.classes.find(c => c.id === msg.class_id)?.name} • Par: ${msg.sender}
                                    </p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }

            if (state.activeTab === 'homework') {
                const userHomework = state.currentUser.role === 'teacher'
                    ? state.homework.filter(h => {
                        const teacherClass = state.classes.find(c => c.teacher_id === state.currentUser.id);
                        return teacherClass && h.class_id === teacherClass.id;
                    })
                    : state.homework;

                return `
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">Cahier de texte</h2>
                        ${state.currentUser.role === 'teacher' ? `
                            <button onclick="showHomeworkForm()" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                ➕ Ajouter un devoir
                            </button>
                        ` : ''}
                    </div>
                    <div class="space-y-4">
                        ${userHomework.map(hw => `
                            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 class="font-bold text-lg">${hw.subject}</h3>
                                        <p class="text-sm text-gray-600">Classe: ${state.classes.find(c => c.id === hw.class_id)?.name}</p>
                                    </div>
                                    ${state.currentUser.role === 'admin' ? `
                                        <button onclick="deleteHomework(${hw.id})" class="p-2 text-red-600 hover:bg-red-100 rounded">🗑️</button>
                                    ` : ''}
                                </div>
                                <p class="text-gray-700 mb-2">${hw.description}</p>
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-500">Pour le: ${hw.due_date}</span>
                                    <span class="text-gray-500">Par ${hw.teacher_name}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            return '<p class="text-gray-500">Section en construction...</p>';
        }

        function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            handleLogin(username, password);
        }

        function changeTab(tab) {
            state.activeTab = tab;
            render();
        }

        async function showAlertForm() {
            const title = prompt('Type d\'alerte:\n1. Alerte intrusion\n2. Exercice incendie\n3. Évacuation\n4. Confinement\n5. Incident');
            if (!title) return;
            const description = prompt('Description:');
            if (!description) return;

            const newAlert = {
                title: title,
                description: description,
                created_by: state.currentUser.name,
                date: new Date().toISOString()
            };

            const result = await supabase.from('alerts').insert([newAlert]);
            if (result.data) {
                state.alerts.push(...result.data);
                render();
            }
        }

        async function deleteAlert(id) {
            if (!confirm('Supprimer cette alerte ?')) return;
            await supabase.from('alerts').delete().eq('id', id);
            state.alerts = state.alerts.filter(a => a.id !== id);
            render();
        }

        async function showMessageForm() {
            const title = prompt('Titre du message:');
            if (!title) return;
            const content = prompt('Contenu:');
            if (!content) return;
            const classId = prompt('ID de la classe:');
            if (!classId) return;
            const category = prompt('Catégorie (information/sortie/annonce):');
            if (!category) return;

            const newMessage = {
                title: title,
                content: content,
                class_id: parseInt(classId),
                category: category,
                sender: state.currentUser.name,
                date: new Date().toISOString()
            };

            const result = await supabase.from('messages').insert([newMessage]);
            if (result.data) {
                state.messages.push(...result.data);
                render();
            }
        }

        async function showHomeworkForm() {
            const subject = prompt('Matière:');
            if (!subject) return;
            const description = prompt('Description:');
            if (!description) return;
            const dueDate = prompt('Date limite (YYYY-MM-DD):');
            if (!dueDate) return;

            const teacherClass = state.classes.find(c => c.teacher_id === state.currentUser.id);
            if (!teacherClass) {
                alert('Vous n\'avez pas de classe assignée');
                return;
            }

            const newHomework = {
                subject: subject,
                description: description,
                due_date: dueDate,
                class_id: teacherClass.id,
                teacher_id: state.currentUser.id,
                teacher_name: state.currentUser.name,
                created_date: new Date().toISOString()
            };

            const result = await supabase.from('homework').insert([newHomework]);
            if (result.data) {
                state.homework.push(...result.data);
                render();
            }
        }

        async function deleteHomework(id) {
            if (!confirm('Supprimer ce devoir ?')) return;
            await supabase.from('homework').delete().eq('id', id);
            state.homework = state.homework.filter(h => h.id !== id);
            render();
        }

        // Init
        loadData();
    </script>
</body>
</html>
