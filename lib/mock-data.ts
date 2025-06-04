export interface BookReview {
  id: string
  title: string
  author: string
  authorId: string
  genre: string
  language: string
  aiQualityScore: number
  averageReaderRating: number
  readerReviewCount: number
  blurb: string
  keywords: string[]
  reviewDate: string
  coverImage: string
  plagiarismScore: number
  hasAuthorResponse: boolean
}

export interface FullReviewData {
  fullBlurb: string
  promotionalBlurb: string
  singleLineSummary: string
  detailedSummary: string
  reviewSummary: string
  fullReviewContent: string
  authorResponse: string
  serviceNeeds: Array<{
    category: string
    suggestion: string
  }>
}

export interface AuthorProcessChecklist {
  professionalServices: Array<{
    name: string
    completed: boolean
    details?: string
  }>
  aiToolsUsage: Array<{
    name: string
    completed: boolean
    details?: string
  }>
}

export interface PurchaseLink {
  platform: string
  url: string
}

export interface ReaderReview {
  reviewerName: string
  rating: number
  comment: string
  date: string
  verifiedPurchase: boolean
}

export const mockReviews: BookReview[] = [
  {
    id: "1",
    title: "The Digital Nomad's Guide to Freedom",
    author: "Sarah Chen",
    authorId: "author-1",
    genre: "Self-Help",
    language: "English",
    aiQualityScore: 92,
    averageReaderRating: 4.7,
    readerReviewCount: 23,
    blurb:
      "A comprehensive guide to building a location-independent lifestyle through digital entrepreneurship and remote work strategies.",
    keywords: ["digital nomad", "remote work", "entrepreneurship", "lifestyle design", "freedom"],
    reviewDate: "2024-01-15",
    coverImage: "/placeholder.svg?height=400&width=300&text=Digital+Nomad+Guide",
    plagiarismScore: 2,
    hasAuthorResponse: true,
  },
  {
    id: "2",
    title: "Echoes of Tomorrow",
    author: "Marcus Rodriguez",
    authorId: "author-2",
    genre: "Science Fiction",
    language: "English",
    aiQualityScore: 88,
    averageReaderRating: 4.3,
    readerReviewCount: 41,
    blurb:
      "In a world where memories can be extracted and traded, one detective must solve a murder that threatens the fabric of reality itself.",
    keywords: ["cyberpunk", "detective", "memory", "future", "thriller"],
    reviewDate: "2024-01-12",
    coverImage: "/placeholder.svg?height=400&width=300&text=Echoes+of+Tomorrow",
    plagiarismScore: 1,
    hasAuthorResponse: false,
  },
  {
    id: "3",
    title: "The Art of Mindful Cooking",
    author: "Elena Vasquez",
    authorId: "author-3",
    genre: "Non-Fiction",
    language: "English",
    aiQualityScore: 85,
    averageReaderRating: 4.5,
    readerReviewCount: 67,
    blurb:
      "Discover how cooking can become a meditative practice that nourishes both body and soul through mindful preparation and conscious eating.",
    keywords: ["mindfulness", "cooking", "meditation", "wellness", "nutrition"],
    reviewDate: "2024-01-10",
    coverImage: "/placeholder.svg?height=400&width=300&text=Mindful+Cooking",
    plagiarismScore: 0,
    hasAuthorResponse: true,
  },
  {
    id: "4",
    title: "Shadows in the Mist",
    author: "James Thompson",
    authorId: "author-4",
    genre: "Mystery",
    language: "English",
    aiQualityScore: 79,
    averageReaderRating: 4.1,
    readerReviewCount: 34,
    blurb:
      "When a small coastal town is shrouded in an unnatural fog, Detective Sarah Mills must uncover the truth behind a series of disappearances.",
    keywords: ["mystery", "detective", "coastal", "supernatural", "suspense"],
    reviewDate: "2024-01-08",
    coverImage: "/placeholder.svg?height=400&width=300&text=Shadows+in+Mist",
    plagiarismScore: 3,
    hasAuthorResponse: false,
  },
  {
    id: "5",
    title: "De Reis naar Binnen",
    author: "Anna van der Berg",
    authorId: "author-5",
    genre: "Self-Help",
    language: "Dutch",
    aiQualityScore: 91,
    averageReaderRating: 4.8,
    readerReviewCount: 19,
    blurb:
      "Een diepgaande verkenning van zelfontdekking en persoonlijke groei door middel van mindfulness en innerlijke reflectie.",
    keywords: ["zelfhulp", "mindfulness", "persoonlijke groei", "reflectie", "spiritualiteit"],
    reviewDate: "2024-01-05",
    coverImage: "/placeholder.svg?height=400&width=300&text=De+Reis+naar+Binnen",
    plagiarismScore: 1,
    hasAuthorResponse: true,
  },
  {
    id: "6",
    title: "The Quantum Garden",
    author: "Dr. Lisa Park",
    authorId: "author-6",
    genre: "Science Fiction",
    language: "English",
    aiQualityScore: 94,
    averageReaderRating: 4.6,
    readerReviewCount: 52,
    blurb:
      "A brilliant physicist discovers that her garden exists in multiple quantum states, leading to a journey across parallel universes.",
    keywords: ["quantum physics", "parallel universes", "science", "garden", "discovery"],
    reviewDate: "2024-01-03",
    coverImage: "/placeholder.svg?height=400&width=300&text=Quantum+Garden",
    plagiarismScore: 0,
    hasAuthorResponse: true,
  },
  {
    id: "7",
    title: "Hearts in Harmony",
    author: "Rebecca Stone",
    authorId: "author-7",
    genre: "Romance",
    language: "English",
    aiQualityScore: 76,
    averageReaderRating: 4.2,
    readerReviewCount: 89,
    blurb:
      "Two musicians from different worlds find love through their shared passion for music in this heartwarming contemporary romance.",
    keywords: ["romance", "music", "contemporary", "love", "musicians"],
    reviewDate: "2024-01-01",
    coverImage: "/placeholder.svg?height=400&width=300&text=Hearts+in+Harmony",
    plagiarismScore: 2,
    hasAuthorResponse: false,
  },
  {
    id: "8",
    title: "The Last Library",
    author: "Michael Foster",
    authorId: "author-8",
    genre: "Fantasy",
    language: "English",
    aiQualityScore: 87,
    averageReaderRating: 4.4,
    readerReviewCount: 76,
    blurb:
      "In a post-apocalyptic world, the last librarian guards the final repository of human knowledge against those who would destroy it.",
    keywords: ["fantasy", "post-apocalyptic", "library", "knowledge", "guardian"],
    reviewDate: "2023-12-28",
    coverImage: "/placeholder.svg?height=400&width=300&text=Last+Library",
    plagiarismScore: 1,
    hasAuthorResponse: true,
  },
  {
    id: "9",
    title: "Startup Secrets",
    author: "David Kim",
    authorId: "author-9",
    genre: "Non-Fiction",
    language: "English",
    aiQualityScore: 83,
    averageReaderRating: 4.3,
    readerReviewCount: 45,
    blurb:
      "An insider's guide to building successful startups, featuring real-world case studies and practical advice from Silicon Valley veterans.",
    keywords: ["startup", "entrepreneurship", "business", "silicon valley", "success"],
    reviewDate: "2023-12-25",
    coverImage: "/placeholder.svg?height=400&width=300&text=Startup+Secrets",
    plagiarismScore: 2,
    hasAuthorResponse: false,
  },
  {
    id: "10",
    title: "Whispers of the Past",
    author: "Catherine Moore",
    authorId: "author-10",
    genre: "Historical Fiction",
    language: "English",
    aiQualityScore: 89,
    averageReaderRating: 4.5,
    readerReviewCount: 63,
    blurb:
      "Set in 1920s Paris, this novel follows a young artist who discovers a hidden diary that reveals dark secrets from the Great War.",
    keywords: ["historical fiction", "1920s", "paris", "artist", "war"],
    reviewDate: "2023-12-22",
    coverImage: "/placeholder.svg?height=400&width=300&text=Whispers+of+Past",
    plagiarismScore: 0,
    hasAuthorResponse: true,
  },
  {
    id: "11",
    title: "The Mindful Manager",
    author: "Robert Chen",
    authorId: "author-11",
    genre: "Business",
    language: "English",
    aiQualityScore: 81,
    averageReaderRating: 4.1,
    readerReviewCount: 38,
    blurb:
      "Transform your leadership style and create a more productive, engaged workplace through mindfulness-based management techniques.",
    keywords: ["management", "leadership", "mindfulness", "workplace", "productivity"],
    reviewDate: "2023-12-20",
    coverImage: "/placeholder.svg?height=400&width=300&text=Mindful+Manager",
    plagiarismScore: 1,
    hasAuthorResponse: false,
  },
  {
    id: "12",
    title: "Cosmic Wanderer",
    author: "Alex Rivera",
    authorId: "author-12",
    genre: "Science Fiction",
    language: "English",
    aiQualityScore: 86,
    averageReaderRating: 4.4,
    readerReviewCount: 29,
    blurb:
      "A lone space explorer discovers an ancient alien artifact that holds the key to humanity's survival in this epic space opera.",
    keywords: ["space opera", "alien", "artifact", "exploration", "survival"],
    reviewDate: "2023-12-18",
    coverImage: "/placeholder.svg?height=400&width=300&text=Cosmic+Wanderer",
    plagiarismScore: 2,
    hasAuthorResponse: true,
  },
]

