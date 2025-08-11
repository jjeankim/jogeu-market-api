"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADDRESS_SUCCESS = exports.WISHLIST_SUCCESS = exports.SAMPLE_ORDER_SUCCESS = exports.REVIEW_SUCCESS = exports.PRODUCT_SUCCESS = exports.ORDER_SUCCESS = exports.COUPON_SUCCESS = exports.CART_SUCCESS = exports.BRAND_SUCCESS = exports.USER_SUCCESS = exports.AUTH_SUCCESS = exports.COMMON_SUCCESS = void 0;
exports.COMMON_SUCCESS = {
    SUCCESS: "요청이 성공적으로 처리되었습니다.",
};
exports.AUTH_SUCCESS = {
    SIGNUP: "회원가입이 완료되었습니다.",
    LOGIN: "로그인이 성공적으로 완료되었습니다.",
};
exports.USER_SUCCESS = {
    PASSWORD_UPDATED: "비밀번호가 성공적으로 변경되었습니다.",
};
exports.BRAND_SUCCESS = {
    CREATE: "브랜드가 성공적으로 등록되었습니다.",
    FETCH: "브랜드 정보가 성공적으로 조회되었습니다.",
};
exports.CART_SUCCESS = {
    ADD: "상품이 장바구니에 성공적으로 담겼습니다.",
    FETCH: "장바구니 정보가 성공적으로 조회되었습니다.",
    UPDATE: "장바구니 상품이 성공적으로 수정되었습니다.",
    DELETE: "장바구니 상품이 성공적으로 삭제되었습니다.",
};
exports.COUPON_SUCCESS = {
    ISSUE: "쿠폰이 성공적으로 발급되었습니다.",
    FETCH: "쿠폰 정보가 성공적으로 조회되었습니다.",
    LIST: "쿠폰 목록이 성공적으로 조회되었습니다.",
    USE: "쿠폰이 성공적으로 사용되었습니다.",
};
exports.ORDER_SUCCESS = {
    CREATE: "주문이 성공적으로 생성되었습니다.",
    LIST: "주문 목록이 성공적으로 조회되었습니다.",
    DETAIL: "주문 상세 정보가 성공적으로 조회되었습니다.",
    STATUS_UPDATE: "주문 상태가 성공적으로 변경되었습니다.",
};
exports.PRODUCT_SUCCESS = {
    CREATE: "상품이 성공적으로 등록되었습니다.",
    LIST: "상품 목록이 성공적으로 조회되었습니다.",
};
exports.REVIEW_SUCCESS = {
    GET_LIST: "상품 리뷰 목록이 성공적으로 조회되었습니다.",
    CREATE: "리뷰가 성공적으로 작성되었습니다.",
    UPDATE: "리뷰가 성공적으로 수정되었습니다.",
    DELETE: "리뷰가 성공적으로 삭제되었습니다.",
    LIKE: "리뷰에 좋아요를 성공적으로 등록했습니다.",
    UNLIKE: "리뷰 좋아요가 성공적으로 취소되었습니다.",
    TAGS_GET: "리뷰 태그 목록이 성공적으로 조회되었습니다.",
    TAG_CREATE: "리뷰 태그가 성공적으로 추가되었습니다.",
};
exports.SAMPLE_ORDER_SUCCESS = {
    SAMPLE_LIST: "샘플 상품 목록이 성공적으로 조회되었습니다.",
    ORDER_CREATE: "샘플 주문이 성공적으로 생성되었습니다.",
};
exports.WISHLIST_SUCCESS = {
    ADD: "상품이 위시리스트에 성공적으로 추가되었습니다.",
    FETCH: "위시리스트가 성공적으로 조회되었습니다.",
    DELETE: "위시리스트 상품이 성공적으로 삭제되었습니다.",
};
exports.ADDRESS_SUCCESS = {
    CREATE: "배송지가 성공적으로 등록되었습니다.",
    UPDATE: "배송지가 성공적으로 수정되었습니다.",
    SET_DEFAULT: "기본 배송지가 성공적으로 설정되었습니다.",
    GET_ALL: "주소 목록이 성공적으로 조회되었습니다.",
};
