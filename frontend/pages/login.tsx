import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form } from '../components/form';
// import { signIn } from 'app/auth';
import { SubmitButton } from '../components/submit-button';
import '../app/globals.css'




export default function Login() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Iniciar sesión</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Usa tu correo electrónico y contraseña para iniciar sesión
          </p>
        </div>
        <Form
          // action={async (formData: FormData) => {
          action={async () => {
            // 'use server';

            await new Promise((resolve) => setTimeout(resolve, 1000));

            // await signIn('credentials', {
            //   redirectTo: '/protected',
            //   email: formData.get('email') as string,
            //   password: formData.get('password') as string,
            // });
          }}
          >
          <SubmitButton>Iniciar sesión</SubmitButton>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {"¿No tienes una cuenta? "}
            <Link href="/register" className="font-semibold text-gray-800 dark:text-gray-200">
              Regístrate
            </Link>
            {' gratis (100 dolares).'}
          </p>
        </Form>
      </div>
    </div>
  );
}