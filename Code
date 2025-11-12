import React, { useState, useEffect } from 'react';
import { Users, School, MessageSquare, ClipboardCheck, Plus, LogOut, Bell, Calendar, AlertTriangle, Info, Megaphone, BookOpen, Clock, Edit, Trash2, Copy } from 'lucide-react';

// Configuration Supabase
const SUPABASE_URL = 'https://hsercitkdpjgftcnctze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzZXJjaXRrZHBqZ2Z0Y25jdHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODY0ODcsImV4cCI6MjA3ODQ2MjQ4N30.LY66K60q4NXV4A_MzVWL9Dd5rhov9ihFUUvbfDFsPSI';

// Client Supabase simple
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

export default function SchoolManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // États pour les données
  const [accounts, setAccounts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [homework, setHomework] = useState([]);
  const [schedules, setSchedules] = useState([]);
  
  // Formulaires
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Chargement initial des données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        supabase.from('accounts').select(),
        supabase.from('classes').select(),
        supabase.from('students').select(),
        supabase.from('messages').select(),
        supabase.from('alerts').select(),
        supabase.from('attendance').select(),
        supabase.from('homework').select(),
        supabase.from('schedules').select()
      ]);

      setAccounts(results[0].data || []);
      setClasses(results[1].data || []);
      setStudents(results[2].data || []);
      setMessages(results[3].data || []);
      setAlerts(results[4].data || []);
      setAttendance(results[5].data || []);
      setHomework(results[6].data || []);
      setSchedules(results[7].data || []);
    } catch (e) {
      console.error('Erreur chargement:', e);
    }
    setLoading(false);
  };

  const handleLogin = () => {
    const user = accounts.find(a => a.username === loginForm.username && a.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('Identifiants incorrects');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const createAccount = async (formData) => {
    const result = await supabase.from('accounts').insert([{ ...formData, role: 'teacher' }]);
    if (result.data) {
      setAccounts([...accounts, ...result.data]);
      setShowAccountForm(false);
    }
  };

  const createClass = async (formData) => {
    const result = await supabase.from('classes').insert([{ ...formData, teacher_id: null }]);
    if (result.data) {
      setClasses([...classes, ...result.data]);
      setShowClassForm(false);
    }
  };

  const updateClassTeacher = async (classId, teacherId) => {
    const result = await supabase.from('classes').update({ teacher_id: teacherId }).eq('id', classId);
    if (result.data) {
      setClasses(classes.map(c => c.id === classId ? { ...c, teacher_id: teacherId } : c));
    }
  };

  const addStudent = async (formData) => {
    const result = await supabase.from('students').insert([formData]);
    if (result.data) {
      setStudents([...students, ...result.data]);
      setShowStudentForm(false);
    }
  };

  const sendMessage = async (formData) => {
    const newMessage = {
      ...formData,
      sender: currentUser.name,
      date: new Date().toISOString()
    };
    const result = await supabase.from('messages').insert([newMessage]);
    if (result.data) {
      setMessages([...messages, ...result.data]);
      setShowMessageForm(false);
    }
  };

  const createAlert = async (formData) => {
    const newAlert = {
      ...formData,
      created_by: currentUser.name,
      date: new Date().toISOString()
    };
    const result = await supabase.from('alerts').insert([newAlert]);
    if (result.data) {
      setAlerts([...alerts, ...result.data]);
      setShowAlertForm(false);
    }
  };

  const deleteAlert = async (id) => {
    if (confirm('Supprimer cette alerte ?')) {
      await supabase.from('alerts').delete().eq('id', id);
      setAlerts(alerts.filter(a => a.id !== id));
    }
  };

  const submitAttendance = async (classId, presentStudents) => {
    const classStudents = students.filter(s => s.class_id === parseInt(classId));
    const reasons = ['Enfant malade', 'Retard', 'Problème de route', 'Rendez-vous médical', 'Absence justifiée'];
    
    const newAttendance = classStudents.map(student => ({
      student_id: student.id,
      student_name: `${student.first_name} ${student.last_name}`,
      class_id: parseInt(classId),
      class_name: classes.find(c => c.id === parseInt(classId))?.name,
      present: presentStudents.includes(student.id),
      reason: presentStudents.includes(student.id) ? null : reasons[Math.floor(Math.random() * reasons.length)],
      date: new Date().toISOString().split('T')[0],
      teacher_name: currentUser.name
    }));
    
    const result = await supabase.from('attendance').insert(newAttendance);
    if (result.data) {
      setAttendance([...attendance, ...result.data]);
      setShowAttendanceForm(false);
      alert('Appel enregistré avec succès !');
    }
  };

  const addHomework = async (formData) => {
    if (editingHomework) {
      const result = await supabase.from('homework').update(formData).eq('id', editingHomework.id);
      if (result.data) {
        setHomework(homework.map(h => h.id === editingHomework.id ? result.data[0] : h));
      }
      setEditingHomework(null);
    } else {
      const newHomework = {
        ...formData,
        teacher_name: currentUser.name,
        teacher_id: currentUser.id,
        created_date: new Date().toISOString()
      };
      const result = await supabase.from('homework').insert([newHomework]);
      if (result.data) {
        setHomework([...homework, ...result.data]);
      }
    }
    setShowHomeworkForm(false);
  };

  const deleteHomework = async (id) => {
    if (confirm('Supprimer ce devoir ?')) {
      await supabase.from('homework').delete().eq('id', id);
      setHomework(homework.filter(h => h.id !== id));
    }
  };

  const editHomework = (hw) => {
    setEditingHomework(hw);
    setShowHomeworkForm(true);
  };

  const addScheduleItem = async (formData) => {
    if (editingSchedule) {
      const result = await supabase.from('schedules').update(formData).eq('id', editingSchedule.id);
      if (result.data) {
        setSchedules(schedules.map(s => s.id === editingSchedule.id ? result.data[0] : s));
      }
      setEditingSchedule(null);
    } else {
      const result = await supabase.from('schedules').insert([formData]);
      if (result.data) {
        setSchedules([...schedules, ...result.data]);
      }
    }
    setShowScheduleEditor(false);
  };

  const deleteScheduleItem = async (id) => {
    if (confirm('Supprimer cet élément ?')) {
      await supabase.from('schedules').delete().eq('id', id);
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  const duplicateScheduleToWeek = async (scheduleItem) => {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const newSchedules = days.map(day => ({
      class_id: scheduleItem.class_id,
      day: day,
      start_time: scheduleItem.start_time,
      end_time: scheduleItem.end_time,
      subject: scheduleItem.subject,
      color: scheduleItem.color
    }));
    const result = await supabase.from('schedules').insert(newSchedules);
    if (result.data) {
      setSchedules([...schedules, ...result.data]);
      alert('Copié sur toute la semaine !');
    }
  };

  const getTeacherClass = () => {
    return classes.find(c => c.teacher_id === currentUser.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <School className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Connexion</h1>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
            >
              Se connecter
            </button>
          </div>
          <p className="text-sm text-gray-500 text-center mt-4">
            Connecté à Supabase ✓
          </p>
        </div>
      </div>
    );
  }

  const teacherClass = currentUser.role === 'teacher' ? getTeacherClass() : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <School className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestion Scolaire</h1>
              <p className="text-sm text-gray-600">{currentUser.name} - {currentUser.role === 'admin' ? 'Administrateur' : 'Enseignant'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton icon={School} label="Tableau de bord" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          {currentUser.role === 'admin' && (
            <>
              <TabButton icon={Users} label="Comptes" active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} />
              <TabButton icon={School} label="Classes" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
              <TabButton icon={Users} label="Élèves" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
              <TabButton icon={ClipboardCheck} label="Appels reçus" active={activeTab === 'attendance-view'} onClick={() => setActiveTab('attendance-view')} />
              <TabButton icon={Bell} label="Alertes" active={activeTab === 'alerts-admin'} onClick={() => setActiveTab('alerts-admin')} />
            </>
          )}
          <TabButton icon={MessageSquare} label="Messages" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
          <TabButton icon={BookOpen} label="Cahier de texte" active={activeTab === 'homework'} onClick={() => setActiveTab('homework')} />
          {currentUser.role === 'teacher' && (
            <>
              <TabButton icon={Bell} label="Alertes" active={activeTab === 'alerts-teacher'} onClick={() => setActiveTab('alerts-teacher')} />
              <TabButton icon={ClipboardCheck} label="Faire l'appel" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
              <TabButton icon={Clock} label="Emploi du temps" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
            </>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'dashboard' && <Dashboard students={students} classes={classes} messages={messages} alerts={alerts} currentUser={currentUser} />}
          {activeTab === 'accounts' && currentUser.role === 'admin' && <AccountsTab accounts={accounts} showForm={showAccountForm} setShowForm={setShowAccountForm} onCreate={createAccount} />}
          {activeTab === 'classes' && currentUser.role === 'admin' && <ClassesTab classes={classes} accounts={accounts} students={students} showForm={showClassForm} setShowForm={setShowClassForm} onCreate={createClass} onUpdateTeacher={updateClassTeacher} />}
          {activeTab === 'students' && currentUser.role === 'admin' && <StudentsTab students={students} classes={classes} showForm={showStudentForm} setShowForm={setShowStudentForm} onAdd={addStudent} />}
          {activeTab === 'messages' && <MessagesTab messages={currentUser.role === 'teacher' && teacherClass ? messages.filter(m => m.class_id === teacherClass.id) : messages} classes={classes} currentUser={currentUser} showForm={showMessageForm} setShowForm={setShowMessageForm} onSend={sendMessage} />}
          {activeTab === 'alerts-admin' && currentUser.role === 'admin' && <AlertsAdminTab alerts={alerts} showForm={showAlertForm} setShowForm={setShowAlertForm} onCreate={createAlert} onDelete={deleteAlert} />}
          {activeTab === 'alerts-teacher' && currentUser.role === 'teacher' && <AlertsTeacherTab alerts={alerts} />}
          {activeTab === 'attendance' && currentUser.role === 'teacher' && <AttendanceTab classes={classes.filter(c => c.teacher_id === currentUser.id)} students={students} showForm={showAttendanceForm} setShowForm={setShowAttendanceForm} onSubmit={submitAttendance} />}
          {activeTab === 'attendance-view' && currentUser.role === 'admin' && <AttendanceViewTab attendance={attendance} />}
          {activeTab === 'homework' && <HomeworkTab homework={currentUser.role === 'teacher' && teacherClass ? homework.filter(h => h.class_id === teacherClass.id) : homework} classes={classes} currentUser={currentUser} teacherClass={teacherClass} showForm={showHomeworkForm} setShowForm={setShowHomeworkForm} editingHomework={editingHomework} setEditingHomework={setEditingHomework} onAdd={addHomework} onEdit={editHomework} onDelete={deleteHomework} />}
          {activeTab === 'schedule' && <ScheduleTab schedules={currentUser.role === 'teacher' && teacherClass ? schedules.filter(s => s.class_id === teacherClass.id) : schedules} classes={classes} currentUser={currentUser} teacherClass={teacherClass} showEditor={showScheduleEditor} setShowEditor={setShowScheduleEditor} editingSchedule={editingSchedule} setEditingSchedule={setEditingSchedule} onAdd={addScheduleItem} onDelete={deleteScheduleItem} onDuplicate={duplicateScheduleToWeek} />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function Dashboard({ students, classes, messages, alerts, currentUser }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-6 rounded-lg">
          <Users className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="text-3xl font-bold text-blue-600">{students.length}</h3>
          <p className="text-gray-700">Élèves</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <School className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="text-3xl font-bold text-green-600">{classes.length}</h3>
          <p className="text-gray-700">Classes</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg">
          <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
          <h3 className="text-3xl font-bold text-purple-600">{messages.length}</h3>
          <p className="text-gray-700">Messages</p>
        </div>
      </div>
      
      {currentUser.role === 'teacher' && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" />
            Alertes importantes
          </h3>
          {alerts.length === 0 ? (
            <p className="text-gray-500">Aucune alerte pour le moment</p>
          ) : (
            <div className="space-y-2">
              {alerts.slice(-5).reverse().map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-800">{alert.title}</p>
                    <p className="text-sm text-gray-700">{alert.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Par {alert.created_by} - {new Date(alert.date).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AccountsTab({ accounts, showForm, setShowForm, onCreate }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des comptes</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Créer un compte
        </button>
      </div>
      {showForm && <AccountForm onSubmit={onCreate} onCancel={() => setShowForm(false)} />}
      <div className="space-y-2">
        {accounts.filter(a => a.role !== 'admin').map(account => (
          <div key={account.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold">{account.name}</p>
              <p className="text-sm text-gray-600">@{account.username}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Enseignant</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassesTab({ classes, accounts, students, showForm, setShowForm, onCreate, onUpdateTeacher }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des classes</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Créer une classe
        </button>
      </div>
      {showForm && <ClassForm onSubmit={onCreate} onCancel={() => setShowForm(false)} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map(cls => (
          <div key={cls.id} className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-bold text-blue-600">{cls.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{cls.level}</p>
            <div className="mt-3">
              <label className="text-sm font-semibold text-gray-700">Enseignant:</label>
              <select value={cls.teacher_id || ''} onChange={(e) => onUpdateTeacher(cls.id, parseInt(e.target.value) || null)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg">
                <option value="">Non assigné</option>
                {accounts.filter(a => a.role === 'teacher').map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-500 mt-2">{students.filter(s => s.class_id === cls.id).length} élève(s)</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentsTab({ students, classes, showForm, setShowForm, onAdd }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des élèves</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Ajouter un élève
        </button>
      </div>
      {showForm && <StudentForm onSubmit={onAdd} onCancel={() => setShowForm(false)} classes={classes} />}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Prénom</th>
              <th className="px-4 py-2 text-left">Classe</th>
              <th className="px-4 py-2 text-left">Date de naissance</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{student.last_name}</td>
                <td className="px-4 py-3">{student.first_name}</td>
                <td className="px-4 py-3">{classes.find(c => c.id === student.class_id)?.name}</td>
                <td className="px-4 py-3">{student.birth_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
