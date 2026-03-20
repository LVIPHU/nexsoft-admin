# Violation

## Headers

| Header        | Kiểu   | Bắt buộc | Mô tả               |
| ------------- | ------ | -------- | ------------------- |
| Authorization | string | ??       | Bearer access token |
| Content-Type  | string | ??       | application/json    |

## **Enum**

### Violation Topics

Các loại vi phạm mà người dùng có thể báo cáo (report) đối với nội dung.

| Enum | Giá trị | Mô tả |
`                | Spam Or Scam                 | Nội dung spam, lừa đảo, quảng cáo không mong muốn   |
|`ViolationTopicHarassmentOrBullying`      | Harassment Or Bullying       | Nội dung quấy rối, bắt nạt hoặc xúc phạm người khác |
|`ViolationTopicHateSpeechOrDiscrimination`| HateSpeech Or Discrimination | Nội dung kích động thù ghét hoặc phân biệt đối xử   |
|`ViolationTopicNudityOrSexualContent`     | Nudity Or Sexual Content     | Nội dung khỏa thân hoặc mang tính chất tình dục     |
|`ViolationTopicViolenceOrHarmfulContent` | Violence Or Harmful Content | Nội dung bạo lực hoặc gây nguy hiểm |

### Violation Post Status

Trạng thái xử lý của nội dung vi phạm trong hệ thống moderation.

| Enum                         | Giá trị | Mô tả                                     |
| ---------------------------- | ------- | ----------------------------------------- |
| `ViolationPostStatusPending` | PENDING | Nội dung đang chờ moderator xem xét       |
| `ViolationPostStatusBypass`  | BYPASS  | Nội dung được xác nhận không vi phạm      |
| `ViolationPostStatusBan`     | BAN     | Nội dung bị xác nhận vi phạm và đã bị cấm |

| ------------------------------------------ | ---------------------------- | --------------------------------------------------- |
| `ViolationTopicSpamOrScam### Priority

Mức độ ưu tiên xử lý vi phạm.

| Enum               | Giá trị   | Mô tả                                   |
| ------------------ | --------- | --------------------------------------- |
| `PriorityVeryHigh` | VERY_HIGH | Mức độ rất nghiêm trọng, cần xử lý ngay |
| `PriorityHigh`     | HIGH      | Mức độ nghiêm trọng cao                 |
| `PriorityMedium`   | MEDIUM    | Mức độ trung bình                       |
| `PriorityLow`      | LOW       | Mức độ thấp                             |

---

## 1. Get content replies

```shellscript
POST v1/authz/violation/replies
{
    "post_id": 4,
    "page": 1,
    "limit": 2
}
```

### 200 (OK)

```shellscript
{
    "data": [
        {
            "id": 1713,
            "content": "",
            "hashtags": [
                "test"
            ],
            "reply_on_id": 4,
            "creator": {
                "user_id": "G5P5HDShMsFyovFRhtgcLsxRwTzHKeM2e413mxVHtAda",
                "username": "g5p5h",
                "name": "Dyno Nek",
                "thumbnail_url": "2"
            }
        },
        {
            "id": 1671,
            "content": "123",
            "hashtags": null,
            "reply_on_id": 4,
            "creator": {
                "user_id": "9G8tyJM4mz84b5kQQqDKjE5Ns1RkumVvNCsQHKhSuFnn",
                "username": "ahihihi",
                "name": "Ahihi",
                "thumbnail_url": "105"
            }
        }
    ],
    "pagination": {
        "total_rows": 65,
        "total_pages": 33,
        "limit": 2,
        "page": 1,
        "sort": {
            "created_at": "DESC"
        }
    }
}
```

## 2. List content

```
GET /v1/authz/violation/contents
```

---

**Query Parameters**

---

**Request**

```shellscript
curl --location '172.28.3.159:8087/v1/authz/violation/contents?limit=10&page=1&violation_status=BYPASS&priority=MEDIUM' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data ''
```

---

**Response**

```json
{
  "data": [
    {
      "id": 8,
      "type": "POST",
      "content": "đây là bài viết cho cộng đồng",
      "violation_status": "BYPASS",
      "number_of_violations": 10,
      "priority": "VERY_HIGH",
      "created_at": "2026-03-06T08:47:50.686971Z",
      "updated_at": "2026-03-10T03:42:40.079116Z"
    }
  ],
  "pagination": {
    "total_rows": 5,
    "total_pages": 1,
    "limit": 10,
    "page": 1,
    "sort": {
      "created_at": "DESC"
    }
  }
}
```

| Trường               | Kiểu     | Mô tả                         |
| -------------------- | -------- | ----------------------------- |
| id                   | integer  | ID của nội dung               |
| type                 | string   | Loại nội dung (POST, COMMENT) |
| content              | string   | Nội dung text                 |
| violation_status     | string   | Trạng thái vi phạm            |
| number_of_violations | integer  | Tổng số lần vi phạm           |
| priority             | string   | Mức độ ưu tiên xử lý          |
| created_at           | datetime | Thời điểm tạo nội dung        |
| updated_at           | datetime | Thời điểm cập nhật gần nhất   |

