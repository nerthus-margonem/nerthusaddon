#!/bin/bash
PASS=0
FAIL=1
RED="\e[31m"
GREEN="\e[32m"
END="\e[0m"
RESULT=$PASS
JS_FILES=$(find . -name "*.js" -not -path "./node_modules/*")

for FILE in $JS_FILES; do
  if ! node --check "$FILE"; then
    echo -e "$RED" file "$FILE" syntax check FAIL! "$END"
    RESULT=$FAIL
  else
    echo -e "$GREEN" file "$FILE" syntax check PASS! "$END"
  fi
done

exit $RESULT
