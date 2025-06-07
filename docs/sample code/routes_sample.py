import os
import logging
from flask import render_template, request, redirect, url_for, flash, jsonify, send_file
from werkzeug.utils import secure_filename
from app import app, db
from models import Manuscript, AnalysisStatus, ManuscriptType
from file_handler import FileHandler
from analysis import ManuscriptAnalyzer
import tempfile
from datetime import datetime

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'doc'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    """Homepage with platform overview"""
    return render_template('index.html')


@app.route('/upload')
def upload_form():
    """Manuscript upload form"""
    return render_template('upload.html')


@app.route('/upload', methods=['POST'])
def upload_manuscript():
    """Handle manuscript upload and basic validation"""
    try:
        # Validate form data
        if 'manuscript' not in request.files:
            flash('No file selected', 'error')
            return redirect(request.url)
        
        file = request.files['manuscript']
        if file.filename == '':
            flash('No file selected', 'error')
            return redirect(request.url)
        
        if not allowed_file(file.filename):
            flash('File type not supported. Please upload PDF, DOCX, or TXT files.', 'error')
            return redirect(request.url)
        
        # Get form data
        author_name = request.form.get('author_name', '').strip()
        author_email = request.form.get('author_email', '').strip()
        manuscript_title = request.form.get('manuscript_title', '').strip()
        language = request.form.get('language', 'en')
        
        if not all([author_name, author_email, manuscript_title]):
            flash('Please fill in all required fields', 'error')
            return redirect(request.url)
        
        # Save file securely
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{timestamp}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Create manuscript record
        manuscript = Manuscript(
            filename=unique_filename,
            original_filename=filename,
            file_size=file_size,
            author_name=author_name,
            author_email=author_email,
            manuscript_title=manuscript_title,
            language=language,
            analysis_status=AnalysisStatus.PENDING
        )
        
        db.session.add(manuscript)
        db.session.commit()
        
        logger.info(f"Manuscript uploaded: {manuscript.id} - {manuscript_title}")
        flash('Manuscript uploaded successfully! Starting analysis...', 'success')
        
        return redirect(url_for('analyze_manuscript', manuscript_id=manuscript.id))
        
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        flash('An error occurred during upload. Please try again.', 'error')
        return redirect(request.url)


@app.route('/analyze/<int:manuscript_id>')
def analyze_manuscript(manuscript_id):
    """Show analysis progress and trigger analysis"""
    manuscript = Manuscript.query.get_or_404(manuscript_id)
    
    if manuscript.analysis_status == AnalysisStatus.COMPLETED:
        return redirect(url_for('view_results', manuscript_id=manuscript_id))
    
    return render_template('analysis.html', manuscript=manuscript)


@app.route('/api/analyze/<int:manuscript_id>', methods=['POST'])
def api_analyze_manuscript(manuscript_id):
    """API endpoint to perform manuscript analysis"""
    try:
        manuscript = Manuscript.query.get_or_404(manuscript_id)
        
        if manuscript.analysis_status in [AnalysisStatus.PROCESSING, AnalysisStatus.COMPLETED]:
            return jsonify({'status': 'already_processing'})
        
        # Update status to processing
        manuscript.analysis_status = AnalysisStatus.PROCESSING
        db.session.commit()
        
        # Get file path
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], manuscript.filename)
        
        if not os.path.exists(file_path):
            manuscript.analysis_status = AnalysisStatus.FAILED
            db.session.commit()
            return jsonify({'status': 'error', 'message': 'File not found'})
        
        # Extract text from file - we don't store the actual text, just analyze it
        file_handler = FileHandler()
        text_content = file_handler.extract_text(file_path)
        
        if not text_content:
            manuscript.analysis_status = AnalysisStatus.FAILED
            db.session.commit()
            return jsonify({'status': 'error', 'message': 'Could not extract text from file'})
        
        # Perform two-pass AI analysis
        analyzer = ManuscriptAnalyzer()
        
        # First pass: Extract metadata if not already done
        if not manuscript.initial_analysis_complete:
            logger.info(f"Performing initial metadata extraction for manuscript {manuscript_id}")
            metadata_result = analyzer.initial_analysis(
                text_content,
                manuscript.manuscript_title
            )
            
            # Update manuscript with detected metadata
            manuscript.detected_author = metadata_result.get('detected_author')
            manuscript.detected_publisher = metadata_result.get('detected_publisher')
            manuscript.detected_isbn = metadata_result.get('detected_isbn')
            manuscript.language = metadata_result.get('language', 'en')
            
            # Set detected manuscript type
            manuscript_type = metadata_result.get('manuscript_type', '').lower()
            if manuscript_type == 'fiction':
                manuscript.manuscript_type = ManuscriptType.FICTION
            elif manuscript_type == 'non_fiction':
                manuscript.manuscript_type = ManuscriptType.NON_FICTION
            elif manuscript_type == 'hybrid':
                manuscript.manuscript_type = ManuscriptType.HYBRID
                
            manuscript.initial_analysis_complete = True
            db.session.commit()
        
        # Second pass: Detailed analysis with metadata context
        logger.info(f"Performing detailed analysis for manuscript {manuscript_id}")
        
        # Prepare metadata context for the full analysis
        metadata_context = {
            'manuscript_type': manuscript.manuscript_type.value if manuscript.manuscript_type else None,
            'language': manuscript.language,
            'detected_author': manuscript.detected_author,
            'detected_publisher': manuscript.detected_publisher,
            'detected_isbn': manuscript.detected_isbn,
            'confidence': manuscript.classification_confidence or 70.0
        }
        
        # Perform full analysis with context from initial pass
        analysis_result = analyzer.analyze_manuscript(
            text_content,
            manuscript.manuscript_title,
            manuscript.language,
            detected_metadata=metadata_context
        )
        
        # Update manuscript with results
        manuscript.analysis_status = AnalysisStatus.COMPLETED
        manuscript.analysis_date = datetime.utcnow()
        manuscript.overall_score = analysis_result.get('overall_score')
        manuscript.detailed_feedback = analysis_result.get('detailed_feedback')
        manuscript.promotional_blurb = analysis_result.get('promotional_blurb')
        manuscript.plagiarism_score = analysis_result.get('plagiarism_score')
        manuscript.plagiarism_details = analysis_result.get('plagiarism_details')
        
        # Set manuscript type
        manuscript_type = analysis_result.get('manuscript_type', '').lower()
        if manuscript_type == 'fiction':
            manuscript.manuscript_type = ManuscriptType.FICTION
        elif manuscript_type == 'non_fiction':
            manuscript.manuscript_type = ManuscriptType.NON_FICTION
        elif manuscript_type == 'hybrid':
            manuscript.manuscript_type = ManuscriptType.HYBRID
        
        manuscript.classification_confidence = analysis_result.get('classification_confidence')
        manuscript.language_style_score = analysis_result.get('language_style_score')
        manuscript.character_development_score = analysis_result.get('character_development_score')
        manuscript.plot_structure_score = analysis_result.get('plot_structure_score')
        manuscript.originality_score = analysis_result.get('originality_score')
        
        db.session.commit()
        
        # Delete the uploaded file for security
        try:
            os.remove(file_path)
            logger.info(f"Deleted manuscript file: {file_path}")
        except OSError as e:
            logger.warning(f"Could not delete file {file_path}: {str(e)}")
        
        return jsonify({'status': 'completed', 'manuscript_id': manuscript_id})
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        manuscript.analysis_status = AnalysisStatus.FAILED
        db.session.commit()
        return jsonify({'status': 'error', 'message': 'Analysis failed'})


