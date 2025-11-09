#!/usr/bin/env python3
"""
Test script to diagnose Gemini API key issues
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

print("=" * 60)
print("Gemini API Key Diagnostic Tool")
print("=" * 60)

if not API_KEY:
    print("❌ ERROR: GEMINI_API_KEY not found in .env file")
    exit(1)

print(f"✓ API Key found: {API_KEY[:10]}...{API_KEY[-4:]}")
print()

# Configure API
genai.configure(api_key=API_KEY)

# Test 1: List available models
print("Test 1: Listing available models...")
try:
    models = genai.list_models()
    print("✓ Available models:")
    for model in models:
        if 'gemini' in model.name.lower():
            print(f"  - {model.name}")
    print()
except Exception as e:
    print(f"❌ Error listing models: {e}")
    print()

# Test 2: Try generating content with gemini-1.5-flash
print("Test 2: Testing gemini-1.5-flash...")
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say 'API is working!'")
    print(f"✓ Response: {response.text}")
    print()
except Exception as e:
    print(f"❌ Error with gemini-1.5-flash: {e}")
    print()

# Test 3: Try generating content with gemini-pro (fallback)
print("Test 3: Testing gemini-pro...")
try:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say 'API is working!'")
    print(f"✓ Response: {response.text}")
    print()
except Exception as e:
    print(f"❌ Error with gemini-pro: {e}")
    print()

print("=" * 60)
print("Diagnostic complete!")
print()
print("If all tests failed, your API key may have restrictions.")
print("Solutions:")
print("1. Create a new API key at: https://aistudio.google.com/apikey")
print("2. Ensure you're using a key from Google AI Studio (not Google Cloud)")
print("3. Check if there are any API restrictions in your Google account")
print("=" * 60)
