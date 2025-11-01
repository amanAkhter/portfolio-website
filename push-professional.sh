#!/bin/bash
# Remove documentation folders
rm -rf DOCS extra_docs NOTES

# Stage and commit changes
git add -u
git commit -m "Sync professional branch: remove documentation folders"

# Push to professional remote
git push professional master

# Restore documentation folders from master branch
git checkout master -- DOCS extra_docs NOTES
