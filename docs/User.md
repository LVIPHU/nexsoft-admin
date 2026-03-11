# User

| Header        | Type   | Required | Description         |
| ------------- | ------ | -------- | ------------------- |
| Authorization | string | Yes      | Bearer access token |
| Content-Type  | string | Yes      | application/json    |



| Parameter | Type   | Required | Description                               |
| --------- | ------ | -------- | ----------------------------------------- |
| page      | int    | No       | Số trang                                  |
| limit     | int    | No       | Số lượng record mỗi trang                 |
| sort      | string | No       | Sắp xếp dữ liệu (ví dụ: created\_at desc) |
| keyword   | string | No       | Tìm kiếm theo tên hoặc thông tin user     |

curl --location 'http://localhost:8087/v1/authz/user?page=1\&limit=20' --header 'Authorization: Bearer {access\_token}' --header 'Content-Type: application/json'



# Get User By ID /v1/authz/user/:id

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| id        | string | Yes      | ID của user or username |



# Update User Name PATCH /v1/authz/user/:id

| Field     | Type   | Required | Description                     |
| --------- | ------ | -------- | ------------------------------- |
| user\_id  | string | Yes      | ID của user                     |
| name      | string | Yes      | Tên mới của user                |
| admin\_id | string | Yes      | ID của admin thực hiện cập nhật |

