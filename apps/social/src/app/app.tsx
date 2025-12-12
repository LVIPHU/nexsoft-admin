import NxWelcome from './nx-welcome';
import { Route, Routes, Link } from 'react-router';
import { Button } from '@nexsoft-admin/ui';
import { Providers } from '../providers';

export function App() {
  return (
    <Providers>
      <div>
        <Button>Hello</Button>
        <NxWelcome title='@nexsoft-admin/social' />

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
        {/* END: routes */}
      </div>
    </Providers>
  );
}

export default App;
