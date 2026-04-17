import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

export default function PrivacyPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-surface custom-scrollbar">
        <TopNav />
        <div className="p-8 max-w-4xl mx-auto w-full py-16">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-8">Privacy Policy</h1>
          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">1. Data We Collect</h2>
              <p>
                JobPilot collects information you provide directly to us, including your username, email address, and job application data (job titles, companies, locations, and job descriptions). We also collect data extracted from job descriptions using AI services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">2. How We Use Your Data</h2>
              <p>
                We use your data to provide the JobPilot service, including:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Managing your job application pipeline.</li>
                <li>Generating AI-powered insights, health scores, and follow-up advice.</li>
                <li>Automatically extracting job details from descriptions you provide.</li>
                <li>Sending you reminders about stale applications.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">3. AI Services</h2>
              <p>
                JobPilot uses Google Gemini AI to process job descriptions and generate advice. By using the service, you acknowledge that the job descriptions you paste are processed by these AI models to extract structured data. We do not use your personal job data to train public AI models.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">4. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data. Your password is encrypted, and your session is secured using JSON Web Tokens (JWT).
              </p>
            </section>

            <div className="pt-8 border-t border-outline-variant/10 text-[10px] font-bold text-outline uppercase tracking-widest">
              Last Updated: April 17, 2026
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
