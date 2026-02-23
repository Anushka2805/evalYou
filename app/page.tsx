import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import StepCard from "@/components/StepCard";

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="inline-block mb-6 px-4 py-1 rounded-full border border-blue-500/30 text-blue-400 text-sm">
            AI-Powered Interview Intelligence
          </span>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Ace Your Interviews <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              with AI Feedback
            </span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            Analyze your confidence, communication, body language, and answers.
            Get personalized coaching to land your dream job.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="/auth/signup"
              className="bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-xl font-medium"
            >
              Start Free Mock Interview →
            </a>
            <a
              href="/auth/signup"
              className="border border-white/20 hover:border-white/40 transition px-6 py-3 rounded-xl text-gray-300"
            >
              Upload CV & Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">
          Everything you need to nail interviews
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Comprehensive AI analysis across every dimension of your interview.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon="🎤"
            title="Speech Analysis"
            desc="Analyze speed, fillers, pauses, clarity."
          />
          <FeatureCard
            icon="👀"
            title="Face & Body Language"
            desc="Track eye contact, posture, expressions."
          />
          <FeatureCard
            icon="🧠"
            title="Answer Quality"
            desc="Check relevance, STAR, grammar, keywords."
          />
          <FeatureCard
            icon="📊"
            title="Detailed Reports"
            desc="Track progress with beautiful analytics."
          />
          <FeatureCard
            icon="🤖"
            title="AI Coach"
            desc="Get tips, rewrites, and practice guidance."
          />
          <FeatureCard
            icon="⚡"
            title="Smart Scoring"
            desc="Role-weighted scoring system."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">
          Three steps to interview mastery
        </h2>
        <p className="text-center text-gray-400 mb-12">
          From CV upload to personalized coaching in minutes.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            step="01"
            title="Upload CV & Choose Role"
            desc="We parse your skills to generate tailored questions."
          />
          <StepCard
            step="02"
            title="Take Mock Interview"
            desc="Record answers via video & audio."
          />
          <StepCard
            step="03"
            title="Get AI Feedback"
            desc="Receive insights, improved answers & plan."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24">
        <h2 className="text-3xl font-bold mb-4">
          Ready to ace your next interview?
        </h2>
        <p className="text-gray-400 mb-8">
          Start practicing with AI feedback today. No credit card required.
        </p>
        <a
          href="/auth/signup"
          className="bg-blue-600 hover:bg-blue-500 transition px-8 py-4 rounded-xl font-medium"
        >
          Start Free — It’s Easy →
        </a>
      </section>

      <Footer />
    </main>
  );
}