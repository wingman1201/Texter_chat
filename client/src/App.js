import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import HomePage from './components/HomePage';
import { ProviderUser } from './UserContext';
import { ConversationsProvider } from './conversationsContext';
function App() {
  return (
   <BrowserRouter>
   <ProviderUser>
    <ConversationsProvider>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/' element={<HomePage/>}/>
    </Routes>
    </ConversationsProvider>
    </ProviderUser>
   </BrowserRouter>
  );
}

export default App;
