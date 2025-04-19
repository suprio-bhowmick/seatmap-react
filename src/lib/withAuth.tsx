'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const withAuth = <P extends object>(Component: React.FC<P>) => {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const isLoggedIn = localStorage.getItem('seatMapAdminLoggedIN');
      if (isLoggedIn !== 'true') {
        router.push('/admin');
      } else {
        setLoading(false);
      }
    }, [router]);

    if (loading) return <div className=" text-center text-2xl mt-5">Please Wait....</div>;
    return <Component {...props} />;
  };
};
