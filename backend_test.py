#!/usr/bin/env python3
"""
Backend API Test Suite for Manasa Dairy
Tests the SIMPLIFIED batch API (dates removed)
"""

import requests
import json
import sys

BASE_URL = "https://dairy-dashboard-22.preview.emergentagent.com/api"

def print_test(name, passed, details=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"   {details}")
    print()

def test_admin_login():
    """Test 1: Admin login with correct and wrong credentials"""
    print("=" * 60)
    print("TEST 1: Admin Login")
    print("=" * 60)
    
    # Test correct credentials
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": "admin", "password": "manasa2025"},
            timeout=10
        )
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("success") == True and
            "token" in data
        )
        print_test(
            "Login with correct credentials",
            passed,
            f"Status: {response.status_code}, Response: {json.dumps(data, indent=2)}"
        )
        
        if not passed:
            return None
        
        token = data.get("token")
        
    except Exception as e:
        print_test("Login with correct credentials", False, f"Error: {str(e)}")
        return None
    
    # Test wrong credentials
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": "admin", "password": "wrongpassword"},
            timeout=10
        )
        data = response.json()
        
        passed = response.status_code == 401
        print_test(
            "Login with wrong credentials",
            passed,
            f"Status: {response.status_code}, Response: {json.dumps(data, indent=2)}"
        )
        
    except Exception as e:
        print_test("Login with wrong credentials", False, f"Error: {str(e)}")
    
    return token

def test_create_batch(token):
    """Test 2: Create batch - only requires productName + manufacturingLocation"""
    print("=" * 60)
    print("TEST 2: Create Batch (Simplified - No Dates)")
    print("=" * 60)
    
    # Test without auth
    try:
        response = requests.post(
            f"{BASE_URL}/batches",
            json={
                "productName": "Toned Milk 1L",
                "manufacturingLocation": "Manasa Dairy Plant, Andhra Pradesh",
                "quantity": "500 units"
            },
            timeout=10
        )
        
        passed = response.status_code == 401
        print_test(
            "Create batch without auth",
            passed,
            f"Status: {response.status_code}"
        )
        
    except Exception as e:
        print_test("Create batch without auth", False, f"Error: {str(e)}")
    
    # Test with auth - valid data
    try:
        response = requests.post(
            f"{BASE_URL}/batches",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "productName": "Toned Milk 1L",
                "manufacturingLocation": "Manasa Dairy Plant, Andhra Pradesh",
                "quantity": "500 units"
            },
            timeout=10
        )
        data = response.json()
        
        batch = data.get("batch", {})
        batch_id = batch.get("id")
        
        # Check response structure
        has_required_fields = (
            "id" in batch and
            "batchNumber" in batch and
            "productName" in batch and
            "manufacturingLocation" in batch and
            "qrDataUrl" in batch and
            "verifyUrl" in batch
        )
        
        # Check NO date fields
        has_no_date_fields = (
            "manufacturingDate" not in batch and
            "expiryDate" not in batch
        )
        
        # Check batchNumber format (MD-YYYYMMDD-XXXX)
        batch_number = batch.get("batchNumber", "")
        correct_format = batch_number.startswith("MD-") and len(batch_number.split("-")) == 3
        
        # Check QR data URL format
        qr_data = batch.get("qrDataUrl", "")
        correct_qr = qr_data.startswith("data:image/png;base64,")
        
        passed = (
            response.status_code == 200 and
            data.get("success") == True and
            has_required_fields and
            has_no_date_fields and
            correct_format and
            correct_qr
        )
        
        details = f"""Status: {response.status_code}
   Batch ID: {batch_id}
   Batch Number: {batch_number}
   Has required fields: {has_required_fields}
   NO date fields (manufacturingDate, expiryDate): {has_no_date_fields}
   Correct batchNumber format: {correct_format}
   QR starts with 'data:image/png;base64,': {correct_qr}
   Batch keys: {list(batch.keys())}"""
        
        print_test("Create batch with auth (simplified API)", passed, details)
        
        if not passed:
            print(f"Full response: {json.dumps(data, indent=2)}")
            return None
        
    except Exception as e:
        print_test("Create batch with auth", False, f"Error: {str(e)}")
        return None
    
    # Test missing required fields
    try:
        response = requests.post(
            f"{BASE_URL}/batches",
            headers={"Authorization": f"Bearer {token}"},
            json={"productName": "Toned Milk 1L"},  # Missing manufacturingLocation
            timeout=10
        )
        
        passed = response.status_code == 400
        print_test(
            "Create batch missing manufacturingLocation",
            passed,
            f"Status: {response.status_code}"
        )
        
    except Exception as e:
        print_test("Create batch missing field", False, f"Error: {str(e)}")
    
    return batch_id

