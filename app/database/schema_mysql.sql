-- Set default character set and collation for the database (run this before creating tables if needed)
-- ALTER DATABASE your_database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS aibookreview_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aibookreview_db; -- Select the database to ensure subsequent commands operate on it


-- Tables

CREATE TABLE Users (
    UserID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    Role ENUM('Author', 'Reader', 'ServiceProvider', 'PublisherAdmin', 'PlatformAdmin') NOT NULL,
    ProfilePictureURL TEXT,
    Bio TEXT,
    PreferredLanguage VARCHAR(10) DEFAULT 'en', -- ISO 639-1 code
    StripeCustomerID VARCHAR(255) UNIQUE, -- For payments
    LastLogin TIMESTAMP NULL DEFAULT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    IsVerified BOOLEAN DEFAULT FALSE, -- Email verification
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Authors (
    AuthorID BIGINT UNSIGNED PRIMARY KEY,
    WebsiteURL TEXT,
    SocialMediaLinks JSON, -- {"twitter": "url", "linkedin": "url"}
    AuthorPseudonym VARCHAR(255), -- If different from User's name
    CONSTRAINT fk_authors_users FOREIGN KEY (AuthorID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE ServiceProviders (
    ServiceProviderID BIGINT UNSIGNED PRIMARY KEY,
    CompanyName VARCHAR(255),
    WebsiteURL TEXT,
    ServiceCategories JSON, -- e.g., ["Editing", "Cover Design", "Marketing"]
    PortfolioURL TEXT,
    YearsOfExperience INT,
    VerificationStatus ENUM('Unverified', 'PendingVerification', 'Verified', 'Rejected') DEFAULT 'Unverified',
    VerificationDocuments JSON, -- URLs to documents or notes
    CONSTRAINT fk_serviceproviders_users FOREIGN KEY (ServiceProviderID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Publishers (
    PublisherID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) UNIQUE NOT NULL,
    WebsiteURL TEXT,
    ContactEmail VARCHAR(255),
    LogoURL TEXT,
    Description TEXT,
    AssociatedUserID BIGINT UNSIGNED NULL, -- A contact person at the publisher
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_publishers_users FOREIGN KEY (AssociatedUserID) REFERENCES Users(UserID) ON DELETE SET NULL
);

CREATE TABLE Genres (
    GenreID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) UNIQUE NOT NULL,
    Description TEXT
);

CREATE TABLE Languages (
    LanguageID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Code VARCHAR(10) UNIQUE NOT NULL, -- ISO 639-1 or 639-2
    Name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Books (
    BookID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    AuthorID BIGINT UNSIGNED NULL,
    PublisherID BIGINT UNSIGNED NULL,
    GenreID INT UNSIGNED NULL,
    LanguageID INT UNSIGNED NULL,
    Status ENUM('Draft', 'SubmittedForAIReview', 'AIReviewInProgress', 'AIReviewCompleted', 'Published', 'Unpublished', 'Rejected', 'AnonymousProcessing') DEFAULT 'Draft', -- Added 'AnonymousProcessing'
    CoverImageURL TEXT,
    Blurb TEXT, -- Short promotional blurb, can be AI-generated or author-provided
    ISBN VARCHAR(20) UNIQUE,
    PublicationDate DATE,
    PageCount INT,
    TargetAudience TEXT,
    ManuscriptURL TEXT, -- Secure link to the manuscript, for AI processing
    AverageReaderRating DECIMAL(3, 2) DEFAULT 0.00,
    ReaderReviewCount INT DEFAULT 0,
    PlagiarismScore DECIMAL(5, 2), -- Overall score from AI
    HasAuthorRespondedToAIReview BOOLEAN DEFAULT FALSE,
    SubmittedForAIReviewAt TIMESTAMP NULL DEFAULT NULL,
    AIReviewCompletedAt TIMESTAMP NULL DEFAULT NULL,
    PublishedAt TIMESTAMP NULL DEFAULT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_books_authors FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID) ON DELETE CASCADE,
    CONSTRAINT fk_books_publishers FOREIGN KEY (PublisherID) REFERENCES Publishers(PublisherID) ON DELETE SET NULL,
    CONSTRAINT fk_books_genres FOREIGN KEY (GenreID) REFERENCES Genres(GenreID) ON DELETE SET NULL,
    CONSTRAINT fk_books_languages FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID) ON DELETE SET NULL
);

CREATE TABLE Keywords (
    KeywordID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE BookKeywords (
    BookID BIGINT UNSIGNED NOT NULL,
    KeywordID INT UNSIGNED NOT NULL,
    PRIMARY KEY (BookID, KeywordID),
    CONSTRAINT fk_bookkeywords_books FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE,
    CONSTRAINT fk_bookkeywords_keywords FOREIGN KEY (KeywordID) REFERENCES Keywords(KeywordID) ON DELETE CASCADE
);

CREATE TABLE AIReviews (
    AIReviewID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    BookID BIGINT UNSIGNED NOT NULL,
    ReviewDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ProcessingStatus ENUM('Pending', 'Processing', 'Completed', 'Failed') DEFAULT 'Pending',
    ErrorMessage TEXT, -- If processing failed
    AIModelVersion VARCHAR(50),
    FullBlurb TEXT,
    PromotionalBlurb TEXT,
    SingleLineSummary TEXT,
    DetailedSummary TEXT,
    ReviewSummary TEXT, -- Summary of the AI's qualitative review
    FullReviewContent TEXT, -- The main body of the AI-generated review
    AuthorResponse TEXT, -- Author's commentary on this AI review
    ServiceNeeds JSON, -- [{"category": "Editing", "suggestion": "Consider professional editing for chapter 3"}]
    PlagiarismDetails JSON, -- {"score": 5.5, "matches": [{"source": "url", "similarity": "high"}]}
    AIFictionAnalysis JSON, -- {"plotStrength": 8, "characterDevelopment": 7, ...}
    AINonFictionAnalysis JSON, -- {"clarity": 9, "accuracy": 7, "completeness": 8, ...}
    AIHybridAnalysis JSON, -- For hybrid forms
    SentimentAnalysis JSON, -- {"overall": "positive", "sections": [...]}
    ReadabilityScores JSON, -- {"flesch_kincaid": 70, ...}
    Strengths JSON, -- Storing as JSON array: ["strength1", "strength2"]
    Weaknesses JSON, -- Storing as JSON array
    SuggestionsForImprovement JSON, -- Storing as JSON array
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_aireviews_books FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE
);

CREATE TABLE AuthorProcessChecklists (
    ChecklistID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    BookID BIGINT UNSIGNED NOT NULL,
    ProfessionalServicesUsed JSON, -- [{"name": "Editor", "completed": true, "details": "John Doe Editing"}]
    AIToolsUsed JSON, -- [{"name": "Grammarly", "completed": true, "details": "For proofreading"}]
    AuthorDeclaration TEXT, -- Author's statement about their process
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_authorprocesschecklists_books FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE
);

CREATE TABLE BookPurchaseLinks (
    LinkID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    BookID BIGINT UNSIGNED NOT NULL,
    PlatformName VARCHAR(100) NOT NULL, -- e.g., "Amazon", "Author's Website"
    URL TEXT NOT NULL,
    LinkType VARCHAR(50), -- e.g., "ebook", "paperback", "audiobook"
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookpurchaselinks_books FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE
);

CREATE TABLE ReaderReviews (
    ReaderReviewID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    BookID BIGINT UNSIGNED NOT NULL,
    UserID BIGINT UNSIGNED NOT NULL, -- The reader who wrote the review
    Rating DECIMAL(2, 1) NOT NULL,
    Comment TEXT,
    ReviewDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    VerifiedPurchase BOOLEAN DEFAULT FALSE,
    HelpfulCount INT DEFAULT 0,
    NotHelpfulCount INT DEFAULT 0,
    IsFeatured BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_readerreviews_books FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE,
    CONSTRAINT fk_readerreviews_users FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    CONSTRAINT chk_readerreviews_rating CHECK (Rating >= 0.5 AND Rating <= 5.0)
);

CREATE TABLE Services (
    ServiceID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ServiceProviderID BIGINT UNSIGNED NOT NULL,
    ServiceName VARCHAR(255) NOT NULL,
    Description TEXT,
    Category VARCHAR(100), -- Matches one of the ServiceProvider.ServiceCategories
    PriceRange VARCHAR(100), -- e.g., "$50-$100", "Per 1000 words"
    TurnaroundTime VARCHAR(100),
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_services_serviceproviders FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID) ON DELETE CASCADE
);

CREATE TABLE ServiceProviderReviews (
    ReviewID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ServiceID BIGINT UNSIGNED NOT NULL,
    ReviewerAuthorID BIGINT UNSIGNED NOT NULL, -- Author who received the service
    Rating DECIMAL(2, 1) NOT NULL,
    Comment TEXT,
    ReviewDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_serviceproviderreviews_services FOREIGN KEY (ServiceID) REFERENCES Services(ServiceID) ON DELETE CASCADE,
    CONSTRAINT fk_serviceproviderreviews_authors FOREIGN KEY (ReviewerAuthorID) REFERENCES Authors(AuthorID) ON DELETE CASCADE,
    CONSTRAINT chk_serviceproviderreviews_rating CHECK (Rating >= 0.5 AND Rating <= 5.0)
);

CREATE TABLE UserFollows (
    FollowerUserID BIGINT UNSIGNED NOT NULL,
    FollowedUserID BIGINT UNSIGNED NOT NULL,
    FollowDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (FollowerUserID, FollowedUserID),
    CONSTRAINT fk_userfollows_follower FOREIGN KEY (FollowerUserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    CONSTRAINT fk_userfollows_followed FOREIGN KEY (FollowedUserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE ReadingLists (
    ReadingListID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    UserID BIGINT UNSIGNED NOT NULL,
    ListName VARCHAR(100) NOT NULL, -- e.g., "To Read", "Favorites"
    Description TEXT,
    IsPublic BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (UserID, ListName),
    CONSTRAINT fk_readinglists_users FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE ReadingListItems (
    ReadingListItemID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ReadingListID BIGINT UNSIGNED NOT NULL,
    BookID BIGINT UNSIGNED NOT NULL,
    AddedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Notes TEXT,
    UNIQUE (ReadingListID, BookID),
    CONSTRAINT fk_readinglistitems_readinglists FOREIGN KEY (ReadingListID) REFERENCES ReadingLists(ReadingListID) ON DELETE CASCADE,
    CONSTRAINT fk_readinglistitems_books FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_users_email ON Users(Email);
CREATE INDEX idx_users_role ON Users(Role);

CREATE INDEX idx_books_author_id ON Books(AuthorID);
CREATE INDEX idx_books_genre_id ON Books(GenreID);
CREATE INDEX idx_books_language_id ON Books(LanguageID);
CREATE INDEX idx_books_status ON Books(Status);
ALTER TABLE Books ADD FULLTEXT KEY idx_books_title (Title); -- For text search on title

CREATE INDEX idx_bookkeywords_book_id ON BookKeywords(BookID);
CREATE INDEX idx_bookkeywords_keyword_id ON BookKeywords(KeywordID);
CREATE INDEX idx_keywords_name ON Keywords(Name);


CREATE INDEX idx_aireviews_book_id ON AIReviews(BookID);
CREATE INDEX idx_authorprocesschecklists_book_id ON AuthorProcessChecklists(BookID);
CREATE INDEX idx_bookpurchaselinks_book_id ON BookPurchaseLinks(BookID);
CREATE INDEX idx_readerreviews_book_id ON ReaderReviews(BookID);
CREATE INDEX idx_readerreviews_user_id ON ReaderReviews(UserID);

CREATE INDEX idx_services_service_provider_id ON Services(ServiceProviderID);
CREATE INDEX idx_serviceproviderreviews_service_id ON ServiceProviderReviews(ServiceID);
CREATE INDEX idx_serviceproviderreviews_reviewer_author_id ON ServiceProviderReviews(ReviewerAuthorID);

CREATE INDEX idx_readinglists_user_id ON ReadingLists(UserID);
CREATE INDEX idx_readinglistitems_reading_list_id ON ReadingListItems(ReadingListID);
CREATE INDEX idx_readinglistitems_book_id ON ReadingListItems(BookID);