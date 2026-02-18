#!/bin/bash

echo "========================================="
echo "🔍 DIAGNOSING JAVASCRIPT SYNTAX ERROR"
echo "========================================="

# Check for unescaped backticks in template strings
echo "Checking for unescaped backticks in getHomePage:"
sed -n '/function getHomePage/,/^    \`;/p' index.html | grep -n "\`" | while read -r line; do
    if [[ $line == *"function"* ]] || [[ $line == *"return"* ]] || [[ $line == *"\`"* ]]; then
        # These are expected
        continue
    fi
    echo "⚠️  Possible unescaped backtick at line: $line"
done

# Check for missing closing braces
echo -e "\nChecking for missing closing braces:"
OPEN_BRACES=$(grep -o "{" index.html | wc -l)
CLOSE_BRACES=$(grep -o "}" index.html | wc -l)
echo "Open braces: $OPEN_BRACES, Close braces: $CLOSE_BRACES"
if [ $OPEN_BRACES -ne $CLOSE_BRACES ]; then
    echo "❌ MISMATCH: $((OPEN_BRACES - CLOSE_BRACES)) unclosed braces"
fi

# Check script tags
echo -e "\nChecking script tags:"
SCRIPT_STARTS=$(grep -c "<script" index.html)
SCRIPT_ENDS=$(grep -c "</script>" index.html)
echo "Script starts: $SCRIPT_STARTS, Script ends: $SCRIPT_ENDS"

echo -e "\n✅ Diagnosis complete"
