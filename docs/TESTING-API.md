# Hướng dẫn Kiểm thử (Testing Guide)

Tài liệu này hướng dẫn cách viết và chạy unit test cho ứng dụng NestJS backend.

## 1. Giới thiệu về Unit Testing

Unit Testing là phương pháp kiểm thử từng đơn vị code nhỏ nhất (unit), thường là các class và function, để đảm bảo chúng hoạt động đúng như mong đợi.

Trong NestJS, chúng ta sử dụng **Jest** làm framework kiểm thử mặc định.

### Cấu trúc file test

Các file test thường có đuôi `.spec.ts` và nằm cạnh file code chính. Ví dụ:

- `auth.service.ts` -> `auth.service.spec.ts`

## 2. Cách chạy Test

Sử dụng các lệnh sau trong terminal (thư mục `api`):

```bash
# Chạy tất cả test
npm test

# Chạy test và theo dõi thay đổi (tốt khi đang code)
npm run test:watch

# Chạy test và xem báo cáo độ bao phủ (coverage)
npm run test:cov
```

## 3. Cách viết một Unit Test

Một unit test cơ bản bao gồm 3 phần chính: **Arrange (Chuẩn bị)**, **Act (Thực hiện)**, và **Assert (Kiểm tra)**.

### Ví dụ: Test cho AuthController

```typescript
// auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock object giả lập AuthService
  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    // Tạo module test giả lập
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService, // Inject mock service thay vì service thật
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  // Test case cụ thể
  describe('login', () => {
    it('should login user and return token', async () => {
      // 1. Arrange: Chuẩn bị dữ liệu và mock
      const dto = { login: 'test@mail.com', password: '123' };
      const result = { accessToken: 'xyz' };
      mockAuthService.login.mockResolvedValue(result);

      // 2. Act: Gọi hàm cần test
      const actual = await controller.login(dto);

      // 3. Assert: Kiểm tra kết quả
      expect(actual).toBe(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });
});
```

## 4. Các khái niệm quan trọng

### Mocking (Giả lập)

Khi test một Controller, chúng ta không muốn nó gọi Service thật (vì Service thật sẽ gọi Database thật). Thay vào đó, chúng ta tạo một **mock object** giả lập hành vi của Service.

- `jest.fn()`: Tạo một hàm giả.
- `mockResolvedValue(value)`: Giả lập hàm trả về một giá trị (Promise).
- `mockRejectedValue(error)`: Giả lập hàm ném ra lỗi.

### TestingModule

`Test.createTestingModule` tạo ra môi trường dependency injection thu nhỏ, chỉ chứa những gì cần thiết cho file test hiện tại.

- `providers`: Nơi khai báo các service và mock replacement (`useValue`).

## 5. Danh sách các test đã viết

Đã hoàn thành viết test cho toàn bộ các endpoint trong `src/modules`:

1. **Auth Module**:
   - `auth.controller.spec.ts`: Test register, login.
   - `auth.service.spec.ts`: Test logic login, xử lý sai password/email.

2. **Users Module**:
   - `users.controller.spec.ts`: Test endpoint `/me`, CRUD.
   - `users.service.spec.ts`: Test `findById` (loại bỏ password), `findAll`.

3. **Websites Module**:
   - `websites.controller.spec.ts`: Test create, list, delete.
   - `websites.service.spec.ts`: Test tạo website, generate subdomain, logic ownership.

4. **Pages Module**:
   - `pages.controller.spec.ts`: Test create page, publish.
   - `pages.service.spec.ts`: Test logic tạo trang, kiểm tra quyền sở hữu website.

5. **Public Module**:
   - `public.controller.spec.ts`: Test endpoint render trang public.

## 6. Lưu ý khi viết thêm test

- Luôn mock các dependency (Service, Prisma, ConfigService).
- Test cả trường hợp thành công (happy path) và thất bại (error cases).
- Đặt tên test case (`it`) rõ ràng, mô tả đúng hành vi mong đợi.
