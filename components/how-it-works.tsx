export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Discover Quality Books",
      description: "Browse our curated collection of AI-reviewed self-published books across all genres and languages.",
    },
    {
      number: 2,
      title: "Read Transparent Reviews",
      description:
        "Access detailed AI analysis including quality scores, content insights, and honest assessments for each book.",
    },
    {
      number: 3,
      title: "Make Informed Decisions",
      description:
        "Use comprehensive reviews and reader feedback to choose books that match your preferences and interests.",
    },
    {
      number: 4,
      title: "Connect & Share",
      description:
        "Engage with authors, share your thoughts, and discover your next favorite read through our community.",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-[#90D1CA] hidden md:block"></div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 flex items-start md:items-center">
                <div className="h-16 w-16 rounded-full bg-[#2A4759] text-white flex items-center justify-center text-2xl font-bold z-10">
                  {step.number}
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-8">
                <h3 className="text-xl font-bold text-[#2A4759]">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