---

## 3. Get statistic

```
GET /v1/authz/violation/statistic
```

---

**Query Parameters (NONE)**

---

**Request**

```shellscript
curl --location '172.28.3.159:8087/v1/authz/violation/statistic' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data ''
```

---

**Response**

```json
{
  "total_high": 1,
  "total_ban": 1,
  "total_bypass": 1,
  "total_pending": 3
}
```

| Trường        | Kiểu    | Mô tả                                  |
| ------------- | ------- | -------------------------------------- |
| total_high    | integer | Tổng số nội dung có mức độ ưu tiên cao |
| total_ban     | integer | Tổng số nội dung đã bị cấm             |
| total_bypass  | integer | Tổng số nội dung được bỏ qua           |
| total_pending | integer | Tổng số nội dung đang chờ xử lý        |

---

## 4. Get content detail

```
GET /v1/authz/violation/contents/{id}
```

---

---

**Request**

```shellscript
curl --location '172.28.3.159:8087/v1/authz/violation/contents/4' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data ''

```

---

**Response**

├── violation (ViolationContent)

│ └── total_by_violation_type (ViolationSummary\[])

└── content (Post)

&#x20; └── user (User)

&#x20; └── files (File\[])

&#x20; └── parent_post (Post)

&#x20; └── reply_on_post (Post)

```json
{
  "violation": {
    "id": 4,
    "content_id": 30010,
    "content_type": "POST",
    "content_data_type": "TEXT",
    "content": "đây là bài viết cho cộng đồng fan, không gì cả",
    "hashtags": ["news", "icon"],
    "content_created_at": "2026-01-13T07:19:48.447146Z",
    "content_updated_at": "2026-01-13T07:19:48.447146Z",
    "violation_status": "BAN",
    "number_of_violations": 1,
    "total_by_violation_type": [
      {
        "violation_type": "Violence_Or_Harmful_Content",
        "total": 1
      },
      {
        "violation_type": "Spam",
        "total": 0
      }
    ],
    "priority": "LOW",
    "created_at": "2026-03-06T07:41:53.582539Z",
    "updated_at": "2026-03-10T03:41:12.374311Z"
  },
  "content": {
    "id": 30010,
    "content": "đây là bài viết cho cộng đồng fan, không gì cả",
    "audience_type": "PUBLIC",
    "post_content_type": "TEXT",
    "post_status": "BAN",
    "parent_id": null,
    "files": [
      {
        "hash": "abc123xyz",
        "width": 1920,
        "height": 1080,
        "size": 204800,
        "duration": 0,
        "mime_type": "image/jpeg",
        "name": "post-image.jpg",
        "folder_id": "media-folder-01",
        "space": "public",
        "password": null,
        "ext": "jpg",
        "video_resolution": null,
        "platform": 1,
        "unique_hash": "unique_file_hash_123"
      }
    ],
    "created_by": "ELQfzt3BhekiCoa861jpDSetRn9q853hrdBb39qY12ob0",
    "updated_by": "ELQfzt3BhekiCoa861jpDSetRn9q853hrdBb39qY12ob0",
    "created_at": "2026-01-13T07:19:48.447146Z",
    "updated_at": "2026-03-06T08:12:23.562348Z",
    "post_type": "POST",
    "reply_on_id": null,
    "user": {
      "user_id": "ELQfzt3BhekiCoa861jpDSetRn9q853hrdBb39qY12ob0",
      "username": "vix4",
      "name": "vix4",
      "thumbnail_url": "https://cdn.example.com/avatar/vix4.jpg"
    },
    "post_metrics": {
      "LIKE": 120,
      "COMMENT": 15
    },
    "parent_post": null,
    "reply_on_post": null,
    "hashtags": ["news", "icon"]
  }
}
```

- **ViolationContent**

| Trường                  | Kiểu                     | Mô tả                                               |
| ----------------------- | ------------------------ | --------------------------------------------------- |
| id                      | int64                    | ID của bản ghi vi phạm                              |
| content_id              | int64                    | ID của nội dung bị báo cáo                          |
| content_type            | string                   | Loại nội dung (POST, COMMENT, ...)                  |
| content_data_type       | string                   | Kiểu dữ liệu nội dung (TEXT, IMAGE, VIDEO, ...)     |
| content                 | string                   | Nội dung text của bài viết                          |
| hashtags                | array\[string]           | Danh sách hashtag của nội dung                      |
| content_created_at      | datetime                 | Thời điểm nội dung được tạo                         |
| content_updated_at      | datetime                 | Thời điểm nội dung được cập nhật                    |
| violation_status        | string                   | Trạng thái xử lý vi phạm (PENDING, BYPASS, BAN)     |
| number_of_violations    | int32                    | Tổng số lần nội dung bị báo cáo                     |
| total_by_violation_type | array\[ViolationSummary] | Thống kê số lượng vi phạm theo từng loại            |
| priority                | string                   | Mức độ ưu tiên xử lý (LOW, MEDIUM, HIGH, VERY_HIGH) |
| created_at              | datetime                 | Thời điểm tạo bản ghi vi phạm                       |
| updated_at              | datetime                 | Thời điểm cập nhật bản ghi vi phạm                  |

