import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupMutation, useValidateMutation } from "./authApiSlice";
import { userSchema } from '../../utils/userValidations';

const Signup = () => {
  const navigate = useNavigate();

  const userRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState<String>('');
  const [password, setPassword] = useState<String>('');
  const [email, setEmail] = useState<String>('');
  const [age, setAge] = useState<Number>(0);
  const [weight, setWeight] = useState<Number>(0);
  const [height, setHeight] = useState<Number>(0);
  const [goal, setGoal] = useState<String>('');
  const [gender, setGender] = useState<String>('');
  const [activity, setActivity] = useState<Number>(0);
  const [errMsg, setErrMsg] = useState<String>('');
  const [code, setCode] = useState<String>('')
  const [inputedCode, setInputedCode] = useState<String>('');

  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();
  const [validate, { isLoading: isValidateLoading }] = useValidateMutation();

  useEffect(() => {
    userRef?.current?.focus();
    setCode('');
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      if(code) {
        if(code != inputedCode) {
          setErrMsg('Codes do not match!');
          return;
        }
        
        const userData = await signup({ username, password, email, age, weight, goal, gender, activity_level: activity, height }).unwrap();
        
        setErrMsg(userData?.msg);

        navigate('/');
      } else {
        const isValid = await userSchema.isValid({
          username, email, password,
        })

        if(!isValid) {
            setErrMsg('Invalid Form!');
            return;
        }

        const userData = await validate({ email, username }).unwrap();
        
        setErrMsg(userData?.msg);
        setCode(userData?.confirmation);
      }
    } catch(err: any) {
      const status = err?.originalStatus || err?.status || err?.response?.status;

      if (status === 409) {
        setErrMsg('User already exists!');
      } else {
        setErrMsg('Signup Failed!');
      }
    }
  }

  const handleUserInput = (e: any) => setUsername(e.target.value);
  const handleInputCodeInput = (e: any) => setInputedCode(e.target.value);
  const handlePwdInput = (e: any) => setPassword(e.target.value);
  const handleEmailInput = (e: any) => setEmail(e.target.value);
  const handleAgeInput = (e:any) => setAge(e.target.value);
  const handleWeightInput = (e:any) => setWeight(e.target.value);
  const handleHeightInput = (e:any) => setHeight(e.target.value);
  const handleGoalInput = (e:any) => setGoal(e.target.value);
  const handleActivityInput = (e:any) => setActivity(e.target.value);
  const handleGenderInput = (e:any) => setGender(e.target.value);

  const content = (isSignupLoading || isValidateLoading) ? <h1>Loading...</h1> : (
    (code) ? (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Verify</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="inputCode" className="block text-sm font-medium text-gray-700">
                Code
              </label>
              <input
                onChange={handleInputCodeInput}
                ref={userRef}
                type="text"
                name="code"
                id="inputCode"
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
        </div>
      </div>
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign up</h1>
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
              <label htmlFor="inputEmail" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                onChange={handleEmailInput}
                type="email"
                name="email"
                id="inputEmail"
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
            <div>
              <label htmlFor="inputAge" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                onChange={handleAgeInput}
                type="text"
                name="age"
                id="inputAge"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="inputHeight" className="block text-sm font-medium text-gray-700">
                Height
              </label>
              <input
                onChange={handleHeightInput}
                type="text"
                name="Height"
                id="inputHeight"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="inputWeight" className="block text-sm font-medium text-gray-700">
                Weight
              </label>
              <input
                onChange={handleWeightInput}
                type="text"
                name="weight"
                id="inputWeight"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="genderSelect">
                Select Gender
              </label>
              <select 
                name="genderSelect" 
                id="genderSelect"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleGenderInput}
              >
                <option>Choose an option</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="goalSelect">
                What's your goal?
              </label>
              <select
                name="goalSelect" 
                id="goalSelect"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleGoalInput}
              >
                <option>Choose an option</option>
                <option value="Gain">Gain Weight</option>
                <option value="Maintain">Maintain Weight</option>
                <option value="Lose">Lose Weight</option>
              </select>
            </div>
            <div>
              <label htmlFor="activitySelect">
                How active are you?
              </label>
              <select 
                name="activitySelect" 
                id="activitySelect"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleActivityInput}
              >
                <option>Choose an option</option>
                <option value={1.2}>Sedentary</option>
                <option value={1.375}>Lightly Active</option>
                <option value={1.55}>Moderately active</option>
                <option value={1.725}>Very active</option>
                <option value={1.9}>Super active</option>
              </select>
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
        </div>
      </div>
    )
  )

  return content;
}

export default Signup;


