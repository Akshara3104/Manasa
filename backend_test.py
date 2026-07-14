#!/usr/bin/env python3
"""
Backend API Test Suite for Manasa Dairy
Tests all backend endpoints as specified in test_result.md
"""

import requests
import json
from datetime import datetime, timedelta

# Base URL from environment
BASE_URL = "https://dairy-dashboard-22.preview.emergentagent.com/api"

# Admin credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "manasa2025"

# Global variables to store test data
auth_token = None
created_batch_id = None
expired_batch_id = None

def print_test_result(test_name, passed, details=""):
    """Print formatted test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {test_name}")
    if details:
        print(f"   Details: {details}")

def test_health_endpoint():
    """Test 1: GET /api/health"""
    print("\n" + "="*80)
    print("TEST 1: Health Endpoint")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("ok") == True and
            data.get("service") == "Manasa Dairy API"
        )
        
        print_test_result(
            "GET /api/health",
            passed,
            f"Status: {response.status_code}, Response: {data}"
        )
        return passed
    except Exception as e:
        print_test_result("GET /api/health", False, f"Exception: {str(e)}")
        return False

def test_admin_login_success():
    """Test 2a: POST /api/admin/login with correct credentials"""
    global auth_token
    
    print("\n" + "="*80)
    print("TEST 2a: Admin Login - Success Case")
    print("="*80)
    
    try:
        payload = {
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        }
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("success") == True and
            "token" in data
        )
        
        if passed:
            auth_token = data["token"]
            print_test_result(
                "POST /api/admin/login (correct credentials)",
                True,
                f"Token received: {auth_token[:20]}..."
            )
        else:
            print_test_result(
                "POST /api/admin/login (correct credentials)",
                False,
                f"Status: {response.status_code}, Response: {data}"
            )
        
        return passed
    except Exception as e:
        print_test_result("POST /api/admin/login (correct credentials)", False, f"Exception: {str(e)}")
        return False

def test_admin_login_failure():
    """Test 2b: POST /api/admin/login with wrong credentials"""
    print("\n" + "="*80)
    print("TEST 2b: Admin Login - Failure Case")
    print("="*80)
    
    try:
        payload = {
            "username": ADMIN_USERNAME,
            "password": "wrong_password"
        }
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 401 and
            data.get("success") == False
        )
        
        print_test_result(
            "POST /api/admin/login (wrong credentials)",
            passed,
            f"Status: {response.status_code}, Response: {data}"
        )
        return passed
    except Exception as e:
        print_test_result("POST /api/admin/login (wrong credentials)", False, f"Exception: {str(e)}")
        return False

def test_create_batch_without_auth():
    """Test 3a: POST /api/batches without auth header"""
    print("\n" + "="*80)
    print("TEST 3a: Create Batch - Without Auth")
    print("="*80)
    
    try:
        payload = {
            "productName": "Test Product",
            "manufacturingDate": "2026-06-01",
            "expiryDate": "2027-06-01",
            "manufacturingLocation": "Test Location",
            "quantity": "100 units"
        }
        response = requests.post(f"{BASE_URL}/batches", json=payload, timeout=10)
        data = response.json()
        
        passed = response.status_code == 401
        
        print_test_result(
            "POST /api/batches (no auth)",
            passed,
            f"Status: {response.status_code}, Response: {data}"
        )
        return passed
    except Exception as e:
        print_test_result("POST /api/batches (no auth)", False, f"Exception: {str(e)}")
        return False

def test_create_batch_with_auth():
    """Test 3b: POST /api/batches with auth and valid data"""
    global created_batch_id
    
    print("\n" + "="*80)
    print("TEST 3b: Create Batch - With Auth and Valid Data")
    print("="*80)
    
    if not auth_token:
        print_test_result("POST /api/batches (with auth)", False, "No auth token available")
        return False
    
    try:
        payload = {
            "productName": "Toned Milk 1L",
            "manufacturingDate": "2026-06-01",
            "expiryDate": "2027-06-01",
            "manufacturingLocation": "Manasa Dairy Plant, AP",
            "quantity": "500 units",
            "notes": "test batch"
        }
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{BASE_URL}/batches", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("success") == True and
            "batch" in data and
            "id" in data["batch"] and
            "batchNumber" in data["batch"] and
            data["batch"]["batchNumber"].startswith("MD-") and
            "qrDataUrl" in data["batch"] and
            data["batch"]["qrDataUrl"].startswith("data:image/png;base64,") and
            "verifyUrl" in data["batch"]
        )
        
        if passed:
            created_batch_id = data["batch"]["id"]
            print_test_result(
                "POST /api/batches (with auth)",
                True,
                f"Batch created: ID={created_batch_id}, BatchNumber={data['batch']['batchNumber']}"
            )
        else:
            print_test_result(
                "POST /api/batches (with auth)",
                False,
                f"Status: {response.status_code}, Response: {json.dumps(data, indent=2)}"
            )
        
        return passed
    except Exception as e:
        print_test_result("POST /api/batches (with auth)", False, f"Exception: {str(e)}")
        return False

def test_create_batch_missing_fields():
    """Test 3c: POST /api/batches with missing required fields"""
    print("\n" + "="*80)
    print("TEST 3c: Create Batch - Missing Required Fields")
    print("="*80)
    
    if not auth_token:
        print_test_result("POST /api/batches (missing fields)", False, "No auth token available")
        return False
    
    try:
        payload = {
            "productName": "Test Product"
            # Missing manufacturingDate, expiryDate, manufacturingLocation
        }
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{BASE_URL}/batches", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        passed = response.status_code == 400
        
        print_test_result(
            "POST /api/batches (missing fields)",
            passed,
            f"Status: {response.status_code}, Response: {data}"
        )
        return passed
    except Exception as e:
        print_test_result("POST /api/batches (missing fields)", False, f"Exception: {str(e)}")
        return False

def test_list_batches_without_auth():
    """Test 4a: GET /api/batches without auth"""
    print("\n" + "="*80)
    print("TEST 4a: List Batches - Without Auth")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/batches", timeout=10)
        data = response.json()
        
        passed = response.status_code == 401
        
        print_test_result(
            "GET /api/batches (no auth)",
            passed,
            f"Status: {response.status_code}, Response: {data}"
        )
        return passed
    except Exception as e:
        print_test_result("GET /api/batches (no auth)", False, f"Exception: {str(e)}")
        return False

def test_list_batches_with_auth():
    """Test 4b: GET /api/batches with auth"""
    print("\n" + "="*80)
    print("TEST 4b: List Batches - With Auth")
    print("="*80)
    
    if not auth_token:
        print_test_result("GET /api/batches (with auth)", False, "No auth token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/batches", headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            "batches" in data and
            isinstance(data["batches"], list)
        )
        
        # Check if our created batch is in the list
        if passed and created_batch_id:
            batch_found = any(b.get("id") == created_batch_id for b in data["batches"])
            if batch_found:
                print_test_result(
                    "GET /api/batches (with auth)",
                    True,
                    f"Found {len(data['batches'])} batches, including our test batch"
                )
            else:
                print_test_result(
                    "GET /api/batches (with auth)",
                    False,
                    f"Created batch {created_batch_id} not found in list"
                )
                passed = False
        else:
            print_test_result(
                "GET /api/batches (with auth)",
                passed,
                f"Status: {response.status_code}, Found {len(data.get('batches', []))} batches"
            )
        
        return passed
    except Exception as e:
        print_test_result("GET /api/batches (with auth)", False, f"Exception: {str(e)}")
        return False

def test_verify_valid_batch():
    """Test 5a: GET /api/verify/{id} with valid batch ID"""
    print("\n" + "="*80)
    print("TEST 5a: Verify Batch - Valid ID")
    print("="*80)
    
    if not created_batch_id:
        print_test_result("GET /api/verify/{id} (valid)", False, "No batch ID available")
        return False
    
    try:
        response = requests.get(f"{BASE_URL}/verify/{created_batch_id}", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("found") == True and
            data.get("authentic") == True and
            data.get("expired") == False and
            "batch" in data and
            data["batch"].get("productName") == "Toned Milk 1L" and
            data["batch"].get("batchNumber", "").startswith("MD-") and
            "manufacturingDate" in data["batch"] and
            "manufacturingLocation" in data["batch"] and
            "expiryDate" in data["batch"]
        )
        
        print_test_result(
            "GET /api/verify/{id} (valid)",
            passed,
            f"Status: {response.status_code}, Found: {data.get('found')}, Authentic: {data.get('authentic')}, Expired: {data.get('expired')}"
        )
        return passed
    except Exception as e:
        print_test_result("GET /api/verify/{id} (valid)", False, f"Exception: {str(e)}")
        return False

def test_verify_nonexistent_batch():
    """Test 5b: GET /api/verify/{id} with nonexistent ID"""
    print("\n" + "="*80)
    print("TEST 5b: Verify Batch - Nonexistent ID")
    print("="*80)
    
    try:
        fake_id = "nonexistent-fake-id-12345"
        response = requests.get(f"{BASE_URL}/verify/{fake_id}", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 404 and
            data.get("found") == False and
            data.get("authentic") == False and
            "error" in data
        )
        
        print_test_result(
            "GET /api/verify/{id} (nonexistent)",
            passed,
            f"Status: {response.status_code}, Response: {data}"
        )
        return passed
    except Exception as e:
        print_test_result("GET /api/verify/{id} (nonexistent)", False, f"Exception: {str(e)}")
        return False

def test_verify_expired_batch():
    """Test 6: Create expired batch and verify it returns expired=true, authentic=false"""
    global expired_batch_id
    
    print("\n" + "="*80)
    print("TEST 6: Verify Expired Batch")
    print("="*80)
    
    if not auth_token:
        print_test_result("Expired batch verification", False, "No auth token available")
        return False
    
    try:
        # Create a batch with expiry date in the past
        payload = {
            "productName": "Expired Milk",
            "manufacturingDate": "2020-01-01",
            "expiryDate": "2020-01-15",
            "manufacturingLocation": "Test Location",
            "quantity": "100 units",
            "notes": "expired test batch"
        }
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{BASE_URL}/batches", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        if response.status_code != 200 or not data.get("success"):
            print_test_result("Expired batch verification", False, "Failed to create expired batch")
            return False
        
        expired_batch_id = data["batch"]["id"]
        
        # Now verify the expired batch
        verify_response = requests.get(f"{BASE_URL}/verify/{expired_batch_id}", timeout=10)
        verify_data = verify_response.json()
        
        passed = (
            verify_response.status_code == 200 and
            verify_data.get("found") == True and
            verify_data.get("authentic") == False and
            verify_data.get("expired") == True
        )
        
        print_test_result(
            "Expired batch verification",
            passed,
            f"Status: {verify_response.status_code}, Found: {verify_data.get('found')}, Authentic: {verify_data.get('authentic')}, Expired: {verify_data.get('expired')}"
        )
        return passed
    except Exception as e:
        print_test_result("Expired batch verification", False, f"Exception: {str(e)}")
        return False

def test_delete_batch_without_auth():
    """Test 7a: DELETE /api/batches/{id} without auth"""
    print("\n" + "="*80)
    print("TEST 7a: Delete Batch - Without Auth")
    print("="*80)
    
    if not created_batch_id:
        print_test_result("DELETE /api/batches/{id} (no auth)", False, "No batch ID available")
        return False
    
    try:
        response = requests.delete(f"{BASE_URL}/batches/{created_batch_id}", timeout=10)
        data = response.json()
        
        passed = response.status_code == 401
        
        print_test_result(
            "DELETE /api/batches/{id} (no auth)",
            passed,
            f"Status: {response.status_code}, Response: {data}"
        )
        return passed
    except Exception as e:
        print_test_result("DELETE /api/batches/{id} (no auth)", False, f"Exception: {str(e)}")
        return False

def test_delete_batch_with_auth():
    """Test 7b: DELETE /api/batches/{id} with auth, then verify it's gone"""
    print("\n" + "="*80)
    print("TEST 7b: Delete Batch - With Auth and Verify Deletion")
    print("="*80)
    
    if not auth_token or not created_batch_id:
        print_test_result("DELETE /api/batches/{id} (with auth)", False, "No auth token or batch ID available")
        return False
    
    try:
        # Delete the batch
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.delete(f"{BASE_URL}/batches/{created_batch_id}", headers=headers, timeout=10)
        data = response.json()
        
        delete_passed = (
            response.status_code == 200 and
            data.get("success") == True
        )
        
        if not delete_passed:
            print_test_result(
                "DELETE /api/batches/{id} (with auth)",
                False,
                f"Delete failed - Status: {response.status_code}, Response: {data}"
            )
            return False
        
        # Verify the batch is gone
        verify_response = requests.get(f"{BASE_URL}/verify/{created_batch_id}", timeout=10)
        verify_data = verify_response.json()
        
        verify_passed = (
            verify_response.status_code == 404 and
            verify_data.get("found") == False and
            verify_data.get("authentic") == False
        )
        
        passed = delete_passed and verify_passed
        
        print_test_result(
            "DELETE /api/batches/{id} (with auth)",
            passed,
            f"Delete status: {response.status_code}, Verify after delete: {verify_response.status_code} (should be 404)"
        )
        return passed
    except Exception as e:
        print_test_result("DELETE /api/batches/{id} (with auth)", False, f"Exception: {str(e)}")
        return False

