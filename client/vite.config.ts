import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   port: 5173, // Thay đổi cổng này thành cổng bạn muốn sử dụng
  //   open: true, // Tùy chọn: Tự động mở trình duyệt khi máy chủ khởi động
  //   host: '103.82.194.250' // Tùy chọn: Cho phép truy cập từ mạng ngoài
  // }
})
