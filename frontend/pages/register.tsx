import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form } from '../components/form';
import { useRouter } from 'next/router';
import { SubmitButton } from '../components/submit-button';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


export default function Register() {
  
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  async function register(formData: FormData) {
    const username = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      console.log('User registered with ID:', data.id);
      MySwal.fire({
        icon: "success",
        title: "Success",
        text: "Usuario registrado con éxito",
        confirmButtonText: "Aceptar",
        customClass: {
          popup: isDarkMode ? 'dark' : '',
        },
        
      })
      router.push('/login');
    } catch (error) {
      console.error('Error registering user:', error.message);
      MySwal.fire({
        icon: "warning",
        title: "Error",
        text: error.message,
        confirmButtonText: "Aceptar ",
        customClass: {
          popup: isDarkMode ? 'dark' : '',
        },
      })
    }
  }



  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
        >
          {isDarkMode ? '🌞' : '🌜'}
        </button>
      </div>
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl dark:border-gray-700">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center dark:bg-gray-800 dark:border-gray-600 sm:px-16">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Regístrate</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Crea una cuenta con tu correo electrónico y contraseña
          </p>
        </div>
        <Form action={register}>
          <SubmitButton>Regístrate</SubmitButton>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {'¿Ya tienes una cuenta? '}
            <Link href="/login" className="font-semibold text-gray-800 dark:text-gray-200">
            Inicia sesión
            </Link>
            {' en su lugar.'}
          </p>
        </Form>
      </div>
    </div>
  );
}