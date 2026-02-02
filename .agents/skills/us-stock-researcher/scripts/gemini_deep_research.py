#!/usr/bin/env python3.11
"""
Gemini Deep Research Agent Financial Analysis Script
Uses Google Gemini Deep Research Agent combined with investment analysis framework for deep financial analysis

Supports two-phase deep research:
- Phase 1: Local filing deep analysis (using Files API to upload complete file)
- Phase 2: Web deep research (based on Phase 1 results, search competitors, industry trends)
"""
import argparse
import json
import os
import sys
import time
from pathlib import Path
from datetime import datetime
from typing import Optional

try:
    from google import genai
except ImportError:
    print("Error: Please install google-genai first")
    print("Run: pip install google-genai")
    sys.exit(1)


def estimate_tokens(text: str) -> int:
    """
    Simple token count estimation for text

    Uses character count / 4 simple estimation, no extra dependencies needed
    English ~4 characters = 1 token, Chinese ~1-2 characters = 1 token
    This estimation is conservative, suitable for deciding whether to upload file

    Args:
        text: Input text

    Returns:
        Estimated token count
    """
    return len(text) // 4


def load_prompt_template(template_name: str) -> str:
    """
    Load prompt template from prompts/ directory

    Args:
        template_name: Template filename (e.g., phase1-inline-template.md)

    Returns:
        Template content string
    """
    script_dir = Path(__file__).parent.parent
    template_path = script_dir / "prompts" / template_name
    return template_path.read_text(encoding='utf-8')


