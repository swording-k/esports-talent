# 电竞天赋检测站 2.0

[中文](README.md) | [English](README.en.md)

抖音虚拟平台互动空间作品：6 项趣味挑战测试反应、手速、视野、追踪、记忆、协调能力。项目已升级为离线 HTML5 Canvas 多文件版本，适合打包为互动空间 zip 上传。

网页预览：[https://swording-k.github.io/esports-talent/](https://swording-k.github.io/esports-talent/)

## 体验方式

### 抖音扫码体验

使用抖音 App 扫描作品二维码即可进入互动空间体验。请先将抖音更新到 `38.2.0` 或以上版本；如果扫码后仍显示旧内容，可以重启抖音 App 后重新扫码。

![抖音扫码体验二维码](assets/douyin-qr.png)

### 网页预览

也可以直接打开 GitHub Pages 预览版：[https://swording-k.github.io/esports-talent/](https://swording-k.github.io/esports-talent/)

## 功能亮点

- 六维电竞能力测评：反应速度、极限手速、视野广度、动态追踪、顺序记忆、手眼协调
- 专业战术 HUD 视觉：深色背景、数据面板、低噪声动效和高对比信息层
- 移动端优先体验：动态追踪与手眼协调采用偏移跟随，减少手指遮挡
- 六维报告：汇总单项成绩、本地最佳、综合指数和能力雷达
- 本地离线存档：使用 localStorage 记录历史最好成绩与汇总档案

## 测试项目

| 测试 | 内容 | 目标能力 |
| --- | --- | --- |
| 反应速度 | 等待信号变绿后立刻点击 | 反应时间 |
| 极限手速 | 30 秒内尽可能多地点击目标 | 点击速度 |
| 视野广度 | 短时间记忆彩色圆点数量 | 观察与记忆 |
| 动态追踪 | 偏移跟随追踪移动目标 | 目标追踪 |
| 顺序记忆 | 复现方向序列 | 短时记忆 |
| 手眼协调 | 偏移滑块接住下落目标 | 操作协调 |

## 本地运行

推荐通过本地静态服务体验：

```bash
python3 -m http.server 4173
```

然后打开本机浏览器访问 `http://127.0.0.1:4173/index.html`。

## 发布方式

根目录必须包含 `index.html`。将以下文件打包为 zip 后上传：

- `index.html`
- `styles.css`
- `src/app.js`
- `assets/icon.png`

项目不依赖网络请求、外部链接、CDN、iframe 或远程资源。

## 检查命令

```bash
node tests/static-checks.mjs
node --check src/app.js
```

## 项目文档

更多产品说明见 [`项目介绍文档.md`](./项目介绍文档.md)。
