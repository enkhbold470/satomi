"""
OMI Integration Testing Script (Python)

Tests Satomi's OMI webhook endpoints with various scenarios
"""

import requests
import json
from typing import Dict, Any

# Configuration
WEBHOOK_URL = "http://localhost:3000/api/omi/webhook"
MEMORY_URL = "http://localhost:3000/api/omi/memory"


def print_header(text: str):
    """Print formatted test header"""
    print(f"\n{'='*50}")
    print(f"  {text}")
    print(f"{'='*50}\n")


def print_test(test_name: str):
    """Print test name"""
    print(f"\n>>> Test: {test_name}")
    print("-" * 50)


def test_webhook_health():
    """Test webhook health check"""
    print_test("Webhook Health Check (GET)")
    
    response = requests.get(WEBHOOK_URL)
    data = response.json()
    
    print(f"Status Code: {response.status_code}")
    print(json.dumps(data, indent=2))
    
    return response.status_code == 200


def test_concept_query(transcript: str, test_name: str):
    """Test Japanese concept query"""
    print_test(test_name)
    
    payload = {
        "transcript": transcript,
        "session_id": f"test_session_{test_name}",
        "user_id": "test_user_python"
    }
    
    response = requests.post(
        WEBHOOK_URL,
        headers={"Content-Type": "application/json"},
        json=payload
    )
    
    data = response.json()
    
    print(f"Status Code: {response.status_code}")
    print(f"Transcript: {transcript}")
    print(f"\nResponse:")
    print(data.get("message", "No message"))
    
    return response.status_code == 200


def test_memory_creation(
    transcript: str,
    memory_id: str,
    test_name: str
):
    """Test memory creation webhook"""
    print_test(test_name)
    
    payload = {
        "memory_id": memory_id,
        "transcript": transcript,
        "summary": f"Test summary for {memory_id}",
        "created_at": "2025-11-01T12:00:00Z"
    }
    
    response = requests.post(
        MEMORY_URL,
        headers={"Content-Type": "application/json"},
        json=payload
    )
    
    data = response.json()
    
    print(f"Status Code: {response.status_code}")
    print(f"Memory ID: {memory_id}")
    print(f"Detected Concepts: {data.get('detected_concepts', [])}")
    
    if data.get("annotation"):
        print(f"\nAnnotation Preview:")
        print(data["annotation"][:200] + "...")
    
    return response.status_code == 200


def run_all_tests():
    """Run all integration tests"""
    print_header("Satomi OMI Integration Tests (Python)")
    
    print(f"Webhook URL: {WEBHOOK_URL}")
    print(f"Memory URL: {MEMORY_URL}")
    
    results = []
    
    # Test 1: Health check
    results.append(("Health Check", test_webhook_health()))
    
    # Test 2-6: Concept queries
    concept_tests = [
        ("What is ikigai?", "Ikigai Query"),
        ("Explain wabi-sabi", "Wabi-Sabi Query"),
        ("Tell me about kaizen", "Kaizen Query"),
        ("What does mono no aware mean?", "Mono no Aware Query"),
        ("Define kintsugi", "Kintsugi Query"),
    ]
    
    for transcript, name in concept_tests:
        results.append((name, test_concept_query(transcript, name)))
    
    # Test 7: Non-concept query
    results.append((
        "Non-Concept Query",
        test_concept_query("What is the weather today?", "Non-Concept")
    ))
    
    # Test 8: Empty transcript
    results.append((
        "Empty Transcript",
        test_concept_query("", "Empty")
    ))
    
    # Test 9-11: Memory creation
    memory_tests = [
        (
            "Today I learned about ikigai and its meaning",
            "mem_python_1",
            "Memory with Ikigai"
        ),
        (
            "We discussed wabi-sabi, kaizen, and kintsugi",
            "mem_python_2",
            "Memory with Multiple Concepts"
        ),
        (
            "Just a regular conversation",
            "mem_python_3",
            "Memory without Concepts"
        ),
    ]
    
    for transcript, memory_id, name in memory_tests:
        results.append((
            name,
            test_memory_creation(transcript, memory_id, name)
        ))
    
    # Summary
    print_header("Test Results Summary")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed. Check configuration and logs.")


class OMIClient:
    """
    Client class for interacting with Satomi's OMI integration
    """
    
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.webhook_url = f"{base_url}/api/omi/webhook"
        self.memory_url = f"{base_url}/api/omi/memory"
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def ask_concept(self, transcript: str, session_id: str = "default") -> Dict[str, Any]:
        """
        Ask about a Japanese concept
        
        Args:
            transcript: User's question or statement
            session_id: Conversation session ID
            
        Returns:
            Response from Satomi
        """
        payload = {
            "transcript": transcript,
            "session_id": session_id,
            "user_id": "api_user"
        }
        
        response = self.session.post(self.webhook_url, json=payload)
        return response.json()
    
    def create_memory_annotation(
        self,
        transcript: str,
        memory_id: str,
        summary: str = ""
    ) -> Dict[str, Any]:
        """
        Create memory annotation with concept detection
        
        Args:
            transcript: Full conversation transcript
            memory_id: Unique memory identifier
            summary: Optional conversation summary
            
        Returns:
            Memory annotation response
        """
        payload = {
            "memory_id": memory_id,
            "transcript": transcript,
            "summary": summary,
            "created_at": "2025-11-01T12:00:00Z"
        }
        
        response = self.session.post(self.memory_url, json=payload)
        return response.json()
    
    def health_check(self) -> Dict[str, Any]:
        """Check webhook health status"""
        response = self.session.get(self.webhook_url)
        return response.json()


def demo_client_usage():
    """Demonstrate OMIClient usage"""
    print_header("OMIClient Demo")
    
    client = OMIClient()
    
    # Example 1: Ask about ikigai
    print(">>> Asking about ikigai...")
    response = client.ask_concept("What is ikigai?")
    print(response.get("message", "No response")[:200] + "...\n")
    
    # Example 2: Create memory
    print(">>> Creating memory with concept detection...")
    memory_response = client.create_memory_annotation(
        transcript="We talked about wabi-sabi and kaizen today",
        memory_id="demo_mem_123",
        summary="Japanese concepts discussion"
    )
    print(f"Detected concepts: {memory_response.get('detected_concepts', [])}\n")
    
    # Example 3: Health check
    print(">>> Health check...")
    health = client.health_check()
    print(f"Status: {health.get('status', 'unknown')}")
    print(f"Service: {health.get('service', 'N/A')}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "demo":
        demo_client_usage()
    else:
        run_all_tests()

