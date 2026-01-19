#!/usr/bin/env python3.11
"""
SEC Filing Cleaner Script
Converts SEC EDGAR raw full-submission.txt to clean plain text format

Features:
1. Remove uuencode-encoded binary data (images, PDFs, etc.)
2. Remove HTML/XML tags, preserve text content
3. Preserve SEC document structure info (document type, description, etc.)
4. Extract hidden text (e.g., white small font data in slides)
5. Clean excess blank lines, optimize readability
"""
import argparse
import re
import sys
from html import unescape
from pathlib import Path


def remove_uuencoded_data(content: str) -> str:
    """
    Remove uuencode-encoded binary data blocks
    Format: begin [mode] [filename] ... end
    """
    # Match uuencode block: begin 644 filename.jpg ... until file end or next document
    pattern = r'begin \d{3} [^\n]+\n(?:[^\n]+\n)*?(?=end\n|</TEXT>|</DOCUMENT>)'
    content = re.sub(pattern, '[BINARY DATA REMOVED]\n', content)

    # Clean residual end markers
    content = re.sub(r'^end\n', '', content, flags=re.MULTILINE)

    return content


def remove_base64_data(content: str) -> str:
    """
    Remove Base64 encoded data (usually in XBRL or other embedded content)
    """
    # Remove long Base64 strings (consecutive alphanumeric+/=, over 100 chars)
    pattern = r'(?<=>)[A-Za-z0-9+/=\n]{500,}(?=<)'
    content = re.sub(pattern, '[BASE64 DATA REMOVED]', content)

    return content