- **ViolationSummary**

| Trường         | Kiểu   | Mô tả                            |
| -------------- | ------ | -------------------------------- |
| violation_type | string | Loại vi phạm                     |
| total          | int64  | Tổng số lần vi phạm của loại này |

- **Post**
- **User**
- **File**

---

## 5. BAN

```
POST /v1/authz/violation/contents/{id}/ban
```

---

**Path Parameters**

| Tham số | Kiểu    | Bắt buộc | Mô tả                  |
| ------- | ------- | -------- | ---------------------- |
| id      | integer | ??       | ID của bản ghi vi phạm |

---

**Request**

```shellscript
curl --location '172.28.3.159:8087/v1/authz/violation/statistic' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data ''
```

---

**Response**

```json
{}
```

## 6. Reject

```
POST /v1/authz/violation/contents/{id}/reject
```

---

**Path Parameters**

| Tham số | Kiểu    | Bắt buộc | Mô tả          |
| ------- | ------- | -------- | -------------- |
| id      | integer | ??       | ID của bản ghi |

---

**Request**

```shellscript
curl --location '172.28.3.159:8087/v1/authz/violation/statistic' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data ''
```

---

**Response**

```json
{}
```

## 7. Get content replies

```shellscript
POST /v1/authz/violation/replies
```

**Query parameters**

| Tham số | Kiểu | Bắt buộc | Mô tả              |
| ------- | ---- | -------- | ------------------ |
| page    | int  |          | số trang           |
| limit   | int  |          | giới hạn mỗi trang |
| post_id | int  | true     | 4                  |

**Request**

```shellscript
curl --location '172.28.3.159:8087/v1/authz/violation/replies' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data '{
    "post_id": 4,
    "page": 1,
    "limit": 2
}'
```

**Response**

```shellscript
{
    "data": [
        {
            "id": 1713,
            "content": "Pipilapu What the dog doing?",
            "hashtags": [
                "test"
            ],
            "reply_on_id": 4,
            "creator": {
                "user_id": "G5P5HDShMsFyovFRhtgcLsxRwTzHKeM2e413mxVHtAda",
                "username": "g5p5h",
                "name": "Dyno Nek",
                "thumbnail_url": "2"
            }
        },
        {
            "id": 1671,
            "content": "Huh HUh",
            "hashtags": null,
            "reply_on_id": 4,
            "creator": {
                "user_id": "9G8tyJM4mz84b5kQQqDKjE5Ns1RkumVvNCsQHKhSuFnn",
                "username": "ahihihi",
                "name": "Ahihi",
                "thumbnail_url": "105"
            }
        }
    ],
    "pagination": {
        "total_rows": 65,
        "total_pages": 33,
        "limit": 2,
        "page": 1,
        "sort": {
            "created_at": "DESC"
        }
    }
}
```

## 8. Save moderation keyword

```shellscript
POST /v1/authz/violation/moderation/keywords
```

**Request body**

| Fields    | Kiểu         | Bắt buộc | Mô tả                                 |
| --------- | ------------ | -------- | ------------------------------------- |
| id        | int          | optional | id của keyword nếu cần update         |
| keyword   | string       | true     | keyword là keyword                    |
| lang_code | string       | true     | keyword thuộc lang nào, e.g. en, zh,… |
| is_active | bool         | true     | có active keyword không               |
| topic     | array string | true     | danh sách topic của keyword           |

**Request**

```shellscript
# Create keyword
	curl --location 'localhost:8087/v1/authz/violation/moderation/keywords' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data '{
    "keyword": "fckup",
    "lang_code": "en",
    "is_active": true,
    "topics": [
        "Harassment_Or_Bullying"
    ]
}'

# Update keyword
curl --location 'localhost:8087/v1/authz/violation/moderation/keywords' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data '{
    "id": 42,
    "keyword": "fckup",
    "lang_code": "en",
    "is_active": true,
    "topics": [
        "Harassment_Or_Bullying",
        "Spam_Or_Scam"
    ]
}'
```

**Response**

```
{
    "id": 42
}
```

## 9. List moderation languages

```
GET /v1/authz/violation/moderation/languages
```

**Request**

```
curl --location '172.28.3.159:8087/v1/authz/violation/moderation/languages' \\
--header 'Authorization: Bearer <access_token>'
```

**Response**

```
{
    "data": [
        {
            "id": 1,
            "lang_code": "af",
            "text": "Afrikaans",
            "order": 1
        },
        {
            "id": 2,
            "lang_code": "am",
            "text": "Amharic",
            "order": 2
        },
       //....
    ]
}

```
