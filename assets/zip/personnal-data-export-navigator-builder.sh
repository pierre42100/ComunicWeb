#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

rm -f personnal-data-export-navigator.zip
cd personnal-data-export-navigator;
zip -r personnal-data-export-navigator.zip assets Export.html
mv personnal-data-export-navigator.zip ../
