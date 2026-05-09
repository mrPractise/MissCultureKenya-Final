"""
Ticket PDF generation using ReportLab.
"""
import io
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing


def generate_ticket_pdf(ticket, event):
    """
    Generate a PDF ticket for an event.
    
    Args:
        ticket: Ticket model instance
        event: Event model instance
    
    Returns:
        BytesIO buffer containing the PDF
    """
    buffer = io.BytesIO()
    
    # Create PDF document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20*mm,
        leftMargin=20*mm,
        topMargin=20*mm,
        bottomMargin=20*mm
    )
    
    # Container for elements
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#15803d'),
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#374151'),
        spaceAfter=15,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    info_style = ParagraphStyle(
        'InfoStyle',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=8,
        alignment=TA_LEFT
    )
    
    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontSize=28,
        textColor=colors.HexColor('#dc2626'),
        spaceAfter=10,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    # Header - Organization Name
    elements.append(Paragraph("Miss Culture Global Kenya", title_style))
    elements.append(Spacer(1, 5*mm))
    
    # Event Title
    elements.append(Paragraph(event.title, subtitle_style))
    elements.append(Spacer(1, 10*mm))
    
    # Ticket Type Badge
    ticket_type = ticket.ticket_category.name if ticket.ticket_category else "General Admission"
    elements.append(Paragraph(f"<b>{ticket_type}</b>", ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontSize=14,
        textColor=colors.white,
        backColor=colors.HexColor('#15803d'),
        alignment=TA_CENTER,
        spaceAfter=15,
        borderPadding=8
    )))
    elements.append(Spacer(1, 10*mm))
    
    # Attendee Info
    elements.append(Paragraph(f"<b>Attendee:</b> {ticket.full_name}", info_style))
    elements.append(Paragraph(f"<b>Email:</b> {ticket.email}", info_style))
    if ticket.phone:
        elements.append(Paragraph(f"<b>Phone:</b> {ticket.phone}", info_style))
    elements.append(Spacer(1, 10*mm))
    
    # Event Details Table
    event_data = [
        ['Date', event.start_date.strftime('%A, %B %d, %Y')],
        ['Time', event.start_date.strftime('%I:%M %p')],
        ['Venue', event.venue_name],
        ['Location', f"{event.city}, {event.country}"],
    ]
    
    event_table = Table(event_data, colWidths=[30*mm, 110*mm])
    event_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#374151')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
    ]))
    elements.append(event_table)
    elements.append(Spacer(1, 15*mm))
    
    # Ticket Code (prominent)
    elements.append(Paragraph("TICKET CODE", ParagraphStyle(
        'Label',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#6b7280'),
        alignment=TA_CENTER,
        spaceAfter=5
    )))
    elements.append(Paragraph(ticket.ticket_code, code_style))
    elements.append(Spacer(1, 5*mm))
    
    # QR Code
    qr_data = f"MCK:{ticket.ticket_code}:{ticket.id}"
    qr = QrCodeWidget(qr_data)
    bounds = qr.getBounds()
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    
    drawing = Drawing(60*mm, 60*mm, transform=[60*mm/width, 0, 0, 60*mm/height, 0, 0])
    drawing.add(qr)
    elements.append(drawing)
    elements.append(Spacer(1, 5*mm))
    
    # QR instructions
    elements.append(Paragraph("Present this QR code at the entrance", ParagraphStyle(
        'QRLabel',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#6b7280'),
        alignment=TA_CENTER,
        fontName='Helvetica-Oblique'
    )))
    elements.append(Spacer(1, 15*mm))
    
    # Footer notes
    elements.append(Paragraph("<b>Important Notes:</b>", info_style))
    notes = [
        "• This ticket is non-transferable and non-refundable.",
        "• Please arrive at least 30 minutes before the event starts.",
        "• Bring a valid ID matching the name on this ticket.",
        "• For inquiries, contact: info@misscultureglobalkenya.com",
    ]
    for note in notes:
        elements.append(Paragraph(note, ParagraphStyle(
            'Note',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#4b5563'),
            spaceAfter=4
        )))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer
