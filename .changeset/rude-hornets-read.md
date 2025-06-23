---
"@seed-design/tailwind3-plugin": patch
"@seed-design/migration-index": patch
"@seed-design/tailwind4-theme": patch
"@seed-design/css": patch
---

새로운 black, white alpha 값을 추가합니다

`$color.palette.static-black-alpha-50` (예전 값)
- 예전 값: #0000000d (투명도 약 5.1%)
- 변경 값: `$color.palette.static-black-alpha-200` (투명도 4.7%)

`$color.palette.static-black-alpha-200` (예전 값)
- 예전 값: #00000033 (투명도 20%)
- 변경 값: `$color.palette.static-black-alpha-500` (투명도 17.3%)

`$color.palette.static-black-alpha-500` (예전 값)
- 예전 값: #00000080 (투명도 약 50.2%)
- 변경 값: `$color.palette.static-black-alpha-700` (투명도 45.5%)

`$color.palette.static-white-alpha-200` (예전 값)
- 예전 값: #ffffff33 (투명도 20%)
- 변경 값: `$color.palette.static-white-alpha-300` (투명도 18%)

`$color.palette.static-white-alpha-800` (예전 값)
- 예전 값: #ffffffcc (투명도 약 80%)
- 변경 값: `$color.palette.static-white-alpha-800` (투명도 87.1%)
- (참고: 이 값은 이름은 같지만 실제 투명도 값은 80%에서 87.1%로 변경되었습니다.)