def test_list_batches(token):
    """Test 3: List batches - should not have date fields"""
    print("=" * 60)
    print("TEST 3: List Batches")
    print("=" * 60)
    
    # Test without auth
    try:
        response = requests.get(f"{BASE_URL}/batches", timeout=10)
        passed = response.status_code == 401
        print_test("List batches without auth", passed, f"Status: {response.status_code}")
    except Exception as e:
        print_test("List batches without auth", False, f"Error: {str(e)}")
    
    # Test with auth
    try:
        response = requests.get(
            f"{BASE_URL}/batches",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        data = response.json()
        batches = data.get("batches", [])
        
        # Check that batches don't have date fields
        no_date_fields = True
        if batches:
            sample_batch = batches[0]
            no_date_fields = (
                "manufacturingDate" not in sample_batch and
                "expiryDate" not in sample_batch
            )
        
        passed = (
            response.status_code == 200 and
            isinstance(batches, list) and
            no_date_fields
        )
        
        details = f"""Status: {response.status_code}
   Number of batches: {len(batches)}
   NO date fields in batches: {no_date_fields}"""
        
        if batches:
            details += f"\n   Sample batch keys: {list(batches[0].keys())}"
        
        print_test("List batches with auth", passed, details)
        
    except Exception as e:
        print_test("List batches with auth", False, f"Error: {str(e)}")

def test_verify_batch(batch_id):
    """Test 4: Public verify - no 'expired' field"""
    print("=" * 60)
    print("TEST 4: Public Verify (No Expiry Check)")
    print("=" * 60)
    
    # Test existing batch
    try:
        response = requests.get(f"{BASE_URL}/verify/{batch_id}", timeout=10)
        data = response.json()
        batch = data.get("batch", {})
        
        # Check NO expired field in response
        no_expired_field = "expired" not in data
        
        # Check NO date fields in batch
        no_date_fields = (
            "manufacturingDate" not in batch and
            "expiryDate" not in batch
        )
        
        passed = (
            response.status_code == 200 and
            data.get("found") == True and
            data.get("authentic") == True and
            no_expired_field and
            no_date_fields
        )
        
        details = f"""Status: {response.status_code}
   Found: {data.get('found')}
   Authentic: {data.get('authentic')}
   NO 'expired' field in response: {no_expired_field}
   NO date fields in batch: {no_date_fields}
   Response keys: {list(data.keys())}
   Batch keys: {list(batch.keys())}"""
        
        print_test("Verify existing batch", passed, details)
        
    except Exception as e:
        print_test("Verify existing batch", False, f"Error: {str(e)}")
    
    # Test non-existent batch
    try:
        response = requests.get(f"{BASE_URL}/verify/nonexistent-id-12345", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 404 and
            data.get("found") == False and
            data.get("authentic") == False
        )
        
        print_test(
            "Verify non-existent batch",
            passed,
            f"Status: {response.status_code}, Response: {json.dumps(data, indent=2)}"
        )
        
    except Exception as e:
        print_test("Verify non-existent batch", False, f"Error: {str(e)}")

def test_delete_batch(token, batch_id):
    """Test 5: Delete batch and verify it's gone"""
    print("=" * 60)
    print("TEST 5: Delete Batch")
    print("=" * 60)
    
    # Test without auth
    try:
        response = requests.delete(f"{BASE_URL}/batches/{batch_id}", timeout=10)
        passed = response.status_code == 401
        print_test("Delete batch without auth", passed, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Delete batch without auth", False, f"Error: {str(e)}")
    
    # Test with auth
    try:
        response = requests.delete(
            f"{BASE_URL}/batches/{batch_id}",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("success") == True
        )
        
        print_test(
            "Delete batch with auth",
            passed,
            f"Status: {response.status_code}, Response: {json.dumps(data, indent=2)}"
        )
        
    except Exception as e:
        print_test("Delete batch with auth", False, f"Error: {str(e)}")
    
    # Verify batch is deleted
    try:
        response = requests.get(f"{BASE_URL}/verify/{batch_id}", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 404 and
            data.get("found") == False
        )
        
        print_test(
            "Verify deleted batch returns 404",
            passed,
            f"Status: {response.status_code}, Response: {json.dumps(data, indent=2)}"
        )
        
    except Exception as e:
        print_test("Verify deleted batch", False, f"Error: {str(e)}")

def test_contact_form():
    """Test 6: Contact form submission"""
    print("=" * 60)
    print("TEST 6: Contact Form")
    print("=" * 60)
    
    # Test valid submission
    try:
        response = requests.post(
            f"{BASE_URL}/contact",
            json={
                "name": "Rajesh Kumar",
                "email": "rajesh@example.com",
                "phone": "+91 9876543210",
                "message": "I would like to know more about your dairy products."
            },
            timeout=10
        )
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("success") == True
        )
        
        print_test(
            "Contact form valid submission",
            passed,
            f"Status: {response.status_code}, Response: {json.dumps(data, indent=2)}"
        )
        
    except Exception as e:
        print_test("Contact form valid submission", False, f"Error: {str(e)}")
    
    # Test missing required field
    try:
        response = requests.post(
            f"{BASE_URL}/contact",
            json={"name": "Test User"},  # Missing message
            timeout=10
        )
        
        passed = response.status_code == 400
        print_test(
            "Contact form missing message",
            passed,
            f"Status: {response.status_code}"
        )
        
    except Exception as e:
        print_test("Contact form missing field", False, f"Error: {str(e)}")

def main():
    print("\n" + "=" * 60)
    print("MANASA DAIRY BACKEND API TEST SUITE")
    print("SIMPLIFIED BATCH API (NO DATES)")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print("=" * 60 + "\n")
    
    # Test 1: Admin login
    token = test_admin_login()
    if not token:
        print("\n❌ CRITICAL: Admin login failed. Cannot proceed with authenticated tests.")
        sys.exit(1)
    
    # Test 2: Create batch
    batch_id = test_create_batch(token)
    if not batch_id:
        print("\n❌ CRITICAL: Batch creation failed. Cannot proceed with batch tests.")
        sys.exit(1)
    
    # Test 3: List batches
    test_list_batches(token)
    
    # Test 4: Verify batch
    test_verify_batch(batch_id)
    
    # Test 5: Delete batch
    test_delete_batch(token, batch_id)
    
    # Test 6: Contact form
    test_contact_form()
    
    print("\n" + "=" * 60)
    print("TEST SUITE COMPLETE")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    main()
