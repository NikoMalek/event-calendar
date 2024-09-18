import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface UserData {
  username: string;
  id: number;
}


export default function Welcome({ userData }: { userData: UserData }) {
  const router = useRouter();
  
  async function handleLogout() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 200) {
        router.push('/login');
      } else {
        throw new Error('No se pudo cerrar sesión');
      }
    } catch (error) {
      console.error('Error logging out:', error.message);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cerrar sesión.',
        confirmButtonText: 'Aceptar',
      });
    }
  }
  if (!userData) {
    return <div></div>;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl dark:border-gray-700 text-center">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 dark:bg-gray-800 dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Bienvenido{userData.username ? `, ${userData.username}` : ''}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ID del usuario: {userData.id}
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 p-2 bg-red-500 text-white rounded-lg"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
