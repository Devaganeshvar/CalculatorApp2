import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import Home from './Home';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Calculator from './Calculator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} ></Route>
        <Route path='/resetPassword/:token' element={<ResetPassword />}></Route>
        <Route path='/calculator' element={<Calculator />}></Route>

      </Routes>
    </BrowserRouter>
  );
}


export default App;
