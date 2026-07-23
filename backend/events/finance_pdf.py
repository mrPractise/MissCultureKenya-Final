"""
Finance statement PDF generation using ReportLab.

Renders a revenue statement across the three income sources
(voting, ticketing, contributions) with the applied filters, a totals
summary, and a transactions table.
"""
import io
from django.utils import timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer


GREEN = colors.HexColor('#166534')
LIGHT_GREEN = colors.HexColor('#dcfce7')
GREY = colors.HexColor('#6b7280')
LIGHT_GREY = colors.HexColor('#f3f4f6')

SOURCE_LABELS = {
    'vote': 'Voting',
    'ticket': 'Ticketing',
    'contribution': 'Contribution',
}


def _fmt_money(value):
    try:
        return f"KES {float(value):,.2f}"
    except (TypeError, ValueError):
        return "KES 0.00"


def _fmt_dt(dt):
    """Format a datetime in the project timezone (Africa/Nairobi)."""
    try:
        local = timezone.localtime(dt)
        return local.strftime('%d %b %Y %H:%M')
    except (ValueError, TypeError):
        return str(dt or '')


def _filters_summary(f):
    parts = []
    src = (f.get('source') or 'all').lower()
    parts.append(f"Source: {SOURCE_LABELS.get(src, 'All sources')}")
    if f.get('date_from') or f.get('date_to'):
        parts.append(f"Dates: {f.get('date_from') or 'start'} to {f.get('date_to') or 'today'}")
    if f.get('status') and f.get('status') != 'all':
        parts.append(f"Status: {f.get('status').title()}")
    else:
        parts.append("Status: All")
    if f.get('phone'):
        parts.append(f"Phone: {f.get('phone')}")
    if f.get('mpesa_code'):
        parts.append(f"M-Pesa: {f.get('mpesa_code')}")
    return "  |  ".join(parts)


def generate_finance_statement_pdf(rows, totals, filters):
    """Build the statement PDF and return a BytesIO buffer.

    Args:
        rows: list of dicts (date, source, name, phone, mpesa_code, amount, status, event_title, reference)
        totals: dict with vote/ticket/contribution/grand (successful only)
        filters: the applied filter dict
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=14 * mm,
        leftMargin=14 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('title', parent=styles['Title'], textColor=GREEN, fontSize=20, spaceAfter=2)
    sub_style = ParagraphStyle('sub', parent=styles['Normal'], textColor=GREY, fontSize=9, alignment=TA_LEFT)
    section_style = ParagraphStyle('section', parent=styles['Heading2'], textColor=GREEN, fontSize=12, spaceBefore=8, spaceAfter=6)
    cell_style = ParagraphStyle('cell', parent=styles['Normal'], fontSize=8, leading=10)

    elements = []

    # ── Header ───────────────────────────────────────────────────────────────
    elements.append(Paragraph("Miss Culture Global Kenya", title_style))
    elements.append(Paragraph("Revenue Statement", ParagraphStyle('st', parent=styles['Heading2'], textColor=colors.black, fontSize=13, spaceAfter=4)))
    elements.append(Paragraph(f"Generated: {_fmt_dt(timezone.now())} (EAT)", sub_style))
    elements.append(Paragraph(_filters_summary(filters), sub_style))
    elements.append(Spacer(1, 8))

    # ── Summary totals ─────────────────────────────────────────────────────────
    summary_data = [
        ['Voting', 'Ticketing', 'Contributions', 'Grand Total'],
        [
            _fmt_money(totals.get('vote', 0)),
            _fmt_money(totals.get('ticket', 0)),
            _fmt_money(totals.get('contribution', 0)),
            _fmt_money(totals.get('grand', 0)),
        ],
    ]
    summary_table = Table(summary_data, colWidths=[doc.width / 4.0] * 4)
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (-1, 1), LIGHT_GREEN),
        ('BACKGROUND', (3, 1), (3, 1), colors.HexColor('#bbf7d0')),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 1), (-1, 1), 12),
        ('TEXTCOLOR', (0, 1), (-1, 1), GREEN),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.white),
    ]))
    elements.append(summary_table)
    elements.append(Paragraph("Totals reflect successful payments only.", sub_style))
    elements.append(Spacer(1, 6))

    # ── Transactions table ──────────────────────────────────────────────────────
    elements.append(Paragraph(f"Transactions ({len(rows)})", section_style))

    header = ['Date', 'Source', 'Name', 'Phone', 'M-Pesa Code', 'Reference / Event', 'Status', 'Amount']
    table_data = [header]
    for r in rows:
        event_ref = r.get('reference', '')
        if r.get('event_title'):
            event_ref = f"{r.get('reference', '')} — {r['event_title']}"
        table_data.append([
            Paragraph(_fmt_dt(r['date']), cell_style),
            Paragraph(SOURCE_LABELS.get(r.get('source'), r.get('source', '')), cell_style),
            Paragraph(r.get('name') or '—', cell_style),
            Paragraph(r.get('phone') or '—', cell_style),
            Paragraph(r.get('mpesa_code') or '—', cell_style),
            Paragraph(event_ref or '—', cell_style),
            Paragraph((r.get('status') or '').title(), cell_style),
            Paragraph(_fmt_money(r.get('amount', 0)), cell_style),
        ])

    if len(table_data) == 1:
        table_data.append([Paragraph('No transactions match the selected filters.', cell_style)] + [''] * 7)

    col_widths = [
        doc.width * 0.13, doc.width * 0.09, doc.width * 0.16, doc.width * 0.11,
        doc.width * 0.12, doc.width * 0.20, doc.width * 0.08, doc.width * 0.11,
    ]
    tx_table = Table(table_data, colWidths=col_widths, repeatRows=1)
    tx_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('ALIGN', (7, 0), (7, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_GREY]),
        ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#e5e7eb')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    elements.append(tx_table)

    doc.build(elements)
    buffer.seek(0)
    return buffer
