export default function Settings() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-gray-400 mb-6">Manage your profile and preferences.</p>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3">
          <option>Select role</option>
        </select>
        <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3">
          <option>Select level</option>
        </select>
        <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3">
          <option>Medium</option>
        </select>

        <button className="w-full bg-blue-600 py-3 rounded-lg">
          Save Changes
        </button>
      </div>
    </div>
  );
}