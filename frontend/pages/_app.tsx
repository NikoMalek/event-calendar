import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import { useDarkMode } from '../lib/useDarkMode'
import '../app/globals.css'

const publicRoutes = ['/', '/login', '/register'];

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{ id: string, username: string } | null>(null);
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (publicRoutes.includes(router.pathname)) {
          setIsAuthenticated(null);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/protected`, {
          credentials: 'include',
        });

        if (response.status === 200) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUserData({ id: data.id, username: data.username });
          
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router.pathname]);

  useEffect(() => {
    if (!isLoading && isAuthenticated === false && !publicRoutes.includes(router.pathname)) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div></div>;
  }

  if (publicRoutes.includes(router.pathname) || isAuthenticated === null) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <Component {...pageProps} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Component {...pageProps} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} userData={userData}/>
    </div>
  );
};

export default MyApp;