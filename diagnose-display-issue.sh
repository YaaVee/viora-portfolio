#!/bin/bash

echo "========================================="
echo "🔍 DIAGNOSING DISPLAY ISSUE"
echo "========================================="

# Check if content-area div exists
echo "Checking for content-area div:"
grep -n '<div id="content-area"' index.html

# Check showPage function
echo -e "\nChecking showPage function (first 20 lines):"
grep -A 20 "function showPage" index.html

# Check for JavaScript errors in the console
echo -e "\n📋 TO CHECK IN BROWSER:"
echo "1. Open index.html in Firefox/Chrome"
echo "2. Press F12 to open Developer Tools"
echo "3. Click on 'Console' tab"
echo "4. Look for RED error messages"
echo "5. Take a screenshot of any errors"

# Check if any page content is actually in the HTML
echo -e "\nChecking if page content exists in HTML source:"
echo "Services page content sample:"
sed -n '1770,1780p' index.html

echo -e "\n✅ Diagnosis complete - check browser console for real errors"
