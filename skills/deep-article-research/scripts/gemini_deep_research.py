#!/usr/bin/env python3.11
"""
Gemini Deep Research — Article Argument Verification Script
Uses Google Gemini Deep Research Agent for web-based deep verification of article arguments.

Single-phase web research: takes argument extraction results as input,
conducts comprehensive web search to verify each argument, outputs complete analysis report.
"""
import argparse
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


class GeminiArticleVerifier:
    """Gemini Deep Research Agent for Article Argument Verification"""

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("Please set environment variable GEMINI_API_KEY")

        self.client = genai.Client(api_key=api_key)
        self.agent_model = "deep-research-pro-preview-12-2025"

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

    def run_web_verification(
        self,
        input_content: str,
        prompt_template: str,
        topic_keywords: str,
        output_file: str,
        poll_interval: int = 30,
        max_wait_time: int = 1800
    ) -> str:
        """
        Web deep research for article argument verification

        Args:
            input_content: Argument extraction results (markdown)
            prompt_template: Verification prompt template
            topic_keywords: Article topic keywords (for web search context)
            output_file: Output report path
            poll_interval: Polling interval (seconds)
            max_wait_time: Maximum wait time (seconds)

        Returns:
            Verification report content
        """
        print(f"\n{'='*60}")
        print("Article Argument Deep Verification — Web Research")
        print(f"{'='*60}")

        # Fill prompt template
        verification_prompt = prompt_template.format(
            input_content=input_content,
            topic_keywords=topic_keywords
        )

        print(f"Verification prompt length: {len(verification_prompt)} characters")
        print("Starting Gemini Deep Research Agent (web search mode)...")

        # Create web search Deep Research interaction
        try:
            interaction = self.client.interactions.create(
                input=verification_prompt,
                agent=self.agent_model,
                background=True
            )
        except Exception as e:
            print(f"Failed to create research task: {e}")
            raise RuntimeError(f"Gemini Deep Research task creation failed: {e}")

        interaction_id = interaction.id
        print(f"Research task created: {interaction_id}")

        # Wait for completion
        result = self._wait_for_research(interaction_id, poll_interval, max_wait_time)

        if result is None:
            raise RuntimeError("Deep Research verification failed or timed out")

        # Save result
        Path(output_file).parent.mkdir(parents=True, exist_ok=True)
        Path(output_file).write_text(result, encoding='utf-8')
        print(f"\nVerification report saved to: {output_file}")

        return result


def main():
    parser = argparse.ArgumentParser(
        description="Use Gemini Deep Research Agent for article argument deep verification"
    )
    parser.add_argument(
        "--input",
        required=True,
        help="Argument extraction results file path"
    )
    parser.add_argument(
        "--prompt",
        required=True,
        help="Verification prompt template file path"
    )
    parser.add_argument(
        "--output-dir",
        required=True,
        help="Output directory (e.g., tmp/article-deep-research/china-ai-policy)"
    )
    parser.add_argument(
        "--slug", "--ticker",
        required=True,
        dest="slug",
        help="Article slug for file naming (e.g., china-ai-policy)"
    )
    parser.add_argument(
        "--topic", "--company",
        default="",
        dest="topic",
        help="Article topic keywords (for web search context)"
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
    slug = args.slug
    topic_keywords = args.topic
    poll_interval = args.poll_interval
    max_wait = args.max_wait

    # Validate input files
    if not Path(input_file).exists():
        print(f"Error: Argument extraction file not found: {input_file}")
        sys.exit(1)

    if not Path(prompt_file).exists():
        print(f"Error: Prompt template file not found: {prompt_file}")
        sys.exit(1)

    # Read input content and prompt template
    input_content = Path(input_file).read_text(encoding='utf-8')
    prompt_template = Path(prompt_file).read_text(encoding='utf-8')

    # Use slug as topic keywords if not provided
    if not topic_keywords:
        topic_keywords = slug.replace("-", " ")

    # Build output file path
    date_str = datetime.now().strftime("%Y-%m-%d")
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    output_file = output_path / f"{slug}-Analysis-Report-{date_str}.md"

    # Execute verification
    verifier = GeminiArticleVerifier()

    result = verifier.run_web_verification(
        input_content=input_content,
        prompt_template=prompt_template,
        topic_keywords=topic_keywords,
        output_file=str(output_file),
        poll_interval=poll_interval,
        max_wait_time=max_wait
    )

    print(f"\nVerification complete!")
    print(f"Report: {output_file}")


if __name__ == "__main__":
    main()
