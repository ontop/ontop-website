# Statistics

## Downloads
### Github releases
For all the versions 4.x:
```bash
curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/ontop/ontop/releases \
   | jq '[.[] | select((.tag_name | startswith("ontop-4."))) | .assets[] | .download_count ] | add' 
```