def test_contact_form_valid():
    """Test 8a: POST /api/contact with valid data"""
    print("\n" + "="*80)
    print("TEST 8a: Contact Form - Valid Data")
    print("="*80)
    
    try:
        payload = {
            "name": "Rajesh Kumar",
            "email": "rajesh@example.com",
            "phone": "9876543210",
            "message": "I would like to know more about your dairy products."
        }
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("success") == True
        )
        
        print_test_result(
            "POST /api/contact (valid data)",
            passed,
            f"Status: {response.status_code}, Response: {data}"
        )
        return passed
    except Exception as e:
        print_test_result("POST /api/contact (valid data)", False, f"Exception: {str(e)}")
        return False

def test_contact_form_missing_fields():
    """Test 8b: POST /api/contact with missing required fields"""
    print("\n" + "="*80)
    print("TEST 8b: Contact Form - Missing Required Fields")
    print("="*80)
    
    try:
        payload = {
            "name": "Rajesh Kumar"
            # Missing message field
        }
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = response.json()
        
        passed = response.status_code == 400
        
        print_test_result(
            "POST /api/contact (missing fields)",
            passed,
            f"Status: {response.status_code}, Response: {data}"
        )
        return passed
    except Exception as e:
        print_test_result("POST /api/contact (missing fields)", False, f"Exception: {str(e)}")
        return False

