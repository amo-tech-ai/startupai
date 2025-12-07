import React from 'react';

const Login: React.FC<{ setPage: (page: any) => void }> = ({ setPage }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600">
            Or <button onClick={() => setPage('signup')} className="font-medium text-primary-600 hover:text-primary-500">start your 14-day free trial</button>
          </p>
        </div>
        <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
                <input type="email" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                <input type="password" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
            <div>
                <button 
                  onClick={() => setPage('dashboard')}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Sign in
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;