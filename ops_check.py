#!/usr/bin/env python3
import os
import subprocess
import sys
import urllib.request
import urllib.error
import json

def ensure_logs_dir():
    logs_dir = r'C:\workspace\user-admin-app\logs'
    os.makedirs(logs_dir, exist_ok=True)
    print(f"✓ Logs directory ensured: {logs_dir}")
    return True

def check_ports():
    print("\n=== Port Listeners ===")
    result = subprocess.run(['netstat', '-ano'], capture_output=True, text=True)
    
    port_8080_pid = None
    port_3000_pid = None
    
    for line in result.stdout.split('\n'):
        if ':8080' in line and 'LISTENING' in line:
            parts = line.split()
            port_8080_pid = parts[-1]
            print(f"Port 8080: LISTENING - PID {port_8080_pid}")
        elif ':3000' in line and 'LISTENING' in line:
            parts = line.split()
            port_3000_pid = parts[-1]
            print(f"Port 3000: LISTENING - PID {port_3000_pid}")
    
    if not port_8080_pid:
        print("Port 8080: NOT LISTENING")
    if not port_3000_pid:
        print("Port 3000: NOT LISTENING")
    
    return port_8080_pid, port_3000_pid

def test_url(url, name):
    print(f"\n=== Testing {name}: {url} ===")
    try:
        req = urllib.request.Request(url, method='GET')
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.status
            body = response.read(200).decode('utf-8', errors='ignore')
            print(f"Status: {status}")
            print(f"Body snippet: {body[:100]}")
            return status, body[:100], True
    except urllib.error.HTTPError as e:
        print(f"Status: {e.code}")
        body = e.read(200).decode('utf-8', errors='ignore')
        print(f"Body snippet: {body[:100]}")
        return e.code, body[:100], True
    except Exception as e:
        print(f"Error: {e}")
        return None, str(e), False

def main():
    # Step 1
    ensure_logs_dir()
    
    # Step 2
    pid_8080, pid_3000 = check_ports()
    
    # Step 3
    status_8080, body_8080, backend_responding = test_url('http://localhost:8080/api/users', 'Backend')
    status_3000, body_3000, frontend_responding = test_url('http://localhost:3000', 'Frontend')
    
    # Determine if services need to be started
    print("\n=== Service Status ===")
    
    backend_expected = backend_responding and status_8080 in [200, 401, 403, 404]
    if backend_expected:
        print(f"✓ Backend is responding as expected (status {status_8080}) - NO START NEEDED")
    elif pid_8080:
        print(f"⚠ Port 8080 is in use by PID {pid_8080} but not responding as expected - WARNING")
    else:
        print("Backend needs to be started")
    
    frontend_expected = frontend_responding
    if frontend_expected:
        print(f"✓ Frontend is responding (status {status_3000}) - NO START NEEDED")
    elif pid_3000:
        print(f"⚠ Port 3000 is in use by PID {pid_3000} but not responding as expected - WARNING")
    else:
        print("Frontend needs to be started")
    
    print("\n=== Summary ===")
    print(f"Port 8080 PID: {pid_8080 or 'None'}")
    print(f"Port 3000 PID: {pid_3000 or 'None'}")
    print(f"Backend status: {status_8080 or 'No response'}")
    print(f"Frontend status: {status_3000 or 'No response'}")
    print(f"Backend needs start: {not backend_expected and not pid_8080}")
    print(f"Frontend needs start: {not frontend_expected and not pid_3000}")

if __name__ == '__main__':
    main()
