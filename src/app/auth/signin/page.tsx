'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await signIn("credentials", {
      login,
      senha,
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