export function getFullReviewData(bookId: string): FullReviewData {
  // Mock data for full review details
  const mockFullReviews: Record<string, FullReviewData> = {
    "1": {
      fullBlurb:
        "The Digital Nomad's Guide to Freedom is a comprehensive roadmap for anyone looking to break free from the traditional 9-to-5 lifestyle and embrace location independence. Sarah Chen draws from her own journey of building a successful online business while traveling the world, providing practical strategies, real-world examples, and actionable advice for aspiring digital nomads.",
      promotionalBlurb:
        "Your complete guide to building a location-independent lifestyle through digital entrepreneurship.",
      singleLineSummary:
        "A practical guide to achieving location independence through digital entrepreneurship and remote work.",
      detailedSummary:
        "This comprehensive guide covers everything from identifying profitable online business models to managing finances while traveling. Chen provides detailed frameworks for building passive income streams, establishing remote work arrangements, and maintaining productivity across different time zones. The book includes case studies of successful digital nomads, practical tools for managing a location-independent business, and strategies for overcoming common challenges faced by remote workers.",
      reviewSummary:
        "An exceptionally well-structured and practical guide with strong research backing and clear actionable advice.",
      fullReviewContent: `
        <h3>Overall Assessment</h3>
        <p>This book demonstrates exceptional quality in both content and presentation. The author's expertise shines through comprehensive research and practical application of digital nomad principles.</p>
        
        <h3>Strengths</h3>
        <ul>
          <li><strong>Comprehensive Coverage:</strong> The book covers all essential aspects of digital nomadism, from business setup to lifestyle management.</li>
          <li><strong>Practical Approach:</strong> Each chapter includes actionable steps and real-world examples that readers can immediately implement.</li>
          <li><strong>Well-Researched:</strong> The content is backed by solid research and includes current market trends and statistics.</li>
          <li><strong>Clear Structure:</strong> The logical progression from concept to implementation makes the book easy to follow.</li>
        </ul>
        
        <h3>Areas for Improvement</h3>
        <ul>
          <li>Some technical sections could benefit from more detailed explanations for beginners.</li>
          <li>Additional case studies from different industries would enhance the book's applicability.</li>
        </ul>
        
        <h3>Writing Quality</h3>
        <p>The prose is clear, engaging, and accessible. The author maintains a conversational tone while delivering complex information effectively. Grammar and syntax are excellent throughout.</p>
        
        <h3>Target Audience</h3>
        <p>This book is ideal for professionals seeking career flexibility, entrepreneurs looking to scale their businesses remotely, and anyone interested in location-independent living.</p>
      `,
      authorResponse:
        "Thank you for this thorough review! I'm thrilled that the practical approach resonated with readers. The feedback about adding more beginner-friendly technical explanations is valuable - I'm already working on supplementary materials to address this. The journey to location independence is different for everyone, and I hope this guide serves as a helpful starting point for many aspiring digital nomads.",
      serviceNeeds: [
        {
          category: "Copy Editing",
          suggestion: "Minor grammatical refinements could enhance readability",
        },
        {
          category: "Cover Design",
          suggestion: "A more modern cover design could improve market appeal",
        },
      ],
    },
    "2": {
      fullBlurb:
        "Echoes of Tomorrow presents a gripping cyberpunk thriller set in a near-future world where human memories have become a tradeable commodity. Detective Ray Morrison must navigate a complex web of corporate espionage, black market memory dealers, and quantum consciousness technology to solve a murder that could unravel the very fabric of reality.",
      promotionalBlurb: "A mind-bending cyberpunk thriller where memories are currency and reality is negotiable.",
      singleLineSummary:
        "A cyberpunk detective story exploring memory extraction technology and its societal implications.",
      detailedSummary:
        "In 2087, memories can be extracted, edited, and implanted into other minds. Detective Ray Morrison investigates the murder of a prominent memory architect whose death threatens to expose a conspiracy involving illegal memory trafficking. As Morrison delves deeper into the case, he discovers that his own memories may have been compromised, forcing him to question everything he believes about his identity and past.",
      reviewSummary: "A compelling cyberpunk narrative with strong world-building and complex character development.",
      fullReviewContent: `
        <h3>Plot and Structure</h3>
        <p>The novel follows a well-paced three-act structure with compelling plot twists and a satisfying resolution. The mystery elements are expertly woven throughout the narrative.</p>
        
        <h3>World-Building</h3>
        <p>Rodriguez creates a believable and immersive future world with detailed technological systems and social structures. The memory extraction technology is well-explained and consistently applied.</p>
        
        <h3>Character Development</h3>
        <p>Detective Morrison is a complex protagonist with clear motivations and realistic flaws. Supporting characters are well-developed and serve important narrative functions.</p>
        
        <h3>Writing Style</h3>
        <p>The prose is crisp and engaging, with effective use of cyberpunk genre conventions. Dialogue feels natural and advances both plot and character development.</p>
        
        <h3>Themes</h3>
        <p>The novel explores themes of identity, memory, and what makes us human in an age of technological enhancement. These themes are integrated naturally into the plot.</p>
      `,
      authorResponse: "",
      serviceNeeds: [
        {
          category: "Developmental Editing",
          suggestion: "Some pacing issues in the middle section could be addressed",
        },
      ],
    },
  }

  return (
    mockFullReviews[bookId] || {
      fullBlurb: "Detailed description not available.",
      promotionalBlurb: "An engaging read that will captivate readers.",
      singleLineSummary: "A compelling story with well-developed characters.",
      detailedSummary:
        "This book offers readers an immersive experience with its well-crafted narrative and thoughtful character development.",
      reviewSummary: "A solid work with good structure and engaging content.",
      fullReviewContent: "<p>Detailed AI review content not available for this book.</p>",
      authorResponse: "",
      serviceNeeds: [],
    }
  )
}

