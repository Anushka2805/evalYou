export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f2c] to-black">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
        <input className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-white/10" placeholder="Email" />
        <input type="password" className="w-full mb-6 px-4 py-3 rounded-lg bg-black/40 border border-white/10" placeholder="Password" />
        <button className="w-full bg-blue-600 hover:bg-blue-500 transition py-3 rounded-lg">
          Sign In →
        </button>
      </div>
    </div>
  );
}