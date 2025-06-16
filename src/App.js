import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db, auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Navigation from './components/Navigation';
import AddUser from './add';
import DeleteUser from './delete';

function App() {
  const [user, setUser] = useState(null);
  const [dbUsers, setDbUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCol = collection(db, 'tododate');
        const unsubscribe = onSnapshot(usersCol, (snapshot) => {
          const userList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDbUsers(userList);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('データ取得エラー:', error);
      }
    };

    fetchUsers();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log('ログイン成功！');
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('ログアウト成功！');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const toggleCompletion = async (id, currentStatus) => {
    try {
      const todoRef = doc(db, 'tododate', id);
      await updateDoc(todoRef, {
        completed: !currentStatus,
      });
      console.log('タスクの状態を更新しました');
    } catch (error) {
      console.error('タスクの状態更新エラー:', error);
    }
  };

  return (
    <Router>
      <Navigation />
      <div className="p-4 flex justify-end bg-gray-100">
        {user ? (
          <div>
            <span className="mr-4">こんにちは、{user.displayName} さん</span>
            <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">
              ログアウト
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">
            Googleでログイン
          </button>
        )}
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1 className="text-center p-6">Users from Firestore</h1>
              <table className="border border-green-400 shadow-md rounded-lg mx-auto">
                <thead>
                  <tr className="bg-blue-500">
                    <th className="px-4 py-2 border border-green-400">todo</th>
                    <th className="px-4 py-2 border border-green-400">状態</th>
                  </tr>
                </thead>
                {user ? (
                  <tbody>
                    {dbUsers.map((user) => (
                      <tr key={user.id} className="border-b-2 border-gray-400">
                        <td className="p-4">
                          <span className={user.completed ? 'line-through' : ''}>
                            {user.todo}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleCompletion(user.id, user.completed)}
                            className={`p-2 ${user.completed ? 'bg-yellow-500' : 'bg-green-500'} text-white rounded`}
                          >
                            {user.completed ? '未完了' : '完了'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={2} className="text-gray-600 mt-4">
                        ログインするとデータが見られます。
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          }
        />
        {user ? (
          <>
            <Route path="/add" element={<AddUser />} />
            <Route path="/delete" element={<DeleteUser />} />
          </>
        ) : (
          <>
            <Route path="/add" element={<p>ログインしてください</p>} />
            <Route path="/delete" element={<p>ログインしてください</p>} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
