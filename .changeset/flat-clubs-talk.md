---
"@seed-design/figma": patch
---

Figma Codegen 과정에서 지원되지 않는 종류의 레이어를 발견하는 경우 어떤 종류인지 결과에 명시합니다.
TabsTrigger, ChipTabsTrigger Codegen 시 label 값이 누락되던 문제를 수정합니다.
MenuSheet Codegen 시 컴포넌트 이름이 `MenuSheet`로 잘못 생성되던 문제를 `MenuSheetRoot`로 수정합니다.
BottomSheet Codegen 시 정적 컴포넌트 키 대신 props에서 동적으로 키를 참조하도록 수정하여 인스턴스 매칭 오류를 해결합니다.