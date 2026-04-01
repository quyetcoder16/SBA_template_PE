# Hướng Dẫn Thiết Lập Dự Án & Giải Thích Frontend Codebase

## 1. Quy tắc đặt tên folder và khởi tạo ban đầu
Theo yêu cầu, khi đi thi bạn cần tạo đúng tên thư mục và khởi tạo dự án:
- **Tạo thư mục gốc**: Đặt theo Cú pháp `[Mã_lớp]-[Môn]-[Mã_SV]_[Project_Code]_PE`.
  *(⚠️ Lưu ý: Ví dụ `SE1941-JV_HE186796_SMS_PE`, nhớ check kỹ đề và thay `SMS` thành mã project code cụ thể trong đề thi)*
- Khởi tạo dự án Vite phía trong thư mục gốc. Tên thư mục con (project name) nên đặt trùng với thư mục cha.

---

## 2. Hướng dẫn các bước thiết lập theo Yêu Cầu

### Khởi tạo & Cài đặt Frontend
**Step 1:** Khởi tạo dự án Frontend bằng React (sử dụng vite).
```bash
npm create vite@latest
```
*(Lưu ý: project name đặt trùng với folder cha `SE1941-JV_HE186796_SMS_PE`)*

**Step 2:** Cài đặt các thư viện cần thiết.
```bash
npm i react-router-dom axios react-bootstrap bootstrap
```

**Step 3:** Tạo file cấu hình `jsonconfig.json` ở thư mục root (ngang hàng `package.json`):
```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "*": [
                "../../node_modules/*"
            ]
        }
    }
}
```

**Step 7 (Giao diện):** Import CSS của Bootstrap để dự án nhận dạng style.
Mở file `src/main.jsx` và thêm dòng:
```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

### Setup kết nối Backend (Java/Spring Boot)
**Step 4:** Setup kết nối DB và môi trường Java (Backend).
- Mở project Backend trong IDE.
- Khi mới vào nếu được nhắc **Setup JDK**, hãy mở file `pom.xml` xem version java được yêu cầu (thường là JDK 17 hoặc 21) để chọn và set Runtime cho tương ứng.
- Mở `application.properties` (hoặc `application.yml`) để sửa thông tin database đúng với máy của bạn:
  ```properties
  spring.datasource.url=jdbc:sqlserver://localhost:1435;databaseName=TestDB;encrypt=false;trustServerCertificate=false
  spring.datasource.username=sa
  spring.datasource.password=Quyet@123
  ```
  *(Lưu ý cực quan trọng: Hãy mở file DataInitialization trong thư mục config của Backend xem vòng lặp mock data chạy bao nhiêu lần để khởi tạo cho đủ data. Nhớ tự tạo Database rỗng trước nếu DB chưa tồn tại trước khi khởi động Spring Boot).*

**Step 5:** Sửa lỗi CORS (Tránh lỗi giao tiếp giữa Port Frontend và Backend).
Vào **tất cả các file Controller** bên backend thêm config @CrossOrigin:
```java
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("*") // Thêm dòng này lên phía trên từng class controller
@RestController
...
```

**Step 6:** Chạy backend và test API.
Sau khi bật Backend, dùng Postman hoặc Swagger để kiểm tra xem API lấy data thành công không trước khi kết nối bằng frontend.
- Link Swagger mẫu: `http://localhost:8080/swagger-ui/index.html`

---

## 3. Kiến trúc Components & Pages trong Dự án FE

Dự án đã dựng sẵn template giao diện cực kỳ hoàn thiện với React-Bootstrap, sẵn sàng cho bạn CRUD (Thêm, Sửa, Xóa, Phân Trang).

### 3.1. Các Components tái sử dụng (`src/components/`)
1. **`CustomFilter.jsx`**
   - **Nhiệm vụ:** Component chứa vùng input text và dropdown tìm kiếm Category.
   - **Cách dùng:** Nhận vào props `categories` để render danh sách `<option>`. Các props `filters`, `onFilterChange` để đồng bộ state khi bạn gõ text, thay đổi category. Gọi truy vấn backend thông qua form submit `onSearch`. Nút "Add New" gọi callback hàm `onAdd` để chuyển Form qua trang thêm mới.
