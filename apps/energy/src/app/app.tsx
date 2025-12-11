import NxWelcome from './nx-welcome';
import { Route, Routes, Link } from 'react-router-dom';
import { Button } from '@nexsoft-admin/ui';
import { AuthGuard } from '../components/auth/auth-guard';
import { CallbackPage } from '../pages/callback';

export function App() {
  return (
    <div>
      <NxWelcome title='@nexsoft-admin/energy' />

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <Button>Hello</Button>
      <div role='navigation'>
        <ul className='flex gap-2'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/page-2'>Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route path='/callback' element={<CallbackPage />} />
        <Route
          path='/'
          element={
            <AuthGuard>
              <div>
                This is the generated root route. <Link to='/page-2'>Click here for page 2.</Link>
              </div>
            </AuthGuard>
          }
        />
        <Route
          path='/page-2'
          element={
            <AuthGuard>
              <div>
                <Link to='/'>Click here to go back to root page.</Link>
              </div>
            </AuthGuard>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
