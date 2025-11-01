# Remove documentation folders
Remove-Item DOCS, extra_docs, NOTES -Recurse -Force -ErrorAction SilentlyContinue

# Stage and commit changes
git add -u
git commit -m "Sync professional branch: remove documentation folders"

# Push to professional remote
git push professional master

# Restore documentation folders from master branch
git checkout master -- DOCS extra_docs NOTES
