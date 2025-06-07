import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { run, all, get } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Seed endpoint is only available in development' },
        { status: 403 }
      );
    }

    // Create admin user
    const adminId = uuidv4();
    const adminPasswordHash = await hash('admin123', 10);
    
    await run(
      `INSERT OR IGNORE INTO users (
        id, email, password_hash, first_name, last_name, role, 
        is_active, is_verified, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [adminId, 'admin@aibookreview.com', adminPasswordHash, 'Admin', 'User', 'PlatformAdmin', 1, 1]
    );

    // Create author user
    const authorId = uuidv4();
    const authorPasswordHash = await hash('author123', 10);
    
    await run(
      `INSERT OR IGNORE INTO users (
        id, email, password_hash, first_name, last_name, role, 
        bio, is_active, is_verified, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        authorId, 
        'sarah@example.com', 
        authorPasswordHash, 
        'Sarah', 
        'Chen', 
        'Author',
        'Award-winning science fiction author with over 10 years of experience crafting immersive worlds and compelling characters.',
        1, 
        1
      ]
    );

    await run(
      `INSERT OR IGNORE INTO authors (
        id, website_url, social_media_links, author_pseudonym
      ) VALUES (?, ?, ?, ?)`,
      [
        authorId,
        'https://sarahchen.com',
        JSON.stringify({
          twitter: '@sarahchen',
          instagram: '@sarahchen_nomad'
        }),
        null
      ]
    );

    // Create reader user
    const readerId = uuidv4();
    const readerPasswordHash = await hash('reader123', 10);
    
    await run(
      `INSERT OR IGNORE INTO users (
        id, email, password_hash, first_name, last_name, role, 
        is_active, is_verified, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [readerId, 'reader@example.com', readerPasswordHash, 'Mike', 'Johnson', 'Reader', 1, 1]
    );

    // Create sample books
    const book1Id = uuidv4();
    await run(
      `INSERT OR IGNORE INTO books (
        id, title, author_id, genre_id, language_id, status, 
        cover_image_url, blurb, isbn, average_reader_rating, 
        reader_review_count, ai_quality_score, plagiarism_score, 
        has_author_responded_to_ai_review, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        book1Id,
        'The Digital Nomad\'s Guide to Freedom',
        authorId,
        2, // Non-Fiction
        1, // English
        'Published',
        '/placeholder.svg?height=400&width=300&text=Digital+Nomad+Guide',
        'A comprehensive guide to building a location-independent lifestyle through digital entrepreneurship and remote work strategies.',
        '9781234567890',
        4.7,
        23,
        92,
        2,
        true
      ]
    );

    // Add keywords for the book
    const keywords = ['digital nomad', 'remote work', 'entrepreneurship', 'lifestyle design', 'freedom'];
    for (const keyword of keywords) {
      // Add keyword to keywords table if it doesn't exist
      const keywordResult = await run(
        'INSERT OR IGNORE INTO keywords (name) VALUES (?)',
        [keyword]
      );
      
      // Get keyword ID
      const keywordData = await get(
        'SELECT id FROM keywords WHERE name = ?',
        [keyword]
      );
      
      // Add book-keyword relationship
      await run(
        'INSERT OR IGNORE INTO book_keywords (book_id, keyword_id) VALUES (?, ?)',
        [book1Id, keywordData.id]
      );
    }

    // Create AI review for the book
    const aiReviewId = uuidv4();
    await run(
      `INSERT OR IGNORE INTO ai_reviews (
        id, book_id, review_date, processing_status, ai_model_version,
        full_blurb, promotional_blurb, single_line_summary, detailed_summary,
        review_summary, full_review_content, author_response, service_needs,
        plagiarism_details, created_at, updated_at
      ) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        aiReviewId,
        book1Id,
        'Completed',
        'GPT-4o',
        'The Digital Nomad\'s Guide to Freedom is a comprehensive roadmap for anyone looking to break free from the traditional 9-to-5 lifestyle and embrace location independence. Sarah Chen draws from her own journey of building a successful online business while traveling the world, providing practical strategies, real-world examples, and actionable advice for aspiring digital nomads.',
        'Your complete guide to building a location-independent lifestyle through digital entrepreneurship.',
        'A practical guide to achieving location independence through digital entrepreneurship and remote work.',
        'This comprehensive guide covers everything from identifying profitable online business models to managing finances while traveling. Chen provides detailed frameworks for building passive income streams, establishing remote work arrangements, and maintaining productivity across different time zones. The book includes case studies of successful digital nomads, practical tools for managing a location-independent business, and strategies for overcoming common challenges faced by remote workers.',
        'An exceptionally well-structured and practical guide with strong research backing and clear actionable advice.',
        '<h3>Overall Assessment</h3><p>This book demonstrates exceptional quality in both content and presentation. The author\'s expertise shines through comprehensive research and practical application of digital nomad principles.</p><h3>Strengths</h3><ul><li><strong>Comprehensive Coverage:</strong> The book covers all essential aspects of digital nomadism, from business setup to lifestyle management.</li><li><strong>Practical Approach:</strong> Each chapter includes actionable steps and real-world examples that readers can immediately implement.</li><li><strong>Well-Researched:</strong> The content is backed by solid research and includes current market trends and statistics.</li><li><strong>Clear Structure:</strong> The logical progression from concept to implementation makes the book easy to follow.</li></ul><h3>Areas for Improvement</h3><ul><li>Some technical sections could benefit from more detailed explanations for beginners.</li><li>Additional case studies from different industries would enhance the book\'s applicability.</li></ul><h3>Writing Quality</h3><p>The prose is clear, engaging, and accessible. The author maintains a conversational tone while delivering complex information effectively. Grammar and syntax are excellent throughout.</p><h3>Target Audience</h3><p>This book is ideal for professionals seeking career flexibility, entrepreneurs looking to scale their businesses remotely, and anyone interested in location-independent living.</p>',
        'Thank you for this thorough review! I\'m thrilled that the practical approach resonated with readers. The feedback about adding more beginner-friendly technical explanations is valuable - I\'m already working on supplementary materials to address this. The journey to location independence is different for everyone, and I hope this guide serves as a helpful starting point for many aspiring digital nomads.',
        JSON.stringify([
          {
            "category": "Copy Editing",
            "suggestion": "Minor grammatical refinements could enhance readability"
          },
          {
            "category": "Cover Design",
            "suggestion": "A more modern cover design could improve market appeal"
          }
        ]),
        JSON.stringify({
          "score": 2,
          "matches": [
            {
              "source": "https://example.com/similar-content",
              "similarity": "low"
            }
          ]
        })
      ]
    );

    // Create reader review for the book
    const readerReviewId = uuidv4();
    await run(
      `INSERT OR IGNORE INTO reader_reviews (
        id, book_id, user_id, rating, comment, review_date,
        verified_purchase, helpful_count, not_helpful_count, is_featured,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        readerReviewId,
        book1Id,
        readerId,
        5,
        'This book completely changed my perspective on remote work. The practical advice is invaluable and the step-by-step approach made it easy to implement. I\'m now successfully running my business from three different countries!',
        1, // verified_purchase
        12, // helpful_count
        2, // not_helpful_count
        1 // is_featured
      ]
    );

    return NextResponse.json(
      { 
        success: true, 
        message: 'Database seeded successfully',
        users: {
          admin: { email: 'admin@aibookreview.com', password: 'admin123' },
          author: { email: 'sarah@example.com', password: 'author123' },
          reader: { email: 'reader@example.com', password: 'reader123' }
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/seed:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
}