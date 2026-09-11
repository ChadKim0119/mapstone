# v9 HTML 적용 방법

GitHub MCP `push_files` 한도 때문에 `개발 일정 및 진행 현황.dc.html` 전체(약 186KB)는 이 커넥터로 커밋하지 못했습니다.

로컬에서 한 번에 올리는 방법:

```bash
git clone https://github.com/ChadKim0119/mapstone.git
cd mapstone
git checkout feat/v9-board-tools

# 대화에서 받은 dev-schedule.dc.html 을 아래로 복사
cp /path/to/dev-schedule.dc.html "개발 일정 및 진행 현황.dc.html"

git add "개발 일정 및 진행 현황.dc.html"
git commit -m "feat: v9 board tools in source HTML"
git push
```

**PR #2를 머지하기 전에** 해당 파일 크기가 8바이트(`SEE_FILE`)가 아닌지 확인하세요.

```bash
wc -c "개발 일정 및 진행 현황.dc.html"
# 기대값: 180000 이상
```
