# Tính năng Xử lý Suspension Account

## Tổng quan
Tính năng này tự động deactivate (vô hiệu hóa) account khi backend trả về thông báo lỗi có chứa từ "suspension" hoặc "suspended".

## Cách hoạt động

### 1. Kiểm tra lỗi suspension
- Hàm `checkForSuspensionError()` kiểm tra xem thông báo lỗi có chứa từ "suspension" hoặc "suspended" không
- Không phân biệt chữ hoa/chữ thường
- Trả về `true` nếu tìm thấy, `false` nếu không

### 2. Xử lý lỗi backend
- Hàm `handleBackendError()` nhận vào:
  - `jToken`: Token của account
  - `errorMessage`: Thông báo lỗi từ backend
  - `statusCode`: Mã trạng thái HTTP
- Nếu phát hiện lỗi suspension → gọi `deactivateAccountByToken()` để vô hiệu hóa account
- Nếu status code >= 500 → cũng vô hiệu hóa account (như logic cũ)

### 3. Vô hiệu hóa account
- Hàm `deactivateAccountByToken()` cập nhật trạng thái `active: false` cho account
- Lưu thay đổi vào file `accounts.json`
- Ghi log với lý do vô hiệu hóa

## Các endpoint được bảo vệ

### 1. `/api/pixel` (POST)
- Kiểm tra lỗi suspension trong response từ backend
- Deactivate account nếu phát hiện lỗi

### 2. `/api/purchase` (POST)
- Kiểm tra lỗi suspension trong response từ backend
- Deactivate account nếu phát hiện lỗi

### 3. `/api/accounts` (POST) - Tạo account mới
- Kiểm tra lỗi suspension khi gọi `/me` endpoint
- Không tạo account nếu có lỗi suspension

### 4. `/api/accounts/{id}/refresh` (POST) - Refresh account
- Kiểm tra lỗi suspension khi gọi `/me` endpoint
- Deactivate account nếu phát hiện lỗi

### 5. Hàm `purchaseProduct()`
- Kiểm tra lỗi suspension trong response từ backend
- Deactivate account nếu phát hiện lỗi

## Ví dụ thông báo lỗi sẽ trigger deactivation

```json
{
  "error": "Your account has been suspended for violating terms of service"
}
```

```json
{
  "error": "Account suspended due to suspicious activity"
}
```

```json
{
  "message": "User account is currently suspended"
}
```

## Log output

Khi account bị deactivate do suspension:
```
[auto] account deactivated due to suspension error from backend: Account Name
```

## Lưu ý

1. Tính năng này hoạt động song song với logic cũ (deactivate khi status code >= 500)
2. Account bị deactivate sẽ không thể thực hiện các thao tác pixel/purchase
3. Cần refresh account hoặc tạo account mới để tiếp tục sử dụng
4. Tất cả thay đổi được lưu vào file `db/accounts.json`

