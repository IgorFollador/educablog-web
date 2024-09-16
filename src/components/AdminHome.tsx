'use client';

import { useAuth } from "@/context/AuthContext";
import Spinner from "./Spinner";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";


const AdminHome = (
{ 
    children
}: {
    children: ReactNode;
}) => {
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();
  
    if (loading) {
      return <Spinner />;
    }
  
    if (!isLoggedIn) {
      // Retornar nulo ou algum estado de redirecionamento adicional se necessário
      router.push('/auth/signin');
    }

    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} />
            { children }
            <Footer />
        </>
    )
};

export default AdminHome;
