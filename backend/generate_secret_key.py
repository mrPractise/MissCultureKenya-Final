#!/usr/bin/env python
"""
Generate a secure secret key for Django deployment
Run: python generate_secret_key.py
"""
import secrets

secret_key = secrets.token_urlsafe(50)
print("\n" + "="*60)
print("Generated Django Secret Key:")
print("="*60)
print(secret_key)
print("="*60)
print("\nCopy this and use it as SECRET_KEY in your deployment platform.")
print("="*60 + "\n")