def run_all_tests():
    """Run all backend tests in sequence"""
    print("\n" + "="*80)
    print("MANASA DAIRY BACKEND API TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = []
    
    # Test 1: Health endpoint
    results.append(("Health Endpoint", test_health_endpoint()))
    
    # Test 2: Admin login
    results.append(("Admin Login - Success", test_admin_login_success()))
    results.append(("Admin Login - Failure", test_admin_login_failure()))
    
    # Test 3: Create batch
    results.append(("Create Batch - No Auth", test_create_batch_without_auth()))
    results.append(("Create Batch - With Auth", test_create_batch_with_auth()))
    results.append(("Create Batch - Missing Fields", test_create_batch_missing_fields()))
    
    # Test 4: List batches
    results.append(("List Batches - No Auth", test_list_batches_without_auth()))
    results.append(("List Batches - With Auth", test_list_batches_with_auth()))
    
    # Test 5: Verify batch
    results.append(("Verify Valid Batch", test_verify_valid_batch()))
    results.append(("Verify Nonexistent Batch", test_verify_nonexistent_batch()))
    
    # Test 6: Expired batch
    results.append(("Verify Expired Batch", test_verify_expired_batch()))
    
    # Test 7: Delete batch
    results.append(("Delete Batch - No Auth", test_delete_batch_without_auth()))
    results.append(("Delete Batch - With Auth", test_delete_batch_with_auth()))
    
    # Test 8: Contact form
    results.append(("Contact Form - Valid", test_contact_form_valid()))
    results.append(("Contact Form - Missing Fields", test_contact_form_missing_fields()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print("\n" + "="*80)
    print(f"TOTAL: {passed_count}/{total_count} tests passed ({passed_count*100//total_count}%)")
    print("="*80)
    
    return passed_count == total_count

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)
