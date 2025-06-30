import { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useLogoutMutation, useGetSessionQuery } from '../features/auth/authApiSlice';

const Header = () => {
    const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState('');
    const [logout] = useLogoutMutation();

    const { data: res } = useGetSessionQuery();

    const handleLogout = async (e: any) => {
        e.preventDefault();

        try {
            const userData = await logout({}).unwrap();
            console.log(userData);

            navigate('/login');
        } catch(err: any) {
            const status = err?.originalStatus || err?.status || err?.response?.status;
            setErrMsg(`Logout failed, status code: ${status}!`);
        }
    }

  return (
    <>
        <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Arsen's Calorie Tracker</h1>
            <nav className="space-x-6 text-sm font-medium">
                <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                <Link to="#" className="text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700" onClick={handleLogout}>
                    Log Out
                </Link>
                {errMsg}
            </nav>
        </div>
        </header>
        <Outlet />
    </>
  )
}

export default Header