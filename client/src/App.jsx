import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import Home from './Home';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Calculator from './Calculator';
import Header from './Header';
import AdminLogin from './AdminLogin';
import Admin from './Admin';
import Navi from './assets/navi';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} ></Route>
        <Route path='/resetPassword/:token' element={<ResetPassword />}></Route>
        <Route path='/calculator' element={<Calculator />}></Route>
        <Route path='/adminlogin' element={<AdminLogin />}></Route>
        <Route path='/admin' element={<Admin />}></Route>
        <Route path='/navi' element={<Navi />}></Route>
        
      </Routes>
    </BrowserRouter>
  );
}


export default App;
