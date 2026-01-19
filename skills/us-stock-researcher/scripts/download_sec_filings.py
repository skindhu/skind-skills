#!/usr/bin/env python3.11
"""
SEC Filing Download Script
Uses sec-edgar-downloader to download 10-K/10-Q filings from SEC EDGAR
Auto-cleans HTML tags and binary data after download

Default output to: <project_root>/investment-research/{TICKER}/tmp/sec_filings/
"""
import argparse
import os
import sys
from pathlib import Path


def get_project_root() -> Path:
    """
    Get project root directory
    Uses current working directory (cwd) as project root,
    because Claude Code sets cwd to user's project directory when running commands.
    """
    return Path.cwd()


def get_default_output_dir(ticker: str) -> str:
    """
    Get default output directory: <project_root>/investment-research/{TICKER}/tmp/sec_filings
    """
    project_root = get_project_root()
    return str(project_root / "investment-research" / ticker / "tmp" / "sec_filings")

try:
    from sec_edgar_downloader import Downloader
except ImportError:
    print("Error: Please install sec-edgar-downloader first")
    print("Run: pip install sec-edgar-downloader")
    sys.exit(1)

# Import cleaner module
try:
    from clean_sec_filing import clean_sec_filing
except ImportError:
    # If running as script directly, try importing from same directory
    script_dir = Path(__file__).parent
    sys.path.insert(0, str(script_dir))
    from clean_sec_filing import clean_sec_filing


def download_filings(
    ticker: str,
    filing_type: str = "10-K",
    limit: int = 1,
    output_dir: str = None,
    auto_clean: bool = True
) -> list[Path]:
    """
    Download SEC filings

    Args:
        ticker: Stock ticker (e.g., AAPL, MSFT)
        filing_type: Filing type (10-K annual, 10-Q quarterly)
        limit: Number of periods to download
        output_dir: Output directory, defaults to <project_root>/investment-research/{TICKER}/tmp/sec_filings
        auto_clean: Whether to auto-clean HTML and binary data (default True)

    Returns:
        List of downloaded file paths (if auto_clean=True, returns cleaned files)
    """
    # If output directory not specified, use default path
    if output_dir is None:
        output_dir = get_default_output_dir(ticker)

    # Get SEC EDGAR access identity
    company_name = os.getenv("SEC_EDGAR_COMPANY_NAME", "InvestmentResearch")
    email = os.getenv("SEC_EDGAR_EMAIL", "research@example.com")

    print(f"Downloading {ticker} {filing_type} filings...")
    print(f"SEC EDGAR identity: {company_name} <{email}>")

    # Create downloader
    dl = Downloader(company_name, email, output_dir)

    # Download filings
    dl.get(filing_type, ticker, limit=limit)

    # Find downloaded files
    filing_dir = Path(output_dir) / "sec-edgar-filings" / ticker / filing_type

    if not filing_dir.exists():
        print(f"Warning: Downloaded file directory not found {filing_dir}")
        return []

    # Find all filing files
    raw_files = list(filing_dir.glob("**/full-submission.txt"))

    if not raw_files:
        # Try other possible filenames
        raw_files = list(filing_dir.glob("**/*.txt"))

    print(f"Successfully downloaded {len(raw_files)} files")

    # Auto clean
    if auto_clean and raw_files:
        print("\nCleaning files...")
        cleaned_files = []
        for raw_file in raw_files:
            try:
                cleaned_path = raw_file.parent / "cleaned.txt"
                clean_sec_filing(str(raw_file), str(cleaned_path))
                cleaned_files.append(cleaned_path)
            except Exception as e:
                print(f"Cleaning failed {raw_file}: {e}")
                cleaned_files.append(raw_file)  # Return original file on failure
        return cleaned_files

    return raw_files


def main():
    parser = argparse.ArgumentParser(
        description="Download company filings (10-K/10-Q) from SEC EDGAR, auto-clean HTML and binary data"
    )
    parser.add_argument(
        "--ticker",
        required=True,
        help="Stock ticker (e.g., AAPL, MSFT, GOOGL)"
    )
    parser.add_argument(
        "--type",
        default="10-K",
        choices=["10-K", "10-Q", "8-K", "DEF 14A", "20-F", "6-K"],
        help="Filing type (default: 10-K, foreign companies use 20-F/6-K)"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=1,
        help="Number of periods to download (default: 1)"
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Output directory (default: <project_root>/investment-research/{TICKER}/tmp/sec_filings)"
    )
    parser.add_argument(
        "--no-clean",
        action="store_true",
        help="Don't auto-clean files (keep original HTML and binary data)"
    )

    args = parser.parse_args()

    files = download_filings(
        ticker=args.ticker,
        filing_type=args.type,
        limit=args.limit,
        output_dir=args.output,
        auto_clean=not args.no_clean
    )

    if files:
        print("\nOutput files:")
        for f in files:
            print(f"  - {f}")
    else:
        print("\nNo files found")
        sys.exit(1)


if __name__ == "__main__":
    main()
