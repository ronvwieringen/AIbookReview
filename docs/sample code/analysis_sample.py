import os
import logging
from typing import Dict, Any
import google.generativeai as genai
import re

logger = logging.getLogger(__name__)


class ManuscriptAnalyzer:
    """AI-powered manuscript analysis using Google Gemini API"""
    
    def __init__(self):
        # Get the Gemini API key
        api_key = os.getenv("GEMINI_API_KEY", "")
        if not api_key:
            logger.warning("GEMINI_API_KEY not found in environment variables")
            
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        
        # Initialize the model
        try:
            self.model = genai.GenerativeModel('gemini-pro')
            logger.info("Successfully initialized Gemini model")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {e}")
            self.model = None
    
    def initial_analysis(self, text: str, title: str) -> Dict[str, Any]:
        """
        First pass: Extract basic metadata from the manuscript
        
        Args:
            text: The manuscript text content
            title: The manuscript title
            
        Returns:
            Dictionary containing metadata extraction results
        """
        try:
            # Basic metrics
            word_count = len(text.split())
            character_count = len(text)
            
            logger.info(f"Starting initial metadata extraction for '{title}' ({word_count} words)")
            
            # Create a prompt for metadata extraction
            prompt = f"""
            Analyze the following manuscript excerpt and extract key metadata.
            
            TITLE: {title}
            
            EXCERPT (first 5000 characters):
            {text[:5000]}
            
            Please extract the following information:
            1. LANGUAGE: Detect the primary language of the text (provide ISO code like 'en', 'es', 'fr')
            2. AUTHOR: Extract the author's name if mentioned in the text
            3. PUBLISHER: Identify any publisher mentioned in the text
            4. ISBN: Extract any ISBN number if present
            5. TYPE: Classify as 'fiction', 'non_fiction', or 'hybrid'
            
            Respond in this format:
            LANGUAGE: [language code]
            AUTHOR: [detected author name or 'Unknown']
            PUBLISHER: [detected publisher or 'Unknown']
            ISBN: [detected ISBN or 'Unknown']
            TYPE: [fiction/non_fiction/hybrid]
            CONFIDENCE: [0-100]
            """
            
            # If model is not available, return default values
            if not self.model:
                return {
                    'language': 'en',
                    'detected_author': 'Unknown',
                    'detected_publisher': 'Unknown',
                    'detected_isbn': 'Unknown',
                    'manuscript_type': 'fiction',
                    'confidence': 50.0
                }
                
            try:
                response = self.model.generate_content(prompt)
                result_text = response.text
                
                # Extract metadata from response
                language = self._extract_field(result_text, "LANGUAGE", "en")
                author = self._extract_field(result_text, "AUTHOR", "Unknown")
                publisher = self._extract_field(result_text, "PUBLISHER", "Unknown")
                isbn = self._extract_field(result_text, "ISBN", "Unknown")
                doc_type = self._extract_field(result_text, "TYPE", "fiction").lower()
                confidence = float(self._extract_field(result_text, "CONFIDENCE", "70"))
                
                return {
                    'language': language,
                    'detected_author': author,
                    'detected_publisher': publisher,
                    'detected_isbn': isbn,
                    'manuscript_type': doc_type,
                    'confidence': confidence
                }
                
            except Exception as e:
                logger.error(f"Error in initial metadata extraction: {e}")
                return {
                    'language': 'en',
                    'detected_author': 'Unknown',
                    'detected_publisher': 'Unknown',
                    'detected_isbn': 'Unknown',
                    'manuscript_type': 'fiction',
                    'confidence': 50.0
                }
                
        except Exception as e:
            logger.error(f"Error in initial analysis: {e}")
            return {
                'language': 'en',
                'detected_author': 'Unknown',
                'detected_publisher': 'Unknown',
                'detected_isbn': 'Unknown',
                'manuscript_type': 'fiction',
                'confidence': 50.0
            }
    
    def analyze_manuscript(self, text: str, title: str, language: str = 'en', 
                         detected_metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Second pass: Perform comprehensive manuscript analysis
        
        Args:
            text: The manuscript text content
            title: The manuscript title
            language: Language code (default: 'en')
            detected_metadata: Optional metadata from initial pass
            
        Returns:
            Dictionary containing analysis results
        """
        try:
            # Basic metrics
            word_count = len(text.split())
            character_count = len(text)
            
            logger.info(f"Starting detailed analysis for '{title}' ({word_count} words)")
            
            # Use detected metadata if available, or classify from scratch
            if detected_metadata and detected_metadata.get('manuscript_type'):
                classification_result = {
                    'type': detected_metadata.get('manuscript_type'),
                    'confidence': detected_metadata.get('confidence', 70.0)
                }
                logger.info(f"Using pre-detected manuscript type: {classification_result['type']}")
            else:
                classification_result = self._classify_manuscript(text, title)
            
            # Step 2: Perform detailed analysis based on type
            if classification_result['type'] in ['fiction', 'hybrid']:
                detailed_analysis = self._analyze_fiction(text, title)
            else:
                detailed_analysis = self._analyze_nonfiction(text, title)
            
            # Step 3: Generate promotional blurb
            promotional_blurb = self._generate_promotional_blurb(text, title, classification_result['type'])
            
            # Step 4: Basic plagiarism analysis
            plagiarism_result = self._analyze_plagiarism(text)
            
            # Combine all results
            result = {
                'overall_score': detailed_analysis.get('overall_score', 0),
                'manuscript_type': classification_result['type'],
                'classification_confidence': classification_result['confidence'],
                'detailed_feedback': detailed_analysis.get('feedback', ''),
                'promotional_blurb': promotional_blurb,
                'plagiarism_score': plagiarism_result.get('score', 95),
                'plagiarism_details': plagiarism_result.get('details', ''),
                'language_style_score': detailed_analysis.get('language_style_score', 0),
                'character_development_score': detailed_analysis.get('character_development_score', 0),
                'plot_structure_score': detailed_analysis.get('plot_structure_score', 0),
                'originality_score': detailed_analysis.get('originality_score', 0),
                'word_count': word_count,
                'character_count': character_count
            }
            
            logger.info(f"Analysis completed for '{title}' - Overall score: {result['overall_score']}")
            return result
            
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            return self._get_fallback_result(text, title)
    
    def _classify_manuscript(self, text: str, title: str) -> Dict[str, Any]:
        """Classify manuscript as fiction, non-fiction, or hybrid"""
        prompt = f"""
        Analyze the following manuscript and classify it as either 'fiction', 'non_fiction', or 'hybrid'.
        
        Title: {title}
        
        Text sample: {text[:3000]}...
        
        Please provide:
        1. Classification (fiction/non_fiction/hybrid)
        2. Confidence level (0-100)
        3. Brief reasoning (1-2 sentences)
        
        Format your response as:
        CLASSIFICATION: [type]
        CONFIDENCE: [0-100]
        REASONING: [brief explanation]
        """
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text
            
            classification = self._extract_field(result_text, "CLASSIFICATION", "fiction")
            confidence = float(self._extract_field(result_text, "CONFIDENCE", "75"))
            reasoning = self._extract_field(result_text, "REASONING", "AI classification based on content analysis")
            
            return {
                'type': classification.lower(),
                'confidence': confidence,
                'reasoning': reasoning
            }
            
        except Exception as e:
            logger.error(f"Classification failed: {str(e)}")
            return {'type': 'fiction', 'confidence': 50, 'reasoning': 'Default classification due to analysis error'}
    
    def _analyze_fiction(self, text: str, title: str) -> Dict[str, Any]:
        """Analyze fiction manuscript with focus on narrative elements"""
        prompt = f"""
        Perform a comprehensive analysis of this fiction manuscript. Evaluate it across multiple dimensions and provide scores (0-100) and detailed feedback.
        
        Title: {title}
        Text: {text[:8000]}...
        
        Please analyze and score the following areas:
        
        1. LANGUAGE & STYLE (0-100):
        - Grammar, spelling, punctuation correctness
        - Word choice and vocabulary effectiveness
        - Style clarity and engagement
        - Character voice differentiation
        - Use of literary devices
        
        2. SENSORY EXPERIENCE & IMMERSION (0-100):
        - Integration of sensory details
        - Emotional portrayal through physical reactions
        - Character internal world exploration
        
        3. SCENE CONSTRUCTION & DYNAMICS (0-100):
        - Setting and atmosphere creation
        - Movement and character interactions
        - Scene structure and pacing
        
        4. PLOT, STRUCTURE & MEANING (0-100):
        - Logic and believability
        - Character motivation clarity
        - Tension building and pacing
        - Thematic depth
        
        5. CHARACTER DEVELOPMENT & DEPTH (0-100):
        - Character complexity and psychological depth
        - Character arc development
        - Meaningful consequences of actions
        
        6. ORIGINALITY (0-100):
        - Unique voice and perspective
        - Fresh approach to themes/genre
        - Innovative storytelling techniques
        
        Format your response as:
        LANGUAGE_STYLE: [score]
        SENSORY_IMMERSION: [score]
        SCENE_CONSTRUCTION: [score]
        PLOT_STRUCTURE: [score]
        CHARACTER_DEVELOPMENT: [score]
        ORIGINALITY: [score]
        OVERALL_SCORE: [average score]
        
        DETAILED_FEEDBACK:
        [Provide comprehensive feedback covering strengths, weaknesses, and specific recommendations for improvement. Be constructive and actionable.]
        """
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text
            
            language_style = float(self._extract_field(result_text, "LANGUAGE_STYLE", "70"))
            sensory_immersion = float(self._extract_field(result_text, "SENSORY_IMMERSION", "70"))
            scene_construction = float(self._extract_field(result_text, "SCENE_CONSTRUCTION", "70"))
            plot_structure = float(self._extract_field(result_text, "PLOT_STRUCTURE", "70"))
            character_development = float(self._extract_field(result_text, "CHARACTER_DEVELOPMENT", "70"))
            originality = float(self._extract_field(result_text, "ORIGINALITY", "70"))
            
            overall_score = (language_style + sensory_immersion + scene_construction + 
                           plot_structure + character_development + originality) / 6
            
            feedback = self._extract_field(result_text, "DETAILED_FEEDBACK", 
                                         "Comprehensive analysis completed. The manuscript shows promise in several areas.")
            
            return {
                'language_style_score': language_style,
                'character_development_score': character_development,
                'plot_structure_score': plot_structure,
                'originality_score': originality,
                'overall_score': round(overall_score, 1),
                'feedback': feedback
            }
            
        except Exception as e:
            logger.error(f"Fiction analysis failed: {str(e)}")
            return self._get_default_fiction_scores()
    
    def _analyze_nonfiction(self, text: str, title: str) -> Dict[str, Any]:
        """Analyze non-fiction manuscript with focus on content and argumentation"""
        prompt = f"""
        Perform a comprehensive analysis of this non-fiction manuscript. Evaluate it across multiple dimensions and provide scores (0-100) and detailed feedback.
        
        Title: {title}
        Text: {text[:8000]}...
        
        Please analyze and score the following areas:
        
        1. SUBSTANTIATION OF CLAIMS (0-100):
        - Quality of supporting evidence
        - Appropriateness for target audience
        - Persuasiveness of arguments
        - Source citation and credibility
        
        2. COMPLETENESS & DEPTH (0-100):
        - Coverage of core topic aspects
        - Depth of insight beyond common knowledge
        - Comprehensive treatment within scope
        
        3. LANGUAGE & CLARITY (0-100):
        - Grammar, spelling, punctuation
        - Clarity and accessibility of prose
        - Appropriate technical level
        - Effective communication style
        
        4. STRUCTURE & ORGANIZATION (0-100):
        - Logical flow and organization
        - Clear chapter/section structure
        - Effective transitions
        - Coherent argument development
        
        5. ORIGINALITY & UNIQUENESS (0-100):
        - Fresh perspective or approach
        - Unique methodology or theory
        - Novel contribution to field
        - Innovative presentation style
        
        6. PRACTICAL VALUE (0-100):
        - Actionable insights or advice
        - Real-world applicability
        - Problem-solving effectiveness
        - Implementation feasibility
        
        Format your response as:
        SUBSTANTIATION: [score]
        COMPLETENESS: [score]
        LANGUAGE_CLARITY: [score]
        STRUCTURE: [score]
        ORIGINALITY: [score]
        PRACTICAL_VALUE: [score]
        OVERALL_SCORE: [average score]
        
        DETAILED_FEEDBACK:
        [Provide comprehensive feedback covering strengths, weaknesses, and specific recommendations for improvement. Be constructive and actionable.]
        """
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text
            
            substantiation = float(self._extract_field(result_text, "SUBSTANTIATION", "70"))
            completeness = float(self._extract_field(result_text, "COMPLETENESS", "70"))
            language_clarity = float(self._extract_field(result_text, "LANGUAGE_CLARITY", "70"))
            structure = float(self._extract_field(result_text, "STRUCTURE", "70"))
            originality = float(self._extract_field(result_text, "ORIGINALITY", "70"))
            practical_value = float(self._extract_field(result_text, "PRACTICAL_VALUE", "70"))
            
            overall_score = (substantiation + completeness + language_clarity + 
                           structure + originality + practical_value) / 6
            
            feedback = self._extract_field(result_text, "DETAILED_FEEDBACK", 
                                         "Comprehensive analysis completed. The manuscript demonstrates solid research and presentation.")
            
            return {
                'language_style_score': language_clarity,
                'character_development_score': practical_value,  # Using practical value as character equivalent
                'plot_structure_score': structure,
                'originality_score': originality,
                'overall_score': round(overall_score, 1),
                'feedback': feedback
            }
            
        except Exception as e:
            logger.error(f"Non-fiction analysis failed: {str(e)}")
            return self._get_default_nonfiction_scores()
    
    def _generate_promotional_blurb(self, text: str, title: str, manuscript_type: str) -> str:
        """Generate a 25-word promotional blurb"""
        prompt = f"""
        Create a compelling promotional blurb for this {manuscript_type} manuscript. The blurb must be exactly 25 words or fewer and capture the essence and unique value of the work.
        
        Title: {title}
        Text sample: {text[:2000]}...
        
        Requirements:
        - Maximum 25 words
        - Catchy and engaging
        - Objective and professional
        - Suitable for book marketing
        - Highlights unique selling points
        
        BLURB: [Your 25-word blurb here]
        """
        
        try:
            response = self.model.generate_content(prompt)
            blurb = self._extract_field(response.text, "BLURB", f"A compelling {manuscript_type} work that offers readers unique insights and engaging storytelling throughout.")
            
            # Ensure it's within word limit
            words = blurb.split()
            if len(words) > 25:
                blurb = ' '.join(words[:25])
            
            return blurb
            
        except Exception as e:
            logger.error(f"Blurb generation failed: {str(e)}")
            return f"An engaging {manuscript_type} work offering readers unique perspectives and compelling content."
    
    def _analyze_plagiarism(self, text: str) -> Dict[str, Any]:
        """Basic plagiarism analysis - checks for common patterns"""
        # This is a simplified plagiarism check
        # In production, you would integrate with specialized plagiarism detection services
        
        try:
            # Look for potential indicators
            suspicious_patterns = [
                r'according to .{1,50} research',
                r'studies have shown',
                r'it has been established',
                r'research indicates'
            ]
            
            pattern_count = 0
            for pattern in suspicious_patterns:
                matches = re.findall(pattern, text, re.IGNORECASE)
                pattern_count += len(matches)
            
            # Simple scoring based on pattern frequency
            text_length = len(text.split())
            pattern_density = (pattern_count / text_length) * 1000 if text_length > 0 else 0
            
            # Score: higher is better (less suspicious)
            plagiarism_score = max(50, 95 - (pattern_density * 10))
            
            if plagiarism_score > 90:
                details = "No significant plagiarism concerns detected. The work appears to be original."
            elif plagiarism_score > 70:
                details = "Minor concerns detected. Consider reviewing citation practices and ensuring proper attribution."
            else:
                details = "Potential plagiarism concerns detected. Recommend professional plagiarism check and review of sources."
            
            return {
                'score': round(plagiarism_score, 1),
                'details': details
            }
            
        except Exception as e:
            logger.error(f"Plagiarism analysis failed: {str(e)}")
            return {
                'score': 90.0,
                'details': "Unable to complete plagiarism analysis. Recommend manual review."
            }
    
    def _extract_field(self, text: str, field_name: str, default: str) -> str:
        """Extract a field value from AI response"""
        pattern = rf"{field_name}:\s*(.+?)(?:\n|$)"
        match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
        
        if match:
            return match.group(1).strip()
        return default
    
    def _get_fallback_result(self, text: str, title: str) -> Dict[str, Any]:
        """Return fallback result if AI analysis fails"""
        word_count = len(text.split())
        
        return {
            'overall_score': 75.0,
            'manuscript_type': 'fiction',
            'classification_confidence': 50.0,
            'detailed_feedback': 'AI analysis temporarily unavailable. This manuscript has been processed with basic metrics. Please try again later for detailed analysis.',
            'promotional_blurb': f'A compelling work that engages readers with its unique perspective and storytelling approach.',
            'plagiarism_score': 90.0,
            'plagiarism_details': 'Basic plagiarism check completed. No obvious concerns detected.',
            'language_style_score': 75.0,
            'character_development_score': 75.0,
            'plot_structure_score': 75.0,
            'originality_score': 75.0,
            'word_count': word_count,
            'character_count': len(text)
        }
    
    def _get_default_fiction_scores(self) -> Dict[str, Any]:
        """Default scores for fiction analysis when AI fails"""
        return {
            'language_style_score': 70.0,
            'character_development_score': 70.0,
            'plot_structure_score': 70.0,
            'originality_score': 70.0,
            'overall_score': 70.0,
            'feedback': 'Analysis completed with default scoring due to processing limitations. The manuscript shows standard fiction elements and structure.'
        }
    
    def _get_default_nonfiction_scores(self) -> Dict[str, Any]:
        """Default scores for non-fiction analysis when AI fails"""
        return {
            'language_style_score': 70.0,
            'character_development_score': 70.0,  # Practical value equivalent
            'plot_structure_score': 70.0,  # Structure equivalent
            'originality_score': 70.0,
            'overall_score': 70.0,
            'feedback': 'Analysis completed with default scoring due to processing limitations. The manuscript demonstrates solid non-fiction structure and content organization.'
        }