class GeminiDeepResearchAnalyzer:
    """Gemini Deep Research Agent Financial Analyzer (Two-Phase Architecture)"""

    # Token threshold: only upload to File Search Store when exceeding this value
    # Below this value, pass directly via prompt, saving upload and indexing time
    TOKEN_THRESHOLD = 80000

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("Please set environment variable GEMINI_API_KEY")

        self.client = genai.Client(api_key=api_key)
        self.agent_model = "deep-research-pro-preview-12-2025"

    def upload_file_to_store(self, file_path: str, display_name: str = None) -> str:
        """
        Upload file to Gemini File Search Store (using import file mode)

        Uses two-step process: first upload to Files API, then import to File Search Store
        Per official docs: https://ai.google.dev/gemini-api/docs/file-search#importing-files

        Args:
            file_path: Local file path
            display_name: File Search Store display name (auto-generated if not provided)

        Returns:
            File Search Store name
        """
        print(f"Uploading file to Gemini File Search Store: {file_path}")
        file_size = Path(file_path).stat().st_size
        print(f"File size: {file_size / 1024 / 1024:.2f} MB")

        if not display_name:
            display_name = f"sec-filing-{int(time.time())}"

        # 1. First upload file to Files API
        file_display_name = Path(file_path).stem
        print(f"Step 1: Uploading file to Files API...")
        uploaded_file = self.client.files.upload(
            file=file_path,
            config={'display_name': file_display_name}
        )
        print(f"File upload successful: {uploaded_file.name}")

        # 2. Create File Search Store
        print(f"Step 2: Creating File Search Store: {display_name}")
        file_search_store = self.client.file_search_stores.create(
            config={'display_name': display_name}
        )
        print(f"File Search Store created: {file_search_store.name}")

        # 3. Import file to File Search Store
        print(f"Step 3: Importing file to File Search Store...")
        operation = self.client.file_search_stores.import_file(
            file_search_store_name=file_search_store.name,
            file_name=uploaded_file.name
        )

        # 4. Wait for indexing to complete
        print("Waiting for file indexing to complete...")
        wait_count = 0
        while not operation.done:
            time.sleep(5)
            wait_count += 1
            operation = self.client.operations.get(operation)
            print(f"  Indexing status: {'Complete' if operation.done else f'Processing... ({wait_count * 5}s)'}")

        print(f"File import and indexing complete!")
        return file_search_store.name

    def _wait_for_research(
        self,
        interaction_id: str,
        poll_interval: int,
        max_wait_time: int
    ) -> Optional[str]:
        """
        Wait for Deep Research task to complete

        Args:
            interaction_id: Research task ID
            poll_interval: Polling interval in seconds
            max_wait_time: Maximum wait time in seconds

        Returns:
            Research result text, None on timeout
        """
        start_time = time.time()

        while True:
            elapsed = time.time() - start_time

            if elapsed > max_wait_time:
                print(f"Timeout: Waited over {max_wait_time} seconds")
                return None

            try:
                status = self.client.interactions.get(interaction_id)
                current_status = status.status

                print(f"[{datetime.now().strftime('%H:%M:%S')}] Status: {current_status} (waited {int(elapsed)}s)")

                if current_status == "completed":
                    print("\nResearch complete!")
                    return status.outputs[-1].text
                elif current_status == "failed":
                    print(f"\nResearch failed: {status}")
                    return None

            except Exception as e:
                print(f"Status query error: {e}")

            time.sleep(poll_interval)

        return None

    def _run_with_inline_content(
        self,
        file_content: str,
        analysis_prompt: str,
        output_file: str,
        poll_interval: int,
        max_wait_time: int
    ) -> str:
        """
        Small file mode: Embed file content directly in prompt

        For files with token count <= TOKEN_THRESHOLD
        Skips File Search Store upload step, improves processing speed

        Args:
            file_content: Filing file content
            analysis_prompt: Analysis framework prompt
            output_file: Output report path
            poll_interval: Polling interval (seconds)
            max_wait_time: Maximum wait time (seconds)

        Returns:
            Phase 1 analysis report content
        """
        print("Using direct input mode (small file optimization)")

        # Load and fill template from prompts
        template = load_prompt_template("phase1-inline-template.md")
        phase1_prompt = template.format(
            analysis_prompt=analysis_prompt,
            file_content=file_content
        )

        print(f"Full prompt length: {len(phase1_prompt)} characters")
        print("Starting Phase 1 Deep Research Agent (direct input mode)...")

        # Create Deep Research interaction (no file_search tool)
        interaction = self.client.interactions.create(
            input=phase1_prompt,
            agent=self.agent_model,
            background=True
        )

        interaction_id = interaction.id
        print(f"Research task created: {interaction_id}")

        # Wait for completion
        result = self._wait_for_research(interaction_id, poll_interval, max_wait_time)

        if result is None:
            raise RuntimeError("Phase 1 Deep Research analysis failed or timed out")

        # Save result
        Path(output_file).parent.mkdir(parents=True, exist_ok=True)
        Path(output_file).write_text(result, encoding='utf-8')
        print(f"\nPhase 1 report saved to: {output_file}")

        return result

    def _run_with_file_search(
        self,
        input_file: str,
        analysis_prompt: str,
        output_file: str,
        poll_interval: int,
        max_wait_time: int
    ) -> str:
        """
        Large file mode: Upload to File Search Store

        For files with token count > TOKEN_THRESHOLD
        Uses Gemini File Search Store to handle extra-long files

        Args:
            input_file: SEC filing file path
            analysis_prompt: Analysis framework prompt
            output_file: Output report path
            poll_interval: Polling interval (seconds)
            max_wait_time: Maximum wait time (seconds)

        Returns:
            Phase 1 analysis report content
        """
        print("Using File Search Store mode (large file)")

        # Upload complete filing to File Search Store
        store_name = self.upload_file_to_store(input_file)

        # Load and fill template from prompts
        template = load_prompt_template("phase1-filesearch-template.md")
        phase1_prompt = template.format(analysis_prompt=analysis_prompt)

        print(f"Analysis prompt length: {len(phase1_prompt)} characters")
        print("Starting Phase 1 Deep Research Agent (File Search mode)...")

        # Create Deep Research interaction with file_search tool
        interaction = self.client.interactions.create(
            input=phase1_prompt,
            agent=self.agent_model,
            background=True,
            tools=[
                {
                    "type": "file_search",
                    "file_search_store_names": [store_name]
                }
            ]
        )

        interaction_id = interaction.id
        print(f"Research task created: {interaction_id}")

        # Wait for completion
        result = self._wait_for_research(interaction_id, poll_interval, max_wait_time)

        if result is None:
            raise RuntimeError("Phase 1 Deep Research analysis failed or timed out")

        # Save result
        Path(output_file).parent.mkdir(parents=True, exist_ok=True)
        Path(output_file).write_text(result, encoding='utf-8')
        print(f"\nPhase 1 report saved to: {output_file}")

        return result

    def run_phase1_local_analysis(
        self,
        input_file: str,
        analysis_prompt: str,
        output_file: str,
        poll_interval: int = 30,
        max_wait_time: int = 1800
    ) -> str:
        """
        Phase 1: Local filing deep analysis (smart mode auto-selection)

        Auto-selects optimal processing method based on file token count:
        - Small files (<= 80K tokens): Pass directly via prompt, skip upload step
        - Large files (> 80K tokens): Upload to File Search Store

        Args:
            input_file: SEC filing file path
            analysis_prompt: Analysis framework prompt
            output_file: Output report path
            poll_interval: Polling interval (seconds)
            max_wait_time: Maximum wait time (seconds)

        Returns:
            Phase 1 analysis report content
        """
        print(f"\n{'='*60}")
        print("Phase 1: Local Filing Deep Analysis")
        print(f"{'='*60}")

        # Read file content and estimate token count
        file_content = Path(input_file).read_text(encoding='utf-8')
        file_size_kb = len(file_content.encode('utf-8')) / 1024
        token_count = estimate_tokens(file_content)

        print(f"File size: {file_size_kb:.1f} KB")
        print(f"Token estimate: {token_count:,} (threshold: {self.TOKEN_THRESHOLD:,})")

        # Auto-select processing method based on token count
        if token_count <= self.TOKEN_THRESHOLD:
            return self._run_with_inline_content(
                file_content=file_content,
                analysis_prompt=analysis_prompt,
                output_file=output_file,
                poll_interval=poll_interval,
                max_wait_time=max_wait_time
            )
        else:
            return self._run_with_file_search(
                input_file=input_file,
                analysis_prompt=analysis_prompt,
                output_file=output_file,
                poll_interval=poll_interval,
                max_wait_time=max_wait_time
            )

    def run_phase2_web_research(
        self,
        phase1_result: str,
        company_name: str,
        output_file: str,
        poll_interval: int = 30,
        max_wait_time: int = 1800
    ) -> str:
        """
        Phase 2: Web deep research

        Conducts web searches based on Phase 1 key findings

        Args:
            phase1_result: Phase 1 analysis result
            company_name: Company name (for search)
            output_file: Output report path
            poll_interval: Polling interval (seconds)
            max_wait_time: Maximum wait time (seconds)

        Returns:
            Phase 2 research report content
        """
        print(f"\n{'='*60}")
        print("Phase 2: Web Deep Research")
        print(f"{'='*60}")

        # Extract research questions from Phase 1
        research_questions = self._extract_research_questions(phase1_result)

        # Load and fill template from prompts
        template = load_prompt_template("phase2-web-research-template.md")
        phase2_prompt = template.format(
            company_name=company_name,
            phase1_result=phase1_result,
            research_questions=research_questions
        )

        print(f"Phase 2 prompt length: {len(phase2_prompt)} characters")
        print("Starting Phase 2 Deep Research Agent (web search mode)...")

        # Create web search Deep Research interaction
        try:
            interaction = self.client.interactions.create(
                input=phase2_prompt,
                agent=self.agent_model,
                background=True
            )
        except Exception as e:
            print(f"Failed to create Phase 2 research task: {e}")
            return f"Phase 2 research failed: {e}"

        interaction_id = interaction.id
        print(f"Research task created: {interaction_id}")

        # Wait for completion
        result = self._wait_for_research(interaction_id, poll_interval, max_wait_time)

        if result is None:
            result = "Phase 2 web research timed out or failed"

        # Save Phase 2 result
        Path(output_file).parent.mkdir(parents=True, exist_ok=True)
        Path(output_file).write_text(result, encoding='utf-8')
        print(f"\nPhase 2 report saved to: {output_file}")

        return result

    def run_two_phase_research(
        self,
        input_file: str,
        analysis_prompt: str,
        output_dir: str,
        company_ticker: str,
        company_name: str,
        poll_interval: int = 30,
        max_wait_time: int = 1800
    ) -> dict:
        """
        Execute complete two-phase deep research

        Args:
            input_file: SEC filing file path
            analysis_prompt: Analysis framework prompt
            output_dir: Output directory (e.g., investment-research/TSM)
            company_ticker: Company ticker (e.g., TSM, AAPL)
            company_name: Company name (for Phase 2 web search)
            poll_interval: Polling interval (seconds)
            max_wait_time: Maximum wait time per phase (seconds)

        Returns:
            Dictionary containing report paths and content
            Report integration done by Claude in skill workflow
        """
        print(f"\n{'#'*60}")
        print("Starting Two-Phase Deep Research")
        print(f"{'#'*60}")

        date_str = datetime.now().strftime("%Y-%m-%d")

        # Create output directory and tmp subdirectory
        output_path = Path(output_dir)
        tmp_dir = output_path / "tmp"
        tmp_dir.mkdir(parents=True, exist_ok=True)

        # Temp file paths (Phase 1 and Phase 2 reports)
        phase1_output = tmp_dir / f"phase1-{date_str}.md"
        phase2_output = tmp_dir / f"phase2-{date_str}.md"

        # Final report path (saved by Claude after integration)
        final_output = output_path / f"{company_ticker}-Investment-Report-{date_str}.md"

        # Phase 1: Local filing analysis
        phase1_result = self.run_phase1_local_analysis(
            input_file=input_file,
            analysis_prompt=analysis_prompt,
            output_file=str(phase1_output),
            poll_interval=poll_interval,
            max_wait_time=max_wait_time
        )

        # Phase 2: Web deep research
        phase2_result = self.run_phase2_web_research(
            phase1_result=phase1_result,
            company_name=company_name,
            output_file=str(phase2_output),
            poll_interval=poll_interval,
            max_wait_time=max_wait_time
        )

        # No longer auto-merge, return both report paths
        # Report integration done by Claude in skill workflow per report-merge-prompt.md
        print(f"\n{'='*60}")
        print("Two-Phase Research Complete")
        print(f"{'='*60}")
        print(f"Phase 1 report: {phase1_output}")
        print(f"Phase 2 report: {phase2_output}")
        print(f"Final report path: {final_output}")
        print("\nPlease use report-merge-prompt.md guide to integrate both reports")

        return {
            "phase1": str(phase1_output),
            "phase2": str(phase2_output),
            "final_output": str(final_output),
            "phase1_content": phase1_result,
            "phase2_content": phase2_result
        }

    def _extract_research_questions(self, phase1_result: str) -> str:
        """Extract research questions from Phase 1 result"""
        # Try to find Phase 2 research questions section
        if "Phase 2 Research Questions" in phase1_result:
            parts = phase1_result.split("Phase 2 Research Questions")
            if len(parts) > 1:
                return parts[1][:2000]  # Limit length

        # If not found, return default questions
        return """
1. What is the latest performance of company's main competitors?
2. What are the latest industry development trends?
3. Has management made any major strategic adjustments or personnel changes recently?
4. Are there any regulatory risks or legal proceedings?
5. What are analysts' latest ratings and target prices for this company?
"""

    def _extract_key_findings(self, phase1_result: str) -> str:
        """Extract key findings summary from Phase 1 result"""
        # Extract first 3000 characters as summary
        summary = phase1_result[:3000]

        # Try to find investment thesis section
        if "Investment Thesis" in phase1_result:
            thesis_start = phase1_result.find("Investment Thesis")
            thesis_section = phase1_result[thesis_start:thesis_start+1500]
            summary = f"{summary}\n\nKey Investment Thesis:\n{thesis_section}"

        return summary[:4000]  # Limit total length

    # Keep old interface for backward compatibility
    def run_deep_research(
        self,
        input_file: str,
        analysis_prompt: str,
        output_file: str,
        poll_interval: int = 30,
        max_wait_time: int = 1800
    ) -> str:
        """
        Backward compatible interface: Single-phase Deep Research analysis

        Note: This method kept for backward compatibility, recommend using run_two_phase_research
        """
        return self.run_phase1_local_analysis(
            input_file=input_file,
            analysis_prompt=analysis_prompt,
            output_file=output_file,
            poll_interval=poll_interval,
            max_wait_time=max_wait_time
        )


