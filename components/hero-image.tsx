import Image from "next/image"

export default function HeroImage() {
  return (
    <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
      <Image
        src="/placeholder.svg?height=500&width=600"
        alt="AI Book Review Platform"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2A4759]/70 to-transparent flex flex-col justify-center p-8">
        <div className="bg-white/90 p-4 rounded-lg shadow-lg max-w-[250px] mb-4">
          <div className="flex items-center mb-2">
            <div className="h-4 w-4 rounded-full bg-[#F79B72]"></div>
            <div className="ml-2 text-sm font-semibold text-[#2A4759]">Reader Quality Score</div>
          </div>
          <div className="text-2xl font-bold text-[#2A4759]">92/100</div>
        </div>
        <div className="bg-white/90 p-4 rounded-lg shadow-lg max-w-[300px]">
          <div className="text-sm font-semibold text-[#2A4759] mb-2">AI Reader Discovery</div>
          <div className="text-sm text-gray-700">
            "Uncover your next favorite read with confidence. Our AI helps you discover books with strong character
            development and engaging plots..."
          </div>
        </div>
      </div>
    </div>
  )
}
