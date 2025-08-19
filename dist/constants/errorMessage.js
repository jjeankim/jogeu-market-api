"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADDRESS_ERROR = exports.WISHLIST_ERROR = exports.SAMPLE_ORDER_ERROR = exports.REVIEW_ERROR = exports.ORDER_ERROR = exports.COUPON_ERROR = exports.CART_ERROR = exports.PRODUCT_ERROR = exports.BRAND_ERROR = exports.USER_ERROR = exports.AUTH_ERROR = exports.SERVER_ERROR = exports.DB_ERROR = exports.REQUEST_ERROR = exports.COMMON_ERROR = void 0;
exports.COMMON_ERROR = {
    SERVER_ERROR: "서버 내부 오류가 발생했습니다.",
    UNAUTHORIZED: "유효하지 않은 사용자입니다.",
};
exports.REQUEST_ERROR = {
    MISSING_FIELDS: "필수 입력 항목이 누락되었습니다.",
    INVALID_INPUT: "입력값이 올바르지 않습니다.",
    VALIDATION_FAILED: "요청 검증에 실패했습니다.",
};
exports.DB_ERROR = {
    DUPLICATE_RECORD: "중복된 데이터가 존재합니다.",
    RECORD_NOT_FOUND: "데이터를 찾을 수 없습니다.",
    CONSTRAINT_FAILED: "데이터 제약 조건을 위반했습니다.",
};
exports.SERVER_ERROR = {
    INTERNAL_ERROR: "서버 오류가 발생했습니다.",
    NOT_IMPLEMENTED: "아직 구현되지 않은 기능입니다.",
    SERVICE_UNAVAILABLE: "서비스를 사용할 수 없습니다.",
};
exports.AUTH_ERROR = {
    EMAIL_ALREADY_EXISTS: "이미 등록된 이메일입니다.",
    INVALID_CREDENTIALS: "이메일 또는 비밀번호가 올바르지 않습니다.",
    TOKEN_MISSING: "인증 토큰이 제공되지 않았습니다.",
    TOKEN_INVALID: "유효하지 않거나 만료된 토큰입니다.",
};
exports.USER_ERROR = {
    USER_NOT_FOUND: "사용자를 찾을 수 없습니다.",
    PASSWORD_REQUIRED: "현재 비밀번호와 새 비밀번호를 모두 입력해야 합니다.",
    PASSWORD_INCORRECT: "현재 비밀번호가 일치하지 않습니다.",
    SAME_AS_OLD_PASSWORD: "기존 비밀번호와 동일합니다.",
    NO_PASSWORD_SET: "소셜 로그인 계정은 비밀번호가 설정되어 있지 않습니다."
};
exports.BRAND_ERROR = {
    VALIDATION: "브랜드 이름은 필수 입력 항목입니다.",
    CATEGORY_NOT_FOUND: "없는 카테고리 입니다.",
};
exports.PRODUCT_ERROR = {
    VALIDATION: "상품명과 가격은 필수이며, 가격은 숫자여야 합니다.",
    ITEM_VALIDATION: "상품 ID는 숫자여야 합니다.",
    NOT_FOUND: "상품을 찾을 수 없습니다.",
    THUMBNAIL_REQUIRED: "썸네일 이미지는 필수입니다.",
};
exports.CART_ERROR = {
    INVALID_USER: "장바구니를 조회할 수 없는 사용자입니다.",
};
exports.COUPON_ERROR = {
    INVALID_USER: "쿠폰을 사용할 수 없는 사용자입니다.",
    INVALID_COUPON: "유효하지 않은 쿠폰입니다.",
    ALREADY_ISSUED: "이미 발급된 쿠폰입니다.",
    NOT_FOUND_OR_NOT_OWNER: "쿠폰이 존재하지 않거나 소유자가 아닙니다.",
    ALREADY_USED: "이미 사용된 쿠폰입니다.",
};
exports.ORDER_ERROR = {
    EMPTY_CART: "장바구니가 비어 있어 주문을 생성할 수 없습니다.",
    CREATE_FAILED: "주문을 생성하는 데 실패했습니다.",
    LIST_NOT_FOUND: "주문 목록을 찾을 수 없습니다.",
    LIST_FAILED: "주문 목록 조회에 실패했습니다.",
    DETAIL_NOT_FOUND: "주문 정보를 찾을 수 없습니다.",
    STATUS_UPDATE_FAILED: "주문 상태 변경에 실패했습니다.",
    INVALID_ID: "유효한 주문 ID가 필요합니다.",
    INVALID_PAYMENT_STATUS: "유효한 결제 상태값이 필요합니다.",
    INVALID_TRANSITION: "주문 상태를 변경할 수 없습니다.",
    ORDER_NOT_FOUND: "해당 주문을 찾을 수 없습니다.",
    INVALID_STATUS: "유효하지 않은 주문 상태입니다.",
    INVALID_ORDER_ID: "유효한 주문 ID가 아닙니다.",
};
exports.REVIEW_ERROR = {
    NOT_FOUND: "리뷰를 찾을 수 없습니다.",
    NOT_FOUND_OR_UNAUTHORIZED: "리뷰를 찾을 수 없거나 권한이 없습니다.",
    CREATE_FAILED: "리뷰 작성에 실패했습니다.",
    UPDATE_FAILED: "리뷰 수정에 실패했습니다.",
    DELETE_FAILED: "리뷰 삭제에 실패했습니다.",
    TAG_DUPLICATE: "동일한 태그가 이미 추가되어 있습니다.",
    TAG_INVALID: "태그는 공백 없이 한글, 영문, 숫자만 사용할 수 있습니다.",
};
exports.SAMPLE_ORDER_ERROR = {
    SAMPLE_LIST_FAIL: "샘플 상품 목록을 가져오는 데 실패했습니다.",
    EMPTY_SAMPLE_CART: "샘플 장바구니가 비어 있어 주문을 생성할 수 없습니다.",
    ORDER_CREATE_FAIL: "샘플 주문 생성에 실패했습니다.",
};
exports.WISHLIST_ERROR = {
    PRODUCT_ID_REQUIRED: "상품 ID는 필수입니다.",
    ALREADY_EXISTS: "이미 위시리스트에 추가된 상품입니다.",
    INVALID_PRODUCT: "유효하지 않은 위시리스트 상품입니다.",
};
exports.ADDRESS_ERROR = {
    NOT_FOUND: "배송지를 찾을 수 없습니다.",
    NOT_FOUND_OR_UNAUTHORIZED: "배송지를 찾을 수 없거나 권한이 없습니다.",
};
