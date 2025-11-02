"""
Python Example - Using Satomi API

This example demonstrates how to use the Satomi API
for Japanese concept explanations from a Python application.
"""

import requests
import json
from typing import List, Dict, Optional

BASE_URL = 'http://localhost:3000'


class SatomiClient:
    """Client for interacting with the Satomi API"""

    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})

    def explain_concept(self, query: str) -> Dict:
        """
        Get explanation of a Japanese concept

        Args:
            query: Question or concept name to explain

        Returns:
            Dictionary containing concept information

        Raises:
            Exception: If the API request fails
        """
        url = f'{self.base_url}/api/japanese-concept'
        payload = {'query': query}

        response = self.session.post(url, json=payload)
        data = response.json()

        if data['success']:
            return data['concept']
        else:
            raise Exception(data.get('error', 'Request failed'))

    def process_content(
        self,
        content: str,
        process_type: str = 'improve',
        filename: Optional[str] = None
    ) -> str:
        """
        Process content through AI

        Args:
            content: Text content to process
            process_type: Type of processing (improve, summarize, analyze, custom)
            filename: Optional filename for context

        Returns:
            Processed content string

        Raises:
            Exception: If the API request fails
        """
        url = f'{self.base_url}/api/process-content'
        payload = {
            'content': content,
            'processType': process_type
        }

        if filename:
            payload['filename'] = filename

        response = self.session.post(url, json=payload)
        data = response.json()

        if data['success']:
            return data['processedContent']
        else:
            raise Exception(data.get('error', 'Request failed'))

    def validate_file(self, filename: str, content: str) -> Dict:
        """
        Validate file content for production readiness

        Args:
            filename: Name of the file
            content: File content to validate

        Returns:
            Dictionary with validation results
        """
        url = f'{self.base_url}/api/validate-file'
        payload = {
            'filename': filename,
            'content': content
        }

        response = self.session.post(url, json=payload)
        return response.json()


class ConceptConversation:
    """Maintains conversation context for multiple queries"""

    def __init__(self, base_url: str = BASE_URL):
        self.client = SatomiClient(base_url)
        self.history: List[Dict[str, str]] = []

    def ask(self, query: str) -> Dict:
        """
        Ask a question with conversation context

        Args:
            query: Question to ask

        Returns:
            Concept information dictionary
        """
        url = f'{self.client.base_url}/api/japanese-concept'
        payload = {
            'query': query,
            'conversationHistory': self.history
        }

        response = self.client.session.post(url, json=payload)
        data = response.json()

        if data['success']:
            # Update history
            self.history.append({'role': 'user', 'content': query})
            self.history.append({
                'role': 'assistant',
                'content': data['concept']['fullResponse']
            })

            return data['concept']
        else:
            raise Exception(data.get('error', 'Request failed'))

    def clear_history(self):
        """Clear conversation history"""
        self.history = []

    def get_history(self) -> List[Dict[str, str]]:
        """Get current conversation history"""
        return self.history


def example_simple_concept():
    """Example 1: Simple concept explanation"""
    print("Example 1: Simple Concept Explanation\n")

    client = SatomiClient()
    concept = client.explain_concept("What is ikigai?")

    print(f"Concept: {concept['name']}")
    print(f"\nExplanation: {concept['explanation']}")
    print(f"\nOrigin: {concept['origin']}")
    print(f"\nApplication: {concept['application']}\n")


def example_conversation():
    """Example 2: Conversational interface"""
    print("\nExample 2: Conversational Interface\n")

    conversation = ConceptConversation()

    # First question
    response1 = conversation.ask("What is wabi-sabi?")
    print(f"Q: What is wabi-sabi?")
    print(f"A: {response1['name']}\n")

    # Follow-up question with context
    response2 = conversation.ask("How can I practice it in my daily life?")
    print(f"Q: How can I practice it in my daily life?")
    print(f"A: {response2['application'][:200]}...\n")

    print(f"Conversation history: {len(conversation.get_history())} messages")


def example_content_processing():
    """Example 3: Content processing"""
    print("\nExample 3: Content Processing\n")

    client = SatomiClient()

    raw_content = """
    This is my project description with [placeholder] text.
    TODO: Add more details here.
    It needs improvement and polish.
    """

    improved = client.process_content(raw_content, process_type='improve')
    print("Original content had placeholders.")
    print(f"Improved content:\n{improved}\n")


def example_file_validation():
    """Example 4: File validation"""
    print("\nExample 4: File Validation\n")

    client = SatomiClient()

    readme_content = """
    # My Project

    This is a [TODO] description of my project.
    Replace this with actual content.
    """

    validation = client.validate_file("README.md", readme_content)

    print(f"Valid: {validation['valid']}")
    if validation['errors']:
        print(f"Errors: {validation['errors']}")
    if validation['warnings']:
        print(f"Warnings: {validation['warnings']}")
    if validation.get('cleanedContent'):
        print(f"Cleaned content available: Yes")


def main():
    """Run all examples"""
    try:
        example_simple_concept()
        example_conversation()
        example_content_processing()
        example_file_validation()
    except Exception as e:
        print(f"Error: {e}")


if __name__ == '__main__':
    main()

