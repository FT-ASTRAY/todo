// src/add.js
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  const [todo, setName] = useState('');
  const navigate = useNavigate(); // ページ遷移用

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'tododate'), {
        todo,
        completed: false,
      });
      alert('todoを追加しました');
      navigate('/'); // 追加後トップページへ戻る
    } catch (error) {
      alert('追加に失敗しました: ' + error.message);
    }
  };

  return (
    <div>
      <h1>todo追加</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>todo：</label>
          <input value={todo} onChange={(e) => setName(e.target.value)} required />
        </div>

        <button type="submit">追加</button>
      </form>
    </div>
  );
}

export default AddUser;
