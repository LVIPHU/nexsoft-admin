# Hướng dẫn Deploy Energy App lên Vercel

## Vấn đề: Lỗi 404 khi refresh trang

Khi deploy SPA (Single Page Application) với React Router lên Vercel, nếu không cấu hình đúng, bạn sẽ gặp lỗi 404 khi refresh trang hoặc truy cập trực tiếp vào các route như `/dashboard`.

## Giải pháp

### 1. Cấu hình Vercel Project Settings

Trong Vercel Dashboard, vào **Project Settings** → **General** và cấu hình:

- **Root Directory**: `apps/energy`
- **Build Command**: `npm run build:energy` hoặc `npx nx build energy`
- **Output Directory**: `dist`
- **Install Command**: `npm install` (chạy ở root của monorepo)

### 2. File vercel.json

File `vercel.json` đã được cấu hình với:
- **Rewrites**: Tất cả routes đều được redirect về `/index.html` để React Router xử lý
- **Headers**: 
  - `index.html` không được cache để đảm bảo luôn có version mới nhất
  - Assets được cache lâu dài để tối ưu performance

### 3. Kiểm tra Build Output

Sau khi build, đảm bảo trong folder `dist/` có:
- `index.html`
- `vercel.json` (được copy từ root)
- Folder `assets/` với các file JS/CSS

### 4. Test Local

Để test local trước khi deploy:

```bash
# Build app
npm run build:energy

# Preview build output
cd apps/energy/dist
npx vercel dev
```

### 5. Environment Variables

Đảm bảo đã set các environment variables trong Vercel Dashboard:
- `VITE_AUTH_SERVER_URL`
- `VITE_APP_URL`
- `VITE_APP_ID`
- `VITE_SSO_CALLBACK_PATH`
- `VITE_TOKEN_STORAGE`

## Lưu ý

- File `_redirects` trong dist là format của Netlify, không cần thiết cho Vercel
- Nếu vẫn gặp lỗi, kiểm tra lại Root Directory trong Vercel settings
- Đảm bảo build command chạy từ root của monorepo, không phải từ `apps/energy`

