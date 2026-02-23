export default function Coach() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">AI Interview Coach</h1>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
        Hi there! 👋 I’m your AI interview coach. What would you like to work on?
      </div>

      <div className="flex gap-4">
        <input
          className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3"
          placeholder="Ask me anything about interviews..."
        />
        <button className="bg-blue-600 px-4 rounded-lg">Send</button>
      </div>
    </div>
  );
}