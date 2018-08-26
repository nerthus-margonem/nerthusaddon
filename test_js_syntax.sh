#/bin/bash
RESULT=0
JS_FILES=`find -name "*.js" -not -path "./node_modules/*"`
for FILE in $JS_FILES
do
    if ! js --check $FILE  ; then
        RESULT=1
    fi
done
exit $RESULT
