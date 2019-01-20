#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd personnal-data-export-navigator;
zip -r personnal-data-export-navigator.zip assets Export.html
mv personnal-data-export-navigator.zip ../