def main():
    parser = argparse.ArgumentParser(
        description="Use Gemini Deep Research Agent for SEC filing deep analysis (supports two-phase research)"
    )
    parser.add_argument(
        "--input",
        required=True,
        help="SEC filing file path"
    )
    parser.add_argument(
        "--prompt",
        required=True,
        help="Analysis framework prompt file path"
    )
    parser.add_argument(
        "--output-dir",
        required=True,
        help="Output directory (e.g., investment-research/TSM)"
    )
    parser.add_argument(
        "--ticker",
        required=True,
        help="Company ticker (e.g., TSM, AAPL)"
    )
    parser.add_argument(
        "--company",
        default="",
        help="Company name (for Phase 2 web search, inferred from ticker if not provided)"
    )
    parser.add_argument(
        "--phase",
        choices=["all", "local", "web"],
        default="all",
        help="Execution phase: all=complete two-phase analysis, local=Phase1 filing analysis only, web=Phase2 web research only (default: all)"
    )
    parser.add_argument(
        "--phase1-output",
        default="",
        help="Phase 1 output file path (for Phase 2 use, only needed when --phase=web)"
    )
    parser.add_argument(
        "--poll-interval",
        type=int,
        default=30,
        help="Polling interval in seconds (default: 30)"
    )
    parser.add_argument(
        "--max-wait",
        type=int,
        default=1800,
        help="Maximum wait time in seconds (default: 1800)"
    )

    args = parser.parse_args()

    input_file = args.input
    prompt_file = args.prompt
    output_dir = args.output_dir
    company_ticker = args.ticker
    company_name = args.company
    phase = args.phase
    phase1_output = args.phase1_output
    poll_interval = args.poll_interval
    max_wait = args.max_wait

    # Validate input file
    if phase in ["all", "local"]:
        if not Path(input_file).exists():
            print(f"Error: Filing file not found {input_file}")
            sys.exit(1)

    if not Path(prompt_file).exists():
        print(f"Error: Analysis framework file not found {prompt_file}")
        sys.exit(1)

    # Infer company name (if not provided)
    if not company_name:
        company_name = company_ticker.upper()

    # Read analysis framework
    analysis_prompt = Path(prompt_file).read_text(encoding='utf-8')

    # Execute analysis
    analyzer = GeminiDeepResearchAnalyzer()

    if phase == "all":
        # Complete two-phase analysis
        result = analyzer.run_two_phase_research(
            input_file=input_file,
            analysis_prompt=analysis_prompt,
            output_dir=output_dir,
            company_ticker=company_ticker,
            company_name=company_name,
            poll_interval=poll_interval,
            max_wait_time=max_wait
        )
        print(f"\nAnalysis complete!")
        print(f"Phase 1 report: {result['phase1']}")
        print(f"Phase 2 report: {result['phase2']}")
        print(f"Final report path: {result['final_output']}")
    elif phase == "local":
        # Phase 1 local analysis only
        date_str = datetime.now().strftime("%Y-%m-%d")
        tmp_dir = Path(output_dir) / "tmp"
        tmp_dir.mkdir(parents=True, exist_ok=True)
        output_file = tmp_dir / f"phase1-{date_str}.md"

        result = analyzer.run_phase1_local_analysis(
            input_file=input_file,
            analysis_prompt=analysis_prompt,
            output_file=str(output_file),
            poll_interval=poll_interval,
            max_wait_time=max_wait
        )
        print(f"\nAnalysis complete! Report: {output_file}")
    elif phase == "web":
        # Phase 2 web research only
        if not phase1_output:
            print("Error: --phase=web requires --phase1-output parameter")
            sys.exit(1)

        if not Path(phase1_output).exists():
            print(f"Error: Phase 1 output file not found {phase1_output}")
            sys.exit(1)

        date_str = datetime.now().strftime("%Y-%m-%d")
        tmp_dir = Path(output_dir) / "tmp"
        tmp_dir.mkdir(parents=True, exist_ok=True)
        output_file = tmp_dir / f"phase2-{date_str}.md"

        phase1_result = Path(phase1_output).read_text(encoding='utf-8')

        result = analyzer.run_phase2_web_research(
            phase1_result=phase1_result,
            company_name=company_name,
            output_file=str(output_file),
            poll_interval=poll_interval,
            max_wait_time=max_wait
        )
        print(f"\nAnalysis complete! Report: {output_file}")


if __name__ == "__main__":
    main()