@app.route('/results/<int:manuscript_id>')
def view_results(manuscript_id):
    """Display analysis results"""
    manuscript = Manuscript.query.get_or_404(manuscript_id)
    
    if manuscript.analysis_status != AnalysisStatus.COMPLETED:
        flash('Analysis not yet completed', 'warning')
        return redirect(url_for('analyze_manuscript', manuscript_id=manuscript_id))
    
    return render_template('results.html', manuscript=manuscript)


@app.route('/api/status/<int:manuscript_id>')
def api_get_status(manuscript_id):
    """Get analysis status"""
    manuscript = Manuscript.query.get_or_404(manuscript_id)
    return jsonify({
        'status': manuscript.analysis_status.value,
        'progress': get_analysis_progress(manuscript.analysis_status)
    })


@app.route('/download/<int:manuscript_id>')
def download_report(manuscript_id):
    """Download analysis report as text file"""
    manuscript = Manuscript.query.get_or_404(manuscript_id)
    
    if manuscript.analysis_status != AnalysisStatus.COMPLETED:
        flash('Analysis not yet completed', 'warning')
        return redirect(url_for('view_results', manuscript_id=manuscript_id))
    
    # Generate report content
    report_content = generate_report_content(manuscript)
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as temp_file:
        temp_file.write(report_content)
        temp_file_path = temp_file.name
    
    def remove_file(response):
        try:
            os.remove(temp_file_path)
        except Exception:
            pass
        return response
    
    filename = f"MyReviewApp_Analysis_{manuscript.manuscript_title.replace(' ', '_')}.txt"
    
    return send_file(
        temp_file_path,
        as_attachment=True,
        download_name=filename,
        mimetype='text/plain'
    )


def get_analysis_progress(status):
    """Get progress percentage based on status"""
    progress_map = {
        AnalysisStatus.PENDING: 0,
        AnalysisStatus.PROCESSING: 50,
        AnalysisStatus.COMPLETED: 100,
        AnalysisStatus.FAILED: 0
    }
    return progress_map.get(status, 0)


def generate_report_content(manuscript):
    """Generate downloadable report content"""
    report = f"""
MyReviewApp - AI Manuscript Analysis Report
==========================================

Manuscript: {manuscript.manuscript_title}
Author: {manuscript.author_name}
Analysis Date: {manuscript.analysis_date.strftime('%Y-%m-%d %H:%M:%S') if manuscript.analysis_date else 'N/A'}
Manuscript Type: {manuscript.manuscript_type.value if manuscript.manuscript_type else 'Unclassified'}

OVERALL SCORE: {manuscript.overall_score}/100

PROMOTIONAL BLURB:
{manuscript.promotional_blurb}

DETAILED ANALYSIS:
{manuscript.detailed_feedback}

PLAGIARISM ANALYSIS:
Score: {manuscript.plagiarism_score}/100
{manuscript.plagiarism_details or 'No specific plagiarism concerns detected.'}

COMPONENT SCORES:
- Language & Style: {manuscript.language_style_score}/100
- Character Development: {manuscript.character_development_score}/100
- Plot & Structure: {manuscript.plot_structure_score}/100
- Originality: {manuscript.originality_score}/100

---
Report generated by MyReviewApp AI Analysis Platform
This analysis is based on AI assessment and should be considered alongside human professional editing services.
"""
    return report.strip()


@app.errorhandler(413)
def file_too_large(error):
    flash('File too large. Maximum size is 50MB.', 'error')
    return redirect(url_for('upload_form'))


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    logger.error(f"Internal error: {str(error)}")
    return render_template('500.html'), 500
