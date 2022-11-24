# gatsby-plugin-seed-design

> gatsby에서 seed-design을 사용할 수 있어요. (다크모드, stylesheet 지원)

## 설치

```console
$ npm install gatsby-plugin-seed-design 
$ yarn add gatsby-plugin-seed-design
```

## 사용법

```js
// gatsby-config 파일에 설정을 넣어줘야해요.
module.exports = {
  ...,
  plugins: [
		// your plugins...,
    "gatsby-plugin-seed-design",
	]
}

// 혹은
module.exports = {
  ...,
  plugins: [
		// your plugins...,
		{
			resolve: "gatsby-plugin-seed-design",
			options: {
				mode: "light-only" // "auto" (default) | "dark-only" | "light-only"
			},
		}
	]
}
```
