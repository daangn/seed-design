# kontext.yaml Schema

## 구조

```yaml
apiVersion: kontext/v1

relations:
  - when: "glob 패턴"        # 이 패키지 내 감시 대상
    affects:
      - path: "레포 루트 기준" # 영향받는 파일
        reason: "왜"          # 선택
        generated: true       # 선택. 자동 생성 파일
        command: "명령어"      # 선택. generated일 때 실행할 명령
```

## 템플릿 변수

- `{id}` → kebab-case (e.g., `action-button`)
- `{Id}` → PascalCase (e.g., `ActionButton`)

watch 패턴에서 매칭된 파일명에서 자동 추출됨.

## 예시

```yaml
apiVersion: kontext/v1

relations:
  - when: "components/*.yaml"
    affects:
      - path: packages/css/vars/component/
        generated: true
        command: bun rootage:generate
      - path: packages/react/src/components/{Id}/
        reason: API 변경 시 컴포넌트 업데이트
```