def extract_text_from_html(html_content: str) -> str:
    """
    Extract plain text from HTML, preserve structure
    """
    text = html_content

    # Convert certain tags to newlines
    block_tags = ['div', 'p', 'br', 'tr', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr']
    for tag in block_tags:
        text = re.sub(rf'<{tag}[^>]*/?>', '\n', text, flags=re.IGNORECASE)
        text = re.sub(rf'</{tag}>', '\n', text, flags=re.IGNORECASE)

    # Convert td/th to tab-separated
    text = re.sub(r'</t[dh]>\s*<t[dh][^>]*>', '\t', text, flags=re.IGNORECASE)
    text = re.sub(r'<t[dh][^>]*>', '', text, flags=re.IGNORECASE)
    text = re.sub(r'</t[dh]>', '\t', text, flags=re.IGNORECASE)

    # Remove all remaining HTML tags
    text = re.sub(r'<[^>]+>', '', text)

    # Decode HTML entities
    text = unescape(text)

    # Clean common special characters
    text = text.replace('\xa0', ' ')  # non-breaking space
    text = text.replace('\u200b', '')  # zero-width space

    return text


def clean_whitespace(content: str) -> str:
    """
    Clean excess whitespace characters
    """
    # Merge multiple spaces/tabs into single
    content = re.sub(r'[ \t]+', ' ', content)

    # Clean leading/trailing whitespace per line
    lines = [line.strip() for line in content.split('\n')]

    # Merge consecutive blank lines (keep max 2)
    result = []
    empty_count = 0
    for line in lines:
        if not line:
            empty_count += 1
            if empty_count <= 2:
                result.append('')
        else:
            empty_count = 0
            result.append(line)

    return '\n'.join(result)


def sanitize_utf8(content: str) -> str:
    """
    Clean invalid UTF-8 characters, ensure file can be safely uploaded to API

    Removes:
    - Control characters (except newline, tab)
    - Private use area characters
    - Surrogate characters
    - Other characters that may cause API parsing failures
    """
    # Remove control characters (keep \n, \t, \r)
    content = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', content)

    # Remove Unicode private use area characters (U+E000 - U+F8FF, U+F0000 - U+FFFFD, U+100000 - U+10FFFD)
    content = re.sub(r'[\uE000-\uF8FF]', '', content)

    # Remove surrogate characters (U+D800 - U+DFFF) - these usually don't appear in Python strings
    # but may occur during encoding conversion
    content = re.sub(r'[\uD800-\uDFFF]', '', content)

    # Remove zero-width characters and other invisible characters
    content = re.sub(r'[\u200b-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufffe\uffff]', '', content)

    # Remove other potentially problematic special characters
    content = content.replace('\x85', '\n')  # Next Line -> newline
    content = content.replace('\u2028', '\n')  # Line Separator -> newline
    content = content.replace('\u2029', '\n\n')  # Paragraph Separator -> double newline

    # Ensure can encode to UTF-8
    content = content.encode('utf-8', errors='ignore').decode('utf-8')

    return content


def remove_xbrl_inline_data(content: str) -> str:
    """
    Remove XBRL inline metadata

    These are machine-readable tag data, useless for human analysis:
    - FASB URL references (http://fasb.org/us-gaap/...)
    - XBRL context identifiers (0000723125...)
    - ISO currency/unit codes (iso4217:USD, xbrli:shares)
    """
    lines = content.split('\n')
    cleaned_lines = []

    for line in lines:
        # Skip lines with many XBRL identifiers
        # Feature: contains multiple http://fasb.org or us-gaap: references
        if 'http://fasb.org/us-gaap' in line and line.count('http://') > 3:
            continue

        # Skip lines with many XBRL context IDs (format like 0000723125...Member)
        if re.search(r'0000723125\d{10,}', line) and line.count('0000723125') > 5:
            continue

        # Skip ISO currency/unit definition lines
        if line.startswith('iso4217:') or line.startswith('xbrli:'):
            continue

        cleaned_lines.append(line)

    return '\n'.join(cleaned_lines)


def process_document(doc_content: str, doc_type: str) -> str:
    """
    Process single document block

    Returns:
        Processed text content, returns None to completely skip document
    """
    # Completely skip these document types (meaningless for financial analysis)
    skip_types = [
        'GRAPHIC',      # Image files
        'ZIP',          # Archives (usually XBRL)
        'JSON',         # JSON metadata
        'XBRL', 'XML', 'XSD',  # XBRL related
    ]
    if doc_type in skip_types or any(x in doc_type for x in skip_types):
        return None

    # Completely skip EX-101.* types (XBRL technical files)
    if doc_type.startswith('EX-101.'):
        return None

    # For other document types (HTML, text, etc.), extract content
    # First remove binary data
    doc_content = remove_uuencoded_data(doc_content)
    doc_content = remove_base64_data(doc_content)

    # Extract content from <TEXT> block
    text_match = re.search(r'<TEXT>(.*?)</TEXT>', doc_content, re.DOTALL | re.IGNORECASE)
    if text_match:
        text_content = text_match.group(1)
        # Extract text from HTML
        text_content = extract_text_from_html(text_content)
    else:
        text_content = extract_text_from_html(doc_content)

    return text_content


def clean_sec_filing(input_path: str, output_path: str = None) -> str:
    """
    Clean SEC filing file

    Args:
        input_path: Input file path (full-submission.txt)
        output_path: Output file path (optional, defaults to cleaned.txt in same directory)

    Returns:
        Cleaned text content
    """
    input_file = Path(input_path)

    if not input_file.exists():
        raise FileNotFoundError(f"File not found: {input_path}")

    # Read file
    print(f"Reading: {input_path}")
    content = input_file.read_text(encoding='utf-8', errors='replace')
    original_size = len(content)

    # Extract SEC header info
    header_match = re.search(r'<SEC-HEADER>(.*?)</SEC-HEADER>', content, re.DOTALL)
    header = header_match.group(1) if header_match else ''

    # Extract and process each document
    doc_pattern = r'<DOCUMENT>(.*?)</DOCUMENT>'
    documents = re.findall(doc_pattern, content, re.DOTALL)

    result_parts = []

    # Add cleaned header info
    if header:
        result_parts.append("=" * 60)
        result_parts.append("SEC FILING HEADER")
        result_parts.append("=" * 60)
        # Clean tags from header
        clean_header = re.sub(r'<[^>]+>', '', header)
        clean_header = clean_whitespace(clean_header)
        result_parts.append(clean_header)

    # Process each document
    for i, doc in enumerate(documents, 1):
        # Extract document type
        type_match = re.search(r'<TYPE>([^<\n]+)', doc)
        doc_type = type_match.group(1).strip() if type_match else f'DOCUMENT_{i}'

        # Process document content (returns None to skip)
        processed = process_document(doc, doc_type)
        if processed is None:
            continue  # Completely skip useless documents

        processed = clean_whitespace(processed)
        if not processed.strip():
            continue  # Skip empty content

        # Extract document description
        desc_match = re.search(r'<DESCRIPTION>([^<\n]+)', doc)
        doc_desc = desc_match.group(1).strip() if desc_match else ''

        # Extract filename
        filename_match = re.search(r'<FILENAME>([^<\n]+)', doc)
        doc_filename = filename_match.group(1).strip() if filename_match else ''

        result_parts.append("")
        result_parts.append("=" * 60)
        result_parts.append(f"DOCUMENT: {doc_type}")
        if doc_desc:
            result_parts.append(f"DESCRIPTION: {doc_desc}")
        if doc_filename:
            result_parts.append(f"FILENAME: {doc_filename}")
        result_parts.append("=" * 60)
        result_parts.append(processed)

    # Merge results
    result = '\n'.join(result_parts)
    result = clean_whitespace(result)

    # UTF-8 encoding cleanup, ensure file can be safely uploaded to API
    result = sanitize_utf8(result)

    # Remove XBRL inline metadata (machine-readable tags, useless for analysis)
    result = remove_xbrl_inline_data(result)

    # Clean whitespace again (may have extra blank lines after XBRL removal)
    result = clean_whitespace(result)

    # Determine output path
    if output_path is None:
        output_file = input_file.parent / 'cleaned.txt'
    else:
        output_file = Path(output_path)

    # Write file
    output_file.write_text(result, encoding='utf-8')

    cleaned_size = len(result)
    reduction = (1 - cleaned_size / original_size) * 100

    print(f"Cleaning complete: {output_file}")
    print(f"Original size: {original_size:,} characters")
    print(f"Cleaned size: {cleaned_size:,} characters")
    print(f"Compression: {reduction:.1f}%")

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Clean SEC EDGAR filing files, remove HTML tags and binary data"
    )
    parser.add_argument(
        "--input",
        required=True,
        help="Input file path (full-submission.txt)"
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Output file path (default: cleaned.txt in same directory)"
    )

    args = parser.parse_args()

    try:
        clean_sec_filing(args.input, args.output)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
