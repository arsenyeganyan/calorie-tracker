// import '../../css/auth.css';
import { useRef, useEffect, useState } from "react";
import { useLoginMutation } from "./authApiSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const userRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState<String>('');
  const [password, setPassword] = useState<String>('');
  const [errMsg, setErrMsg] = useState<String>('');

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      const userData = await login({ username, password }).unwrap();
      
      setErrMsg(userData?.msg);
      
      navigate('/');
    } catch(err: any) {
      const status = err?.originalStatus || err?.status || err?.response?.status;

      if (status === 401) {
        setErrMsg('Unauthorized!');
      } else {
        setErrMsg('Login Failed!');
      }
    }
  }

  const handleUserInput = (e: any) => setUsername(e.target.value);
  const handlePwdInput = (e: any) => setPassword(e.target.value);

  const content = isLoading ? <h1>Loading...</h1> : (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Log in</h1>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="inputUserName" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          onChange={handleUserInput}
          ref={userRef}
          type="text"
          name="username"
          id="inputUserName"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="exampleInputPassword1" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          onChange={handlePwdInput}
          type="password"
          name="password"
          id="exampleInputPassword1"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      {errMsg && (
        <p className="text-red-600 text-sm" aria-live="assertive">
          {errMsg}
        </p>
      )}
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
      >
        Submit
      </button>
    </form>
    <div className="mt-6 text-center text-sm text-gray-600">
      <p>Have no account yet?</p>
      <Link
        to="/signup"
        className="text-indigo-600 hover:underline font-medium"
        id="link"
      >
        Sign up
      </Link>
    </div>
  </div>
</div>

  )

  return content;
}

export default Login;