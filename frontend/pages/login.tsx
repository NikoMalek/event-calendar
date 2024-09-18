// import { useDarkMode } from '../lib/useDarkMode';  
import Link from 'next/link';
import { Form } from '../components/form';
// import { signIn } from 'app/auth';
import { SubmitButton } from '../components/submit-button';
import '../app/globals.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRouter } from 'next/router';

const MySwal = withReactContent(Swal)

interface LoginProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Login({ isDarkMode, toggleDarkMode }: LoginProps) {
  // const {isDarkMode, toggleDarkMode} = useDarkMode();
  const router = useRouter();

  
  async function login(formData: FormData) {
    const username = formData.get('email') as string;
    const password = formData.get('password') as string;


    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      console.log('User logged in with ID:', data.user._id);
      if (response.status === 200) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonText: "Aceptar",
        customClass: {
          popup: isDarkMode ? 'dark' : '',
        }
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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Iniciar sesión</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Usa tu correo electrónico y contraseña para iniciar sesión
          </p>
        </div>
        <Form action={login}>
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