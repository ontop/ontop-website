# Statistics

## Downloads
### Github releases
For all the versions 4.x:
```bash
curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/ontop/ontop/releases \
   | jq '[.[] | select((.tag_name | startswith("ontop-4."))) | .assets[] | .download_count ] | add' 
```
For all the versions 5.x:
```bash
curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/ontop/ontop/releases \
   | jq '[.[] | select((.tag_name | startswith("ontop-5."))) | .assets[] | .download_count ] | add' 
```

### Docker Hub (image pulls)
Starting from 5.0.0:
```bash
curl -s "https://hub.docker.com/v2/repositories/ontop/ontop/" | jq '.pull_count'
```
Before:
```bash
curl -s "https://hub.docker.com/v2/repositories/ontop/ontop-endpoint/" | jq '.pull_count'
```
