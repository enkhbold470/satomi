#!/bin/bash

# OMI Webhook Testing Script
# Tests Satomi's OMI integration endpoints

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set your webhook URL (update after deployment)
WEBHOOK_URL="${1:-http://localhost:3000/api/omi/webhook}"
MEMORY_URL="${2:-http://localhost:3000/api/omi/memory}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Satomi OMI Integration Tests${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${BLUE}Webhook URL: ${NC}$WEBHOOK_URL"
echo -e "${BLUE}Memory URL: ${NC}$MEMORY_URL\n"

# Test 1: GET request (health check)
echo -e "${GREEN}Test 1: Health Check (GET)${NC}"
curl -s -X GET "$WEBHOOK_URL" | jq '.'
echo -e "\n"

# Test 2: Basic Japanese concept query
echo -e "${GREEN}Test 2: Basic Concept Query - Ikigai${NC}"
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "What is ikigai?",
    "session_id": "test_session_1",
    "user_id": "test_user_1"
  }' | jq '.'
echo -e "\n"

# Test 3: Another concept query
echo -e "${GREEN}Test 3: Concept Query - Wabi-Sabi${NC}"
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Explain wabi-sabi",
    "session_id": "test_session_2",
    "user_id": "test_user_1"
  }' | jq '.'
echo -e "\n"

# Test 4: Kaizen concept
echo -e "${GREEN}Test 4: Concept Query - Kaizen${NC}"
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Tell me about kaizen",
    "session_id": "test_session_3",
    "user_id": "test_user_1"
  }' | jq '.'
echo -e "\n"

# Test 5: Non-concept query (should show help message)
echo -e "${GREEN}Test 5: Non-Concept Query${NC}"
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "What is the weather today?",
    "session_id": "test_session_4",
    "user_id": "test_user_1"
  }' | jq '.'
echo -e "\n"

# Test 6: Empty transcript
echo -e "${GREEN}Test 6: Empty Transcript${NC}"
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "",
    "session_id": "test_session_5",
    "user_id": "test_user_1"
  }' | jq '.'
echo -e "\n"

# Test 7: Memory creation webhook
echo -e "${GREEN}Test 7: Memory Creation (Ikigai mentioned)${NC}"
curl -s -X POST "$MEMORY_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "memory_id": "mem_test_123",
    "transcript": "Today I learned about ikigai and how it relates to finding purpose in life",
    "summary": "Discussion about Japanese philosophy",
    "created_at": "2025-11-01T12:00:00Z"
  }' | jq '.'
echo -e "\n"

# Test 8: Memory with multiple concepts
echo -e "${GREEN}Test 8: Memory Creation (Multiple concepts)${NC}"
curl -s -X POST "$MEMORY_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "memory_id": "mem_test_456",
    "transcript": "We talked about wabi-sabi, kaizen, and kintsugi as examples of Japanese wisdom",
    "summary": "Overview of Japanese concepts",
    "created_at": "2025-11-01T13:00:00Z"
  }' | jq '.'
echo -e "\n"

# Test 9: Memory with no concepts
echo -e "${GREEN}Test 9: Memory Creation (No concepts)${NC}"
curl -s -X POST "$MEMORY_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "memory_id": "mem_test_789",
    "transcript": "Just a regular conversation about daily activities",
    "summary": "General discussion",
    "created_at": "2025-11-01T14:00:00Z"
  }' | jq '.'
echo -e "\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}   All Tests Complete!${NC}"
echo -e "${BLUE}========================================${NC}"