export function getAuthorProcessChecklist(bookId: string): AuthorProcessChecklist {
  const mockChecklists: Record<string, AuthorProcessChecklist> = {
    "1": {
      professionalServices: [
        { name: "Professional Editor", completed: true, details: "Developmental and copy editing by Jane Smith" },
        { name: "Cover Designer", completed: true, details: "Cover design by Creative Studio XYZ" },
        { name: "Beta Readers", completed: true, details: "5 beta readers from target audience" },
        { name: "Proofreader", completed: true },
        { name: "Writing Coach", completed: false },
        { name: "Fact Checker", completed: true, details: "Business facts verified by industry expert" },
      ],
      aiToolsUsage: [
        { name: "AI for Research", completed: true, details: "Used for market research and trend analysis" },
        { name: "AI for Writing", completed: false },
        { name: "AI for Editing", completed: true, details: "Grammar and style checking with Grammarly" },
        { name: "AI for Ideas", completed: true, details: "Brainstorming chapter topics" },
      ],
    },
  }

  return (
    mockChecklists[bookId] || {
      professionalServices: [
        { name: "Professional Editor", completed: false },
        { name: "Cover Designer", completed: false },
        { name: "Beta Readers", completed: false },
        { name: "Proofreader", completed: false },
      ],
      aiToolsUsage: [
        { name: "AI for Research", completed: false },
        { name: "AI for Writing", completed: false },
        { name: "AI for Editing", completed: false },
      ],
    }
  )
}

