export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8 text-sm text-gray-400">
        <div>
          <h3 className="text-white font-semibold mb-2">EvalYou.ai</h3>
          <p>Evaluate Yourself. Elevate Your Interviews.</p>
        </div>

        <div>
          <h4 className="text-white mb-2">Product</h4>
          <ul className="space-y-1">
            <li>Features</li>
            <li>Pricing</li>
            <li>AI Coach</li>
            <li>Reports</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-2">Company</h4>
          <ul className="space-y-1">
            <li>About</li>
            <li>Blog</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-2">Legal</h4>
          <ul className="space-y-1">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 pb-8">
        © 2026 EvalYou.ai — All rights reserved.
      </div>
    </footer>
  );
}