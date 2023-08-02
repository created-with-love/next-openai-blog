import Link from "next/link";
import Image from 'next/image';
import {useUser} from'@auth0/nextjs-auth0/client';

export default function Home() {
  const { user, error } = useUser();

  return (
    <div>
      <h1>Homepage</h1>
      <div>
        {error?.message && <div>{error.message}</div>}
        {!user && <Link href="/api/auth/login">Login</Link>}
        {user && (
          <div>
            <Image src={user.picture} alt={user.name} height={50} width={50} />
            <p>Email: {user.email}</p>
            <p>Hello {user?.nickname ? user.nickname : 'friend'}, <Link href="/api/auth/logout">Logout</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
