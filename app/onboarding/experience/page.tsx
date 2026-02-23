"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/OnboardingSteps";

export default function ExperiencePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f2c] to-black px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-2">Eval<span className="text-blue-500">You</span>.ai</h1>
        <p className="text-center text-gray-400 mb-8">Let’s set up your profile</p>
        <OnboardingSteps current={1} />
        <h2 className="text-xl font-semibold mb-2">Your Experience</h2>
        <select className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 mb-8">
          <option>Select your level</option>
          <option>Student / Fresher</option>
          <option>0-1 years</option>
          <option>1-3 years</option>
          <option>3+ years</option>
        </select>
        <div className="flex justify-between">
          <button className="text-gray-400" onClick={() => router.back()}>← Back</button>
          <button onClick={() => router.push("/onboarding/resume")} className="bg-blue-600 px-6 py-3 rounded-lg">Continue →</button>
        </div>
      </motion.div>
    </div>
  );
}