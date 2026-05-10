"""
PDF Generator for Testing
Creates PDFs with random statements for content testing
"""

import random
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY


# Random statements for testing different page types
HOME_STATEMENTS = [
    "Celebrating Kenya's rich cultural heritage through beauty and purpose.",
    "Empowering youth to embrace their cultural identity.",
    "Building bridges between tradition and modernity.",
    "Showcasing Kenyan culture on the global stage.",
    "Inspiring the next generation of cultural ambassadors.",
    "Where heritage meets opportunity.",
    "Your culture is your strength.",
]

AMBASSADOR_STATEMENTS = [
    "Susan represents Kenya with pride and dedication.",
    "Connecting communities through cultural exchange.",
    "A voice for youth empowerment and heritage preservation.",
    "Walking the path between tradition and progress.",
    "Building understanding one conversation at a time.",
]

EVENT_STATEMENTS = [
    "Join us for an evening of culture and celebration.",
    "Experience the beauty of Kenyan traditions.",
    "Celebrating diversity through fashion and art.",
    "An event that brings communities together.",
    "Honoring our heritage, embracing our future.",
]

PARTNERSHIP_STATEMENTS = [
    "Partner with us to make a lasting impact.",
    "Your support helps preserve cultural heritage.",
    "Join a movement that celebrates diversity.",
    "Together we can empower the next generation.",
    "Invest in culture, invest in the future.",
]

ABOUT_STATEMENTS = [
    "Our mission is to celebrate and preserve Kenyan culture.",
    "We believe in the power of cultural pride.",
    "Building a community that honors its roots.",
    "Creating opportunities through cultural exchange.",
    "Inspiring change through cultural awareness.",
]

GENERIC_STATEMENTS = [
    "Excellence in cultural representation.",
    "Proudly showcasing Kenyan heritage.",
    "Unity through cultural diversity.",
    "Tradition meets innovation.",
    "Culture is our common ground.",
]


def get_random_statements(category, count=3):
    """Get random statements for a category"""
    statements_map = {
        'home': HOME_STATEMENTS,
        'ambassador': AMBASSADOR_STATEMENTS,
        'events': EVENT_STATEMENTS,
        'partnership': PARTNERSHIP_STATEMENTS,
        'about': ABOUT_STATEMENTS,
        'generic': GENERIC_STATEMENTS,
    }
    
    source_list = statements_map.get(category, GENERIC_STATEMENTS)
    return random.sample(source_list, min(count, len(source_list)))


def generate_test_pdf(page_type='all', filename='test_content.pdf'):
    """
    Generate a PDF with random statements for testing
    
    Args:
        page_type: 'home', 'ambassador', 'events', 'partnership', 'about', or 'all'
        filename: Output filename
    
    Returns:
        BytesIO buffer containing the PDF
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor='#15803d',  # Green-700
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        spaceBefore=12,
        textColor='#166534',  # Green-800
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=12,
        leading=16,
    )
    
    # Add title
    elements.append(Paragraph("Miss Culture Global Kenya", title_style))
    elements.append(Paragraph("Content Testing Document", styles['Heading2']))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph(f"Page Type: {page_type.upper()}", styles['Normal']))
    elements.append(Paragraph(f"Generated for: Testing purposes only", styles['Normal']))
    elements.append(Spacer(1, 0.3*inch))
    
    # Generate content based on page type
    if page_type == 'all':
        pages_to_generate = ['home', 'ambassador', 'events', 'partnership', 'about']
    else:
        pages_to_generate = [page_type]
    
    for idx, ptype in enumerate(pages_to_generate):
        if idx > 0:
            elements.append(PageBreak())
        
        elements.append(Paragraph(f"{ptype.upper()} PAGE CONTENT", heading_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Get random statements for this page
        statements = get_random_statements(ptype, count=5)
        
        for i, statement in enumerate(statements, 1):
            elements.append(Paragraph(f"{i}. {statement}", body_style))
            elements.append(Spacer(1, 0.1*inch))
        
        # Add some placeholder text blocks
        elements.append(Spacer(1, 0.2*inch))
        elements.append(Paragraph("Additional Content Blocks:", styles['Heading3']))
        
        for j in range(3):
            lorem = f"Lorem ipsum dolor sit amet, consectetur adipiscing elit. " \
                    f"This is placeholder text block {j+1} for {ptype} page testing. " \
                    f"Content can be replaced with actual copy."
            elements.append(Paragraph(lorem, body_style))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer


def generate_multi_page_pdf(num_pages=5):
    """Generate a multi-page PDF with different content per page"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    elements = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=20,
        alignment=TA_CENTER,
        spaceAfter=20,
        textColor='#15803d',
    )
    
    page_title_style = ParagraphStyle(
        'PageTitle',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=10,
        textColor='#166534',
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
    )
    
    # Document title
    elements.append(Paragraph("Multi-Page Test Document", title_style))
    elements.append(Spacer(1, 0.3*inch))
    
    categories = ['home', 'ambassador', 'events', 'partnership', 'about', 'generic']
    
    for page_num in range(1, num_pages + 1):
        if page_num > 1:
            elements.append(PageBreak())
        
        # Random category for this page
        category = random.choice(categories)
        
        elements.append(Paragraph(f"Page {page_num}: {category.upper()}", page_title_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Add statements
        statements = get_random_statements(category, count=4)
        for stmt in statements:
            elements.append(Paragraph(f"• {stmt}", body_style))
            elements.append(Spacer(1, 0.1*inch))
        
        # Add image placeholder text
        elements.append(Spacer(1, 0.2*inch))
        elements.append(Paragraph("[Image Placeholder - Insert photo here]", body_style))
        
        # Add video placeholder if events page
        if category == 'events':
            elements.append(Spacer(1, 0.1*inch))
            elements.append(Paragraph("[Video Embed Placeholder]", body_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
