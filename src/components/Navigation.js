import { Link } from 'react-router-dom';
import { FcManager, FcFullTrash ,FcDataRecovery } from "react-icons/fc"; // ← 使い䛯いアイコンをインポート
import { FaSearchengin } from "react-icons/fa";

function Navigation() {
return (

<nav className="bg-gray-100 pt-6 text-center">
<Link to="/"><FcManager style={{ display:'inline-block', marginRight: '5px' }} />一覧</Link> |
<Link to="/add"><FcDataRecovery style={{ display:'inline-block', marginRight: '5px' }} />todo追加 </Link> |
<Link to="/delete"><FcFullTrash style={{ display:'inline-block', marginRight: '5px' }} />todo削除 </Link> |

</nav>

);
}

export default Navigation;