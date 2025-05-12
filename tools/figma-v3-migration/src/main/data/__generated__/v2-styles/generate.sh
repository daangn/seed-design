#!/bin/bash

# 데이터 배열
declare -a styles=(
    ".platform-ios/h1|S:aef8f7f12e2d0654087f98f1bac3f9a05b9bdfa5,"
    ".platform-ios/h2|S:9c7ab4e0efbf01ca146251cc5d63e69e23b90e4b,"
    ".platform-ios/h3|S:84269d3c215a48e7a990133849fedd318cb53b19,"
    ".platform-ios/h4|S:be9bf2ba12d9b783e748f8d068a896d4382772a1,"
    ".platform-ios/title1-bold|S:e06473df30edecded948b5f1878d39aa09ee552c,"
    ".platform-ios/title1-regular|S:376a846eea7722501719a3cbc98c13715c232dac,"
    ".platform-ios/title2-bold|S:864c90c1afc029a67eebba658ccc9af5bb90d8b9,"
    ".platform-ios/title2-regular|S:28a2c32344cc10f12ca5ac63791abd8b3e2cca0e,"
    ".platform-ios/title3-bold|S:fdf05d38af2fdfddd1a9481180b3432a6b76edfe,"
    ".platform-ios/title3-regular|S:f1f2954f8a63f866098e030a6ec299d9a3fe5213,"
    ".platform-ios/subtitle1-bold|S:b10525b67ca1572fa4a31db7b546156af5244483,"
    ".platform-ios/subtitle1-regular|S:8e87c2e4ca3710425e4f00d46fae410264cadd1e,"
    ".platform-ios/subtitle2-bold|S:1365941e2d64a9bef026cc99c0cf528924ef57c2,"
    ".platform-ios/subtitle2-regular|S:41cae88add9c5694f6ad1e32813b417c1a9f26ed,"
    ".platform-ios/body-l1-bold|S:03a4db099353bd0ae794b981fdba490f3a816cdb,"
    ".platform-ios/body-l1-regular|S:d91040aeef66794117d9cb8ab5505c93bf2ba968,"
    ".platform-ios/body-l2-bold|S:e07979c2bc472f45e11549cc0dba301539cb3f8c,"
    ".platform-ios/body-l2-regular|S:7739cca26e81253bddef0c950aa21adb8a796464,"
    ".platform-ios/body-m1-bold|S:cc98148312658a219cf5dc610ddc8067db951fee,"
    ".platform-ios/body-m1-regular|S:862d03f5b46ec64400f90e2f60f9cb2f8aed090e,"
    ".platform-ios/body-m2-bold|S:5cec511b6e6673133d22c790790ae66daed9f01d,"
    ".platform-ios/body-m2-regular|S:20f32da5d5127941ce750b1b5cb6306a3c2a7004,"
    ".platform-ios/caption1-bold|S:f74d11e1404fe9e18f1cfa20fde605abb3835c81,"
    ".platform-ios/caption1-regular|S:36045e81581583e4e2bcb01ec2f3391ba2e77fa7,"
    ".platform-ios/caption2-bold|S:d3c108d3bee4dbf07b36c85098a4e129630f6627,"
    ".platform-ios/caption2-regular|S:568a4960b0c9020ce97eadb25b5d375385e5efe7,"
    ".platform-ios/label1-bold|S:784fbd825f0456c43a7ebf90c9477d59841d7ae0,"
    ".platform-ios/label1-regular|S:8e44075645042e5044f7cea0980f40c0888db8fa,"
    ".platform-ios/label2-bold|S:23ebdc6f2c1faa9d378b6e6676f039099d313e6f,"
    ".platform-ios/label2-regular|S:af4aaafb9c5533013bba02f085c96dccc3d0b470,"
    ".platform-ios/label3-bold|S:1a31e919c029bdecca33ac0df8a475e26914b291,"
    ".platform-ios/label3-regular|S:4a1bade324138faa7d95dd7550d1666cf3d4ae6c,"
    ".platform-ios/label4-bold|S:3f3c58dc4149df251203fc0007eecd9331362fc4,"
    ".platform-ios/label4-regular|S:d0ad23c15638a1fd2baf7343dcf5e5ffb0875aa2,"
    ".platform-ios/label5-bold|S:530547ca7918b44828d633a10a62dd43fa4514b9,"
    ".platform-ios/label5-regular|S:397d20b5a3912bc277f3c93b31db0f4234d98717,"
    ".platform-ios/label6-bold|S:ac4e700f9e0a4e91b426a12334f18ebabb2c02e8,"
    ".platform-ios/label6-regular|S:110aa3cba82123f2b8a4e581ddbae7930615b0bb,"
    ".platform-android/h1|S:891420ff2d474f0f9333a7cd70737201773e3b60,"
    ".platform-android/h2|S:a2f2299113278a36032538414cb0140eacc582ae,"
    ".platform-android/h3|S:445385913fc4ef427c4974b1bfbd56038562d33b,"
    ".platform-android/h4|S:adba1b3fd32128e091829ce26ce2a31ecf999059,"
    ".platform-android/title1-bold|S:1fb2aad91067712ffd52c1a7afb2004dc0cf3cc2,"
    ".platform-android/title1-regular|S:0f0117292fa931060d095be34b2b98987d6cb030,"
    ".platform-android/title2-bold|S:ada0e42aacf128c4baa091aeeab9299867789eab,"
    ".platform-android/title2-regular|S:203bc1e7c8e11e56879da11558bcf2d2cf5c8759,"
    ".platform-android/title3-bold|S:6e1e77bba21da503fb256201b9dadabd1b2a9f11,"
    ".platform-android/title3-regular|S:d7e64c4cae725accb687fd1a5dfb60364ad54edc,"
    ".platform-android/subtitle1-bold|S:708be1c6992f3422982dd0026351f2857d2c1c20,"
    ".platform-android/subtitle1-regular|S:c62fe6f7b40a2e8e6e999416f9db03ab6bcff957,"
    ".platform-android/subtitle2-bold|S:658f97f4ef9c2321abe4c0f257600b35dac21cc8,"
    ".platform-android/subtitle2-regular|S:56976b3ffab00680fb7ab48a2256c7d9d459e596,"
    ".platform-android/body-l1-bold|S:a20aa26a2224c658a72596cd74762025a746069f,"
    ".platform-android/body-l1-regular|S:5a6b3ea5ec493ea637d14e79786a3243f41805e2,"
    ".platform-android/body-l2-bold|S:b7cb2b46b68d3e0e520db38cce4debbd4537e600,"
    ".platform-android/body-l2-regular|S:bcca128ebfa6dfc9dd2e403f297bbbd7df3e7202,"
    ".platform-android/body-m1-bold|S:ce80aef71c2ad7f3884ba29d9bb3399c6a94e368,"
    ".platform-android/body-m1-regular|S:5dc789838c953f7da730cd0a59820a79e57075c6,"
    ".platform-android/body-m2-bold|S:c130e3c688e43468cf0d4c99274430c4cc6c1c85,"
    ".platform-android/body-m2-regular|S:3928e054d335a9f38092f55715d6b7b15de0863f,"
    ".platform-android/caption1-bold|S:6a6d30ef221f86eb253e80223cab259e640e335d,"
    ".platform-android/caption1-regular|S:e334049f03588c4a7750df02122ed1f444eb7a24,"
    ".platform-android/caption2-bold|S:7e484f5bf4b9e61bef69ce7bd74dac9ba65a7677,"
    ".platform-android/caption2-regular|S:9c95d2f7fd8e93d1570897c686fd4a29119c36f2,"
    ".platform-android/label1-bold|S:36036f8f6679d1745b0156ab370e1f98d2c4b7ff,"
    ".platform-android/label1-regular|S:de8b0877b4a45b707cc0a437fb691054afb3f188,"
    ".platform-android/label2-bold|S:7b6979bff6d4626c55b0c60fde816991c2e08753,"
    ".platform-android/label2-regular|S:9b38374f24de431409a9498b4d0ace08bbcc0945,"
    ".platform-android/label3-bold|S:9ca6c4114c3517fcf02bc0452ac23e8e796dac60,"
    ".platform-android/label3-regular|S:3942f53c45827c98c6eb75033f37dd2e6328f981,"
    ".platform-android/label4-bold|S:824db792a29f097f4fe635ee95f67e27d196884f,"
    ".platform-android/label4-regular|S:47e9ebad3c1d886fdd0450c2047f4aa224f3c04f,"
    ".platform-android/label5-bold|S:8fbe18674df2a45b6b94dc86a1b8ff341e026e2b,"
    ".platform-android/label5-regular|S:1b74596280bbc6558566901fff3f6e9f91748071,"
    ".platform-android/label6-bold|S:b99ae56ceaff605afde86afcaf47f37ad0e1d19b,"
    ".platform-android/label6-regular|S:fc5de37142c518e490c031437ac409ede4bec2f5,"
)

# 각 스타일에 대해 파일 내용 채우기
for style in "${styles[@]}"; do
    IFS='|' read -r name key <<< "$style"
    
    # 파일 이름 생성 (맨 앞의 점을 제거하고 슬래시를 하이픈으로 변환)
    filename=$(echo "$name" | sed 's/^\.//' | sed 's/\//-/g')
    
    # .mjs 파일 내용 채우기
    if [ -f "${filename}.mjs" ]; then
        echo "export const metadata = {
  \"name\": \"${name}\",
  \"key\": \"${key}\"
};" > "${filename}.mjs"
        echo "업데이트: ${filename}.mjs"
    else
        echo "파일 없음: ${filename}.mjs"
    fi
    
    # .d.ts 파일 내용 채우기
    if [ -f "${filename}.d.ts" ]; then
        echo "export declare const metadata: {
  \"name\": \"${name}\",
  \"key\": \"${key}\"
};" > "${filename}.d.ts"
        echo "업데이트: ${filename}.d.ts"
    else
        echo "파일 없음: ${filename}.d.ts"
    fi
done

echo "모든 파일 내용이 업데이트되었습니다."