2. **`CustomTable.jsx`**
   - **Nhiệm vụ:** Render Component danh sách dữ liệu ra dạng Bảng.
   - **Cách dùng:** Truyền list danh sách hiển thị qua mảng `data`. Component tự format giá sang VND với `Intl.NumberFormat('vi-VN')`. Tính toán chuẩn các STT nhảy trang nhờ props `startIndex` (được tính bằng `pageInfo.currentPage * pageInfo.pageSize`). Nút Xóa/Sửa/View móc nối động vào router và các hàm cha.
3. **`DeleteModal.jsx`**
   - **Nhiệm vụ:** Widget hiển thị thông báo popup hộp thoại xác nhận xóa (Sử dụng Modal Bootstrap).
   - **Cách dùng:** Bind prop thông báo `show`, hiển thị động tên đối tượng bằng thẻ in đậm `target?.shoesName`. Khi nhấn Yes sẽ gọi lên hàm `onConfirm()`.

### 3.2. Cấu trúc Các Pages (`src/pages/`)
1. **`ListPage.jsx` (Trang Danh Sách - Mặc định "/")**
   - Nơi quản lý State rất chặt chẽ: `pageInfo` (Phân trang), `filters` (nhập text nhưng chưa search), `searchParams` (state trigger để Call API), và `deleteTarget` (bật/tắt xoá).
   - Sử dụng `useCallback` với phương thức `fetchShoesData` gọi api `getShoes` với các page/size từ state.
   - **Tính năng hay:** Có logic xử lý UX tự lùi trừ đi 1 giá trị của `currentPage` nếu phần tử bị xóa là item cuối cùng của bảng trang hiện tại.
2. **`AddPage.jsx` (Trang Thêm Mới - "/add")**
   - Khởi tạo object `formData` ban đầu cho việc điền (name, price, nsx, category...).
   - Check Validation siêu kỹ dựa vào helper `validator.js`. Đặc biệt gọi API ngầm check **Trung lặp tên (`Duplicate name`)** để quăng lỗi lên `<Form.Control.Feedback>` nếu phát hiện trùng trong server.
   - Trước khi gửi submit: `importDate` và `productionDate` từ UI format (`dd/MM/yyyy`) sẽ được đẩy qua Validator convert sang ISO String (`yyyy-MM-dd`) chuẩn Database để lưu chuẩn xác xuông Backend Spring Boot.
3. **`UpdatePage.jsx` (Trang Cập Nhật - "/update/:id")**
   - Lấy tham số url `id` lấy từ hook `useParams()`. Dùng Id fetch API tải form data ban đầu kèm format lại chuỗi ISO string Ngày Tháng về `dd/MM/yyyy`.
   - Có Validation chặn trùng tên có bắt ngoại lệ loại trừ lại chính bản thân Object đang update gõ (`String(item.shoesId) !== String(id)`).
4. **`PageDetail.jsx` (Trang Xem Chi Tiết - "/view/:id")**
   - Gọi API by ID rendering thông tin chi tiết bằng giao diện Layout chia Cột (`Row` & `Col` Bootstrap). Hàm helper `formatDate` convert từ kiểu Date Object ra string trực tiếp nội bộ.

---

## 4. API Service (`src/service/api.js`)
File tập trung các endpoints gọi qua tầng API backend để dễ dàng Maintain khi URL thay đổi.
- **Base Request:** Sử dụng instance `axios.create()` gắn cứng `baseURL: http://localhost:8080/api`
- Các luồng fetch dữ liệu bọc bởi các function call độc lập.
- Ở module search `getShoes`, param truyền lên bao gồm trang, size và param sort cố định `sortBy=shoesName, direction=asc`.

---

## 5. Ultils Helper - Validator (`src/utils/validator.js`)
Bộ công cụ Custom Validations dùng trực tiếp trong hàm submit của các trang Form (cụ thể là `AddPage`, `UpdatePage`):
- `isRequired(val)`: Chống các trường Empty / toàn space trống.
- `minLength`, `maxLength`: Chiều dài text input.
- `isNumberInRange(val, min, max)`: Cực kỳ thông dụng cho validate Price, Tuổi, Số lượng nằm trong khoảng.
- `isDateFormat(dateStr)`: Chuỗi RegEx bắt chặt format chuẩn `dd/MM/yyyy`, lọc luôn ngày của tháng có tồn tại không.
- `isAfter(date1, date2)`: Logic tiện ích để bắt các validation ngày sau thời gian xuất/nhập/tạo.
- `formatToISODate(dateStr)`: Format string để gửi đi Backend theo chuẩn Mapping entity.
