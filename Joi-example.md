# 1. Chung cho mọi type

.required() → bắt buộc có giá trị.
.optional() → không bắt buộc.
.forbidden() → cấm xuất hiện.
.valid(val1, val2, ...) → chỉ chấp nhận 1 trong các giá trị.
.invalid(val1, val2, ...) → không được phép chứa giá trị này.
.default(value) → gán giá trị mặc định.
.allow(null, '') → cho phép null hoặc chuỗi rỗng.
.empty() → định nghĩa giá trị coi như “rỗng”.

# 2. String (Joi.string())
const stringSchema = Joi.string()
  .min(3)
  .max(10)
  .pattern(/^[a-zA-Z]+$/)
  .email({ tlds: { allow: false } })
  .messages({
    "string.min": "Chuỗi phải có ít nhất 3 ký tự",
    "string.max": "Chuỗi không quá 10 ký tự",
    "string.pattern.base": "Chỉ cho phép chữ cái",
    "string.email": "Email không hợp lệ",
  });

.min(n) → độ dài tối thiểu.
.max(n) → độ dài tối đa.
.length(n) → độ dài đúng bằng n.
.pattern(regex) → regex kiểm tra.
.email() → kiểm tra định dạng email.
.uri() → kiểm tra URL.
.ip() → kiểm tra IP (IPv4/IPv6).
.uuid() → kiểm tra UUID.
.alphanum() → chỉ chấp nhận chữ + số.
.creditCard() → kiểm tra số thẻ tín dụng.
.trim() → bỏ khoảng trắng đầu/cuối.
.lowercase() / .uppercase() → ép về thường/hoa.

# 3. Number (Joi.number())
const numberSchema = Joi.number()
  .integer()
  .min(1)
  .max(100)
  .positive()
  .messages({
    "number.base": "Phải là số",
    "number.min": "Số phải ≥ 1",
    "number.max": "Số phải ≤ 100",
    "number.integer": "Phải là số nguyên",
  });

.min(n) → số nhỏ nhất.
.max(n) → số lớn nhất.
.greater(n) → lớn hơn n.
.less(n) → nhỏ hơn n.
.integer() → bắt buộc là số nguyên.
.positive() → số dương.
.negative() → số âm.
.precision(n) → số chữ số thập phân.
.multiple(base) → phải là bội số của base.

# 4. Boolean (Joi.boolean()): const booleanSchema = Joi.boolean().truthy("yes").falsy("no");

Có thể validate true/false.
.truthy('yes') / .falsy('no') → ánh xạ string sang boolean.

# 5. Date (Joi.date()): const dateSchema = Joi.date().greater("2020-01-01").less("2030-01-01");

.min('now') → ngày tối thiểu (hoặc so sánh với ngày khác).
.max('2025-12-31') → ngày tối đa.
.greater('2020-01-01') → lớn hơn ngày.
.less('2025-01-01') → nhỏ hơn ngày.
.iso() → định dạng ISO (YYYY-MM-DD).

# 6. Array (Joi.array()): const arraySchema = Joi.array().items(Joi.string().alphanum()).min(2).unique();

.items(schema) → chỉ định type cho từng phần tử.
.min(n) → số phần tử tối thiểu.
.max(n) → số phần tử tối đa.
.length(n) → đúng n phần tử.
.unique() → các phần tử phải khác nhau.
.ordered(schema1, schema2, ...) → thứ tự phần tử.

# 7. Object (Joi.object())
const objectSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
})
  .with("username", "password")
  .messages({
    "any.required": "Thiếu field bắt buộc",
  });

.keys({...}) → khai báo schema cho từng key.
.min(n) → số key tối thiểu.
.max(n) → số key tối đa.
.length(n) → đúng n key.
.unknown() → cho phép key không định nghĩa trước.
.and(key1, key2) → yêu cầu cả 2 key phải cùng có mặt.
.or(key1, key2) → ít nhất 1 trong 2 key có mặt.
.xor(key1, key2) → chỉ 1 trong 2 key có mặt.
.with(key1, key2) → nếu có key1 thì phải có key2.
.without(key1, key2) → nếu có key1 thì không được có key2.

# 8. Any (Joi.any())

.valid() / .invalid()
.equal() / .not()
.custom(fn) → viết rule tùy chỉnh.
.when(condition, options) → validate theo điều kiện (if/else).