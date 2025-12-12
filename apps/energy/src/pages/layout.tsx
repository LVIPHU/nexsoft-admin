import { Outlet } from 'react-router';

function RootLayout() {
  console.log('env', import.meta.env.VITE_AUTH_SERVER_URL);
  return (
    <div>
      <Outlet />
    </div>
  );
}

export { RootLayout };
