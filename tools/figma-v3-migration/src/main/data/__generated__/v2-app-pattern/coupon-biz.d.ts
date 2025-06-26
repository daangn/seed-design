export declare const metadata: {
  "name": "coupon_biz",
  "key": "ff2ff0b05aceb6997bebfeb38dc58ad6c767ae64",
  "componentPropertyDefinitions": {
    "쿠폰발급상태": {
      "type": "VARIANT",
      "defaultValue": "발급중",
      "variantOptions": [
        "발급중",
        "수량소진",
        "기한만료",
        "발급중단"
      ]
    },
    "User": {
      "type": "VARIANT",
      "defaultValue": "Manager",
      "variantOptions": [
        "Manager",
        "General"
      ]
    },
    "↳쿠폰액션": {
      "type": "VARIANT",
      "defaultValue": "쿠폰수정",
      "variantOptions": [
        "다시발급",
        "쿠폰수정",
        "쿠폰받기",
        "상품보기",
        "받은쿠폰",
        "사용완료",
        "기한만료"
      ]
    },
    "↳지급상태": {
      "type": "VARIANT",
      "defaultValue": "알수없음",
      "variantOptions": [
        "알수없음",
        "쿠폰노출",
        "안받음",
        "받음"
      ]
    },
    "State": {
      "type": "VARIANT",
      "defaultValue": "Active",
      "variantOptions": [
        "Active",
        "Disabled",
        "Selected",
        "Enabled"
      ]
    },
    "쿠폰 유형": {
      "type": "VARIANT",
      "defaultValue": "online",
      "variantOptions": [
        "online",
        "offline"
      ]
    }
  }
};