export function getPurchaseLinks(bookId: string): PurchaseLink[] {
  const mockPurchaseLinks: Record<string, PurchaseLink[]> = {
    "1": [
      { platform: "Amazon", url: "https://amazon.com/book/1" },
      { platform: "Bol.com", url: "https://bol.com/book/1" },
      { platform: "Author's Website", url: "https://sarahchen.com/book" },
      { platform: "Apple Books", url: "https://books.apple.com/book/1" },
    ],
    "2": [
      { platform: "Amazon", url: "https://amazon.com/book/2" },
      { platform: "Barnes & Noble", url: "https://barnesandnoble.com/book/2" },
    ],
  }

  return mockPurchaseLinks[bookId] || []
}

export function getReaderReviews(bookId: string): ReaderReview[] {
  const mockReaderReviews: Record<string, ReaderReview[]> = {
    "1": [
      {
        reviewerName: "Mike Johnson",
        rating: 5,
        comment:
          "This book completely changed my perspective on remote work. The practical advice is invaluable and the step-by-step approach made it easy to implement. I'm now successfully running my business from three different countries!",
        date: "2024-01-20",
        verifiedPurchase: true,
      },
      {
        reviewerName: "Lisa Chen",
        rating: 4,
        comment:
          "Great resource for anyone considering the digital nomad lifestyle. The financial planning section was particularly helpful. Would have liked more information about visa requirements for different countries.",
        date: "2024-01-18",
        verifiedPurchase: true,
      },
      {
        reviewerName: "David Rodriguez",
        rating: 5,
        comment:
          "Sarah's personal journey and the real-world examples make this book incredibly relatable. The tools and frameworks provided are practical and actionable. Highly recommended!",
        date: "2024-01-15",
        verifiedPurchase: false,
      },
    ],
    "2": [
      {
        reviewerName: "Alex Thompson",
        rating: 4,
        comment:
          "Fascinating cyberpunk world with a compelling mystery. The memory extraction concept is brilliantly executed. Some pacing issues in the middle, but overall a great read.",
        date: "2024-01-14",
        verifiedPurchase: true,
      },
      {
        reviewerName: "Sarah Kim",
        rating: 5,
        comment:
          "Mind-bending plot that kept me guessing until the end. The philosophical questions about identity and memory are thought-provoking. Rodriguez has created something special here.",
        date: "2024-01-12",
        verifiedPurchase: true,
      },
    ],
  }

  return mockReaderReviews[bookId] || []
}
