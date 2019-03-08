#/bin/bash
COMMAND=$@
PASSED=()
FAILED=()
JS_TEST_FILES=`find ./test -name "*.js"`
PASS=0
FAIL=1
RESULT=$PASS

BOLD="\e[1m"
RED="\e[31m"
GREEN="\e[32m"
END="\e[0m"

for FILE in $JS_TEST_FILES
do
    echo -e run command $COMMAND $FILE

    $COMMAND $FILE
    COMMAND_STATUS=$?

    if [ $COMMAND_STATUS -eq $PASS ] ; then
        PASSED+=($FILE)
    else
        FAILED+=("$FILE $COMMAND_STATUS")
    fi
done

if [ ${#PASSED[*]} -ne 0 ] ; then
    for INDEX in ${!PASSED[*]}
    do
        echo -e $BOLD $GREEN PASS ${PASSED[$INDEX]} $END
    done
#    echo -e $BOLD $GREEN PASSED ${PASSED[@]} $END
fi

if [ ${#FAILED[*]} -ne 0 ] ; then
    for INDEX in ${!FAILED[*]}
    do
        echo -e $BOLD $RED FAILED ${FAILED[$INDEX]} tests $END
        shift
    done
#    echo -e $BOLD $RED FAILED ${FAILED[@]} $END
    RESULT=$FAIL
fi

exit $RESULT
