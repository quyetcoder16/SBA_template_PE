export const Validator = {
    // 1. Kiểm tra trống (loại bỏ khoảng trắng)
    isRequired: (value) => {
        return value !== null && value !== undefined && value.toString().trim().length > 0;
    },

    minLength: (value, min) => {
        if (value === null || value === undefined) return false;
        const str = String(value).trim();
        return str.length >= min;
    },
    maxLength: (value, max) => {
        if (value === null || value === undefined) return false;
        const str = String(value).trim();
        // console.log(`Value: ${str}, Length: ${str.length}`);
        return str.length <= max;
    },

    // 3. Kiểm tra Email chuẩn RFC 5322
    isEmail: (value) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(value);
    },

    // 4. Kiểm tra Số điện thoại (Việt Nam - 10 số, bắt đầu bằng 0)
    isPhoneNumber: (value) => {
        const regex = /^(0[3|5|7|8|9])([0-9]{8})$/;
        return regex.test(value);
    },

    // 5. Kiểm tra Số trong khoảng (Dùng cho Price, Quantity, Age...)
    isNumberInRange: (value, min, max) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    },

    // 6. Kiểm tra số nguyên dương (Dùng cho Quantity, ID...)
    isPositiveInteger: (value) => {
        const num = Number(value);
        return Number.isInteger(num) && num > 0;
    },

    // 7. Kiểm tra định dạng ngày dd/MM/yyyy (Có check ngày nhuận và số ngày trong tháng)
    isDateFormat: (dateStr) => {
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if (!regex.test(dateStr)) return false;

        const [day, month, year] = dateStr.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day;
    },

    // 8. So sánh ngày (Ví dụ: Ngày nhập phải sau ngày sản xuất)
    isAfter: (dateStr1, dateStr2) => {
        if (!dateStr1 || !dateStr2) return true;
        const d1 = new Date(dateStr1.split('/').reverse().join('-'));
        const d2 = new Date(dateStr2.split('/').reverse().join('-'));
        return d2 >= d1;
    },

    // 9. Kiểm tra Password mạnh (Tối thiểu 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt)
    isStrongPassword: (value) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(value);
    },



    // 10. Format dữ liệu để gửi API (dd/MM/yyyy -> yyyy-MM-dd)
    formatToISODate: (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    }
};