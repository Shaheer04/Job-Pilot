import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

export default function TermsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-surface custom-scrollbar">
        <TopNav />
        <div className="p-8 max-w-4xl mx-auto w-full py-16">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-8">Terms of Service</h1>
          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">1. Acceptable Use</h2>
              <p>
                JobPilot is designed to help job seekers manage their application pipeline. You agree not to use the service for any illegal purposes, including spamming AI endpoints or scraping unauthorized data.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">2. AI Accuracy Disclaimer</h2>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
                <p className="text-primary font-bold mb-2 uppercase tracking-widest text-[10px]">Important Notice</p>
                <p className="text-sm font-medium italic">
                  JobPilot provides AI-generated analysis, health scores, and follow-up templates based on the job data you provide. These insights are for informational purposes only. We do not guarantee the accuracy of AI extractions or the success of any job application based on our recommendations.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">3. User Responsibility</h2>
              <p>
                You are responsible for the information you provide and any actions you take based on JobPilot's advice. Always verify job details and double-check AI-generated email drafts before sending them to recruiters.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">4. Account Termination</h2>
              <p>
                We reserve the right to terminate or suspend accounts that abuse our AI services or violate these terms.
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
