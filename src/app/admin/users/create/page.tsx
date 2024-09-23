'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';


const CreateUserPage = () => {
    const [login, setLogin] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [cpf, setCPF] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    
    const handleRegister = async (e:any) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const result = await fetch(`https://apl-back-educablog-1.onrender.com/usuario`,
          {
            method:'POST',
            headers:{
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
            login:login,
            senha:password,
            pessoa: {
              cpf: cpf,
              nome: name,
              email: email,
              dataNascimento: date,
              telefone: phone,
            },
            })
          }
        )
        setLoading(false);
        if (!result.ok) {
                if (result.status === 500 || result.status === 409) {
                 setError('Erro: Este login ou email já está em uso.');
               } else {
                   setError('Erro ao registrar usuário. Tente novamente.');
                 }
        } else {
              router.push('/auth/signin'); 
          }
      } catch (err) {
        console.error('Erro ao tentar registrar o usuário:', err);
        setError('Erro ao tentar registrar o usuário. Por favor, tente novamente.');
        setLoading(false);
      } 

    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
          <h2 className="text-2xl font-bold text-center">Cadastro</h2>
          {error && <p className="text-center text-red-500">{error}</p>}
          <form className="space-y-6">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                Login
              </label>
              <input
                type="login"
                id="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <input 
                maxLength={14} 
                placeholder="000.000.000-00"
                type="text"
                id="cpf"
                value={cpf}
                onChange={(e) => setCPF(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                maxLength={15} 
                placeholder="(99)99999-9999"
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Data de Nascimento
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              onClick={handleRegister}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
        </div>
      </div>
    );

}

export default CreateUserPage;