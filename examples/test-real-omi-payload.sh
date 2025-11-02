#!/bin/bash

# Test with REAL OMI payload structure
# Based on actual data from webhook.site

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

WEBHOOK_URL="${1:-http://localhost:3000/api/omi/webhook}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Testing Real OMI Payload Structure${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Test 1: Real OMI payload from webhook.site
echo -e "${GREEN}Test 1: Real OMI Payload (Campaign example)${NC}"
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "RYEXvYutQeb3OwmmEsYDgiafmd02",
    "segments": [
      {
        "id": "dea44e71-2db6-4bf5-b357-09044ba80490",
        "text": "this ones idea is to, like, do a campaign around the campus.",
        "speaker": "SPEAKER_0",
        "speaker_id": 0,
        "is_user": true,
        "person_id": null,
        "start": 239.52999999999997,
        "end": 306.4134374999999,
        "translations": [],
        "speech_profile_processed": true
      }
    ]
  }' | jq '.'
echo -e "\n"

# Test 2: Real OMI payload asking about Japanese concept
echo -e "${GREEN}Test 2: Real OMI Payload (Ikigai query)${NC}"
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_session_ikigai",
    "segments": [
      {
        "id": "seg_001",
        "text": "What is ikigai?",
        "speaker": "SPEAKER_0",
        "speaker_id": 0,
        "is_user": true,
        "person_id": null,
        "start": 0.0,
        "end": 2.5,
        "translations": [],
        "speech_profile_processed": true
      }
    ]
  }' | jq '.'
echo -e "\n"

# Test 3: Multiple segments (conversation)
echo -e "${GREEN}Test 3: Multiple Segments (Wabi-sabi conversation)${NC}"
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_multi_segment",
    "segments": [
      {
        "id": "seg_001",
        "text": "Can you",
        "speaker": "SPEAKER_0",
        "speaker_id": 0,
        "is_user": true,
        "person_id": null,
        "start": 0.0,
        "end": 1.0,
        "translations": [],
        "speech_profile_processed": true
      },
      {
        "id": "seg_002",
        "text": "explain wabi-sabi",
        "speaker": "SPEAKER_0",
        "speaker_id": 0,
        "is_user": true,
        "person_id": null,
        "start": 1.0,
        "end": 3.5,
        "translations": [],
        "speech_profile_processed": true
      },
      {
        "id": "seg_003",
        "text": "to me?",
        "speaker": "SPEAKER_0",
        "speaker_id": 0,
        "is_user": true,
        "person_id": null,
        "start": 3.5,
        "end": 4.2,
        "translations": [],
        "speech_profile_processed": true
      }
    ]
  }' | jq '.'
echo -e "\n"

# Test 4: Kaizen concept
echo -e "${GREEN}Test 4: Real OMI Payload (Kaizen query)${NC}"
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_kaizen",
    "segments": [
      {
        "id": "seg_kaizen",
        "text": "Tell me about kaizen and how to apply it",
        "speaker": "SPEAKER_0",
        "speaker_id": 0,
        "is_user": true,
        "person_id": null,
        "start": 10.0,
        "end": 15.5,
        "translations": [],
        "speech_profile_processed": true
      }
    ]
  }' | jq '.'
echo -e "\n"

# Test 5: Non-concept query (should show help)
echo -e "${GREEN}Test 5: Non-Concept Query${NC}"
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_non_concept",
    "segments": [
      {
        "id": "seg_weather",
        "text": "What is the weather today?",
        "speaker": "SPEAKER_0",
        "speaker_id": 0,
        "is_user": true,
        "person_id": null,
        "start": 0.0,
        "end": 2.0,
        "translations": [],
        "speech_profile_processed": true
      }
    ]
  }' | jq '.'
echo -e "\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}   Real OMI Payload Tests Complete!${NC}"
echo -e "${BLUE}========================================${NC}"

