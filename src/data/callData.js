// ============================================================================
// LeadSync — Live Analyzed Audio Call Records
// ============================================================================

export const CALLS = [
  {
    id: "CALL-2026-001",
    customerName: "Vikas",
    archetype: "Self-Directed Learner",
    date: "2026-10-10",
    duration: "3:24",
    durationSeconds: 204,
    agent: "Rahul (TechUp Academy)",
    phone: "+91 98450 12890",
    audioFile: "/audio_files/call_recording_nishant.mp3",

    sentiment: "neutral",
    sentimentScore: 48,
    purchaseProbability: 8,
    purchaseJustification:
      "Customer formally declined enrollment; possesses high autodidactic discipline, already understands the engineering landscape, and rejects paid aggregation of open-source documentation.",

    transcript: [
      { speaker: "Agent", text: "Hello? Hi, am I speaking with Vikas?" },
      { speaker: "Customer", text: "Yes, speaking. Who's this?" },
      { speaker: "Agent", text: "Hi Vikas, this is Rahul from TechUp Academy. I'm calling because you recently downloaded our syllabus for the Mastering Computer Science and Full Stack Development Program. How are you doing today?" },
      { speaker: "Customer", text: "Oh, hi Rahul. I'm good. Yeah, I was just browsing through the curriculum to see what you guys are offering." },
      { speaker: "Agent", text: "That's great! Since you've seen the syllabus, you know we aren't just teaching basic coding. We cover everything from data structures and algorithms to system design and even AI/ML integration. It's a six-month intensive bootcamp with a 100% placement guarantee. Are you looking to pivot into an SDE role?" },
      { speaker: "Customer", text: "Well, I've been considering it. I see you've included Docker and Kubernetes in the final module. That's a good touch. Most bootcamps ignore the DevOps side of things." },
      { speaker: "Agent", text: "Exactly! You clearly know your stuff. Most people don't even notice that. We also have mentors from Google and Amazon taking the weekend deep-dive sessions. The idea is to take you from a beginner to someone who can handle a high-scale production environment." },
      { speaker: "Customer", text: "Right. And the Capstone Project—it says it's a microservices-based architecture." },
      { speaker: "Agent", text: "Yes! You'll be building a real-time banking application. It covers load balancing, database sharding, and high availability. It's exactly what recruiters look for in a senior-grade portfolio. Honestly Vikas, with your background and our roadmap, you could easily land a package in the 15-to-20 LPA range." },
      { speaker: "Customer", text: "I get it, Rahul. It's a well-structured course. You've mapped the industry requirements quite accurately. You're offering the structure, the networking, and the project-based learning all in one package." },
      { speaker: "Agent", text: "Precisely! And since today is the last day of the month, I can offer you a 25% early bird discount. Plus we have no-cost EMI options. It's a small investment for a massive career jump. Shall I send you the payment link?" },
      { speaker: "Customer", text: "I appreciate the offer, Rahul. Truly, the curriculum is solid and for someone who needs hand-holding, it's perfect." },
      { speaker: "Agent", text: "So can I count you in for the cohort starting Monday?" },
      { speaker: "Customer", text: "Actually, no. I'm going to have to pass." },
      { speaker: "Agent", text: "Oh, may I ask why? You seem to really like the structure. Is it the fee? We can talk to the manager about a further discount." },
      { speaker: "Customer", text: "No, it's not the money. I understand the value you're providing, but I've realized that everything in your syllabus is available via open-source documentation and high-quality free resources. Since I already have the discipline to learn on my own and a decent network on LinkedIn, I don't think I need to pay for the packaging of that information." },
      { speaker: "Agent", text: "But Vikas, the placement support, the job guarantee..." },
      { speaker: "Customer", text: "I know how those guarantees work, Rahul. If I'm good enough to pass company interviews, I don't need the guarantee. If I'm not, a certificate won't save me anyway. I'd rather spend these six months building my own unique projects than the same banking app 500 other students will have." },
      { speaker: "Agent", text: "Well, I see you really thought this through. It's rare to talk to someone who knows the landscape so well." },
      { speaker: "Customer", text: "It's a great product for the right person, Rahul. Just not for me. But I appreciate the call. Good luck with the cohort." },
      { speaker: "Agent", text: "Thanks for your time. If you change your mind, you have my number." },
      { speaker: "Customer", text: "Will do. Take care. Bye." },
    ],

    keyInsights: [
      "🟢 **Curriculum & DevOps Validation**: Prospect praised inclusion of Docker & Kubernetes; validated that the curriculum accurately mirrors modern production standards.",
      "🔴 **Value Proposition Deficit**: High self-discipline prospect concludes open-source documentation supersedes paid packaging and curriculum fees.",
      "🔴 **Placement Guarantee Disregarded**: Prospect dismissed the 100% placement guarantee, articulating that individual technical merit matters more than institutional assurances.",
      "🟡 **Price Inelasticity**: Offering a 25% discount and financing options had zero leverage because pricing was not the objection.",
      "🔵 **Lead Status — Autodidact Disqualified**: Archive lead from immediate sales follow-up; keep record for open-source engineering hackathons or alumni networking.",
    ],

    behavioralSummary:
      "Vikas represents an advanced, self-directed prospect who conducted a thorough, objective assessment of the TechUp Academy curriculum. While appreciative of modern industry touches like microservices and DevOps containerization, he possesses high autodidactic discipline and an established network, leading him to conclude that commercial tuition merely repackages freely available open-source documentation. His rejection is polite, rational, and impervious to sales tactics such as discounts or placement promises. Probability of conversion is 8%.",
  },

  {
    id: "CALL-2026-002",
    customerName: "Sidharth",
    archetype: "Eager Buyer",
    date: "2026-10-10",
    duration: "3:49",
    durationSeconds: 229,
    agent: "Rahul (TechUp Academy)",
    phone: "+91 98231 77450",
    audioFile: "/audio_files/call_recording_bill.mp3",

    sentiment: "positive",
    sentimentScore: 96,
    purchaseProbability: 98,
    purchaseJustification:
      "Closed-Won on call: Customer validated live code reviews and mentorship to escape 'tutorial hell', accepted 12-month no-cost EMI, and completed payment verification before call termination.",

    transcript: [
      { speaker: "Agent", text: "Hello, is this Sidharth? This is Rahul from TechUp Academy." },
      { speaker: "Customer", text: "Hey Rahul, yes, this is Sidharth. Glad you called! I was actually thinking about your team today." },
      { speaker: "Agent", text: "That's great to hear! I saw you just finished our three-day Python workshop last night. I wanted to reach out and see what you thought about the final project we built." },
      { speaker: "Customer", text: "Oh man, the workshop was eye-opening. I never realized how much I was overcomplicating my logic until I saw the instructor's approach. It was much smoother than I expected." },
      { speaker: "Agent", text: "I'm glad you liked it! That project is actually just 5% of what we do in the full computer science mastery program. I noticed in your profile that you've been trying to learn on your own for a few months. How's that journey going so far?" },
      { speaker: "Customer", text: "Honestly, it's been tough. I watch YouTube videos and follow tutorials, but as soon as I close the video and try to build something from scratch, I'm totally lost. I feel like I'm missing the big picture of how professional software is actually made." },
      { speaker: "Agent", text: "That is exactly the 'tutorial hell' most students get stuck in, Sidharth. You learn the syntax but not the architecture. In our professional cohort, we move past the basics in the first two weeks and dive straight into data structures and backend architecture." },
      { speaker: "Customer", text: "That's exactly what I need. I'm tired of just copying code. I want to understand why a certain database is used or how to make an app that can handle actual users without crashing." },
      { speaker: "Agent", text: "Exactly. And the best part is the live code reviews. Every Friday, a senior engineer from a top tech firm will sit with you, look at your code and tell you how to optimize it for production. It's like having a personal coach." },
      { speaker: "Customer", text: "Wow, really? A live review? That would save me months of trial and error. I've been looking for a mentor, but it's so hard to find someone experienced who actually has the time to help." },
      { speaker: "Agent", text: "It makes a huge difference. Plus, we have a dedicated career accelerator wing. They don't just send your resume—they do mock interviews, fix your GitHub portfolio, and even help you negotiate your salary. Our average graduate sees a 70% salary hike." },
      { speaker: "Customer", text: "That sounds amazing. My biggest fear was finishing a course and still being just another applicant in a pile of thousands. Having someone to help with the portfolio is a huge relief." },
      { speaker: "Agent", text: "I love that energy, Sidharth. Honestly, with your dedication, you're a perfect fit. We have a new cohort starting this Monday and there are only two seats left. Since you attended the workshop, I can apply a fast-track scholarship which brings the fee down by 30%." },
      { speaker: "Customer", text: "That sounds like a fair deal. I've been thinking about this for weeks and I think I'm ready to commit. Do you have any EMI options or monthly payment plans available?" },
      { speaker: "Agent", text: "Yes, we have a 12-month no-cost EMI option. It comes out to about 5,000 rupees a month. It's basically the cost of a few weekend outings, but you're investing it in your career." },
      { speaker: "Customer", text: "5,000 a month? That's totally doable for me. I'm spending more than that on random stuff anyway. Let's do it Rahul, I'm in!" },
      { speaker: "Agent", text: "That's the spirit! I'm sending the registration link to your WhatsApp right now. You can complete the process while we're on the call." },
      { speaker: "Customer", text: "Perfect. Give me one second... I'm opening the link now. All right, entering my details... and done! The payment is successful. You should see it now." },
      { speaker: "Agent", text: "Got it! I just got the notification. You're officially enrolled! Welcome to the Academy, Sidharth. I'll send over your pre-reading material and the Discord invite immediately." },
      { speaker: "Customer", text: "Thanks, Rahul. I'm really excited to finally get started the right way. See you at the orientation on Monday!" },
      { speaker: "Agent", text: "See you then, Sidharth. Take care. Bye!" },
    ],

    keyInsights: [
      "🟢 **Closed-Won On Call**: Prospect completed live registration and payment verification over WhatsApp checkout link during the call.",
      "🟢 **Core Driver — Escaping 'Tutorial Hell'**: Acute frustration with fragmented self-study; seeks high-level architecture understanding beyond simple syntax.",
      "🟢 **High Value Attribution to Mentorship**: Identified weekly 1-on-1 code reviews by senior tech firm engineers as the primary purchasing differentiator.",
      "🟢 **Price Sensitivity Solved by Financing**: Rs 5,000/month 12-month no-cost EMI comfortably aligned with customer discretionary expenditure.",
      "🔵 **Immediate Onboarding Required**: Deliver Discord cohort invitation and pre-reading modules; alert Cohort Operations for Monday orientation.",
    ],

    behavioralSummary:
      "Sidharth represents a textbook 'Eager Buyer' transitioning from fragmented self-learning to structured career acceleration. Suffering from tutorial fatigue, he validated the academy's live mentor reviews and career portfolio services as the solution to his career inflection. The agent leveraged limited cohort seats and a monthly EMI reframing (Rs 5,000/mo vs. weekend outings) to achieve an immediate closed-won checkout before call wrap-up. Purchase probability is 98%.",
  },

  {
    id: "CALL-2026-003",
    customerName: "Samir",
    archetype: "Angry Customer",
    date: "2026-10-10",
    duration: "1:00",
    durationSeconds: 60,
    agent: "Outbound Sales (FutureCoders)",
    phone: "+91 97110 54329",
    audioFile: "/audio_files/call_recording_siren.mp3",

    sentiment: "negative",
    sentimentScore: 98,
    purchaseProbability: 0,
    purchaseJustification:
      "Immediate DNC Escalation: Customer is a school student (10th grade), furious over excessive spam (4th call received today), and explicitly threatened police action if contacted again.",

    transcript: [
      { speaker: "Agent", text: "Hello Samir ji? Main FutureCoders se baat kar rahi hoon. Aap 2 mahine mein software engineer ban sakte hain, aap enroll kyun nahi kar rahe?" },
      { speaker: "Customer", text: "Abe kitni baar bolun tum logon ko? Subah se yeh chautha phone hai tumhara! Main 10th class ka student hoon, mujhe koi coding-voding nahi karni! Mera peecha kyon nahi chhodte tum log?" },
      { speaker: "Agent", text: "Lekin Samir ji, hum aapke career ki baat kar rahe hain. Aaj ke time mein computer science aur tech skills kitni zaroori hain..." },
      { speaker: "Customer", text: "Arre nahi chahiye tumhara career! Din bhar call karke dimaag kharab kar diya hai tum logon ne. Kahan se mila mera number tum logon ko?" },
      { speaker: "Agent", text: "Sir, please aap tameez se baat kijiye, hum bas course details share kar rahe hain..." },
      { speaker: "Customer", text: "Dekh, apni limit mein rehkar baat kar! Dobara agar is number pe tumhara call aaya na, toh seedha police mein complaint karunga harassment ki! Phone kaat abhi!" },
    ],

    keyInsights: [
      "🔴 **Severe Brand Risk & Hostility**: Prospect furious over high-frequency outbound spam (4th telemarketing call received today).",
      "🔴 **Demographic Ineligibility**: Prospect is a minor (10th-grade student) with zero commercial intent or qualification for professional bootcamps.",
      "🔴 **Legal & Police Escalation Threat**: Customer explicitly threatened to file a formal harassment complaint with the police if contacted again.",
      "🟡 **Lead Sourcing Inquiry**: Customer demanded an audit of where marketing obtained his contact details.",
      "🔵 **MANDATORY SUPPRESSION**: Immediately purge phone number and add to global Do-Not-Call (DNC) list to avoid legal exposure.",
    ],

    behavioralSummary:
      "Samir reacted with severe hostility to an unsolicited outbound sales call, citing persistent spamming and complete demographic disqualification as a 10th-grade school student. The agent's attempt to counter with career-building talking points inflamed the situation, prompting explicit verbal hostility and a credible threat of filing a police harassment complaint. This lead must be immediately purged from outbound dialers and placed on the permanent suppression list.",
  },
];

export const getCallById = (id) => CALLS.find((call) => call.id === id);

export const SENTIMENT_CONFIG = {
  positive: {
    label: "Positive",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    icon: "●",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
  },
  neutral: {
    label: "Neutral",
    color: "#94a3b8",
    bgColor: "rgba(148, 163, 184, 0.12)",
    borderColor: "rgba(148, 163, 184, 0.3)",
    icon: "●",
    gradient: "linear-gradient(135deg, #94a3b8, #64748b)",
  },
  negative: {
    label: "Negative",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.12)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    icon: "●",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
  },
};

export const ARCHETYPE_CONFIG = {
  "Self-Directed Learner": { color: "#6366f1", icon: "🎓" },
  "Eager Buyer": { color: "#10b981", icon: "🚀" },
  "Hesitant Prospect": { color: "#f59e0b", icon: "🤔" },
  "Angry Customer": { color: "#ef4444", icon: "⚠️" },
  "Neutral Inquiry": { color: "#3b82f6", icon: "🔍" },
};
