import React from 'react';

const Signup: React.FC<{ setPage: (page: any) => void }> = ({ setPage }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Create your account</h2>
           <p className="mt-2 text-sm text-slate-600">
            Already have an account? <button onClick={() => setPage('login')} className="font-medium text-primary-600 hover:text-primary-500">Log in</button>
          </p>
        </div>
        <div className="mt-8 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <input type="text" required className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="First Name" />
                <input type="text" required className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Last Name" />
            </div>
            <input type="email" required className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Email address" />
            <input type="password" required className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Password" />
            
            <div>
                <button 
                  onClick={() => setPage('dashboard')}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Create Account
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;