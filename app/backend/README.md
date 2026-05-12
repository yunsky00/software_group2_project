# SpecMoa (Certificate Recommendation API)

## Install dependencies
```bash
 pip install -r requirements.txt
```


## Test API
```bash
# Run tests with pytest at the root directory of the project
pytest -v
```


## Using API
* Execute web server
```bash
 uvicorn app.main:app --reload
```
* Access API documentation
  - http://127.0.0.1:8000/redoc
  - http://127.0.0.1:8000/docs
* Access APIs
  - http://127.0.0.1:8000/api/v1/certs?category=공기업&job_group=IT
  - http://127.0.0.1:8000/api/v1/certs/ranking
  - http://127.0.0.1:8000/api/v1/calendar/upcoming?days=365
  - http://127.0.0.1:8000/api/v1/bookmarks

* Access APIs with curl (for POST/Auth)
```bash
 curl -X GET "http://127.0.0.1:8000/api/v1/consult/priority?major=컴퓨터공학&job=백엔드&target_company=대기업" \
      -H "Authorization: Bearer <your_supabase_token>"

 # {
 #  "status":"SUCCEED",
 #  "data": {
 #      "consulting_result": "### 추천 자격증... 1. 정보처리기사..."
 #  }
 # }
```

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/bookmarks/12" \
      -H "Authorization: Bearer <your_supabase_token>"
      
 # {
 #  "status":"SUCCEED",
 #  "message":"즐겨찾기에 추가되었습니다."
 # }
```
