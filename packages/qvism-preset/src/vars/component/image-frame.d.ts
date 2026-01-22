export declare const vars: {
  /**
   * 모서리에 라운드 스타일을 적용합니다.
   */
  "roundedTrue": {
    "enabled": {
      "root": {
        /** rounded 옵션 사용 시 적용되는 모서리 반경입니다. */
        "cornerRadius": "var(--seed-radius-r2)"
      }
    }
  },
  /**
   * 모서리를 직각으로 유지합니다.
   */
  "roundedFalse": {
    "enabled": {
      "root": {
        /** rounded 옵션 사용 시 적용되는 모서리 반경입니다. */
        "cornerRadius": "0px"
      }
    }
  },
  /**
   * 이미지 테두리에 스트로크를 표시합니다.
   */
  "strokeTrue": {
    "enabled": {
      "root": {
        /** stroke 옵션 사용 시 적용되는 테두리 색상입니다. */
        "strokeColor": "var(--seed-color-stroke-neutral-subtle)",
        /** stroke 옵션 사용 시 적용되는 테두리 두께입니다. */
        "strokeWidth": "1px"
      }
    }
  },
  /**
   * 테두리를 표시하지 않습니다.
   */
  "strokeFalse": {
    "enabled": {
      "root": {
        /** stroke 옵션 사용 시 적용되는 테두리 두께입니다. */
        "strokeWidth": "0px"
      }
    }
  }
}