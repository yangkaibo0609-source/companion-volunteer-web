# 陪护志愿者

一篇面向数据新闻比赛的互动叙事网页，关注心智障碍儿童及其家庭身边的志愿者：

> 照亮他人的人，谁来照亮他们？

项目以一天陪护文字互动为入口，依次呈现陪护结算、数据黑板、访谈故事票根与主题收束。数据部分使用吊挂黑板交互，真实故事以可抽取的照片票根展开。

## 在线体验

[https://companion-volunteer-story.netlify.app](https://companion-volunteer-story.netlify.app)

## 技术栈

- React 19 + TypeScript + Vite
- Three.js
- Zustand
- D3、GSAP、Howler

## 本地运行

```bash
npm install
npm run dev
```

构建与检查：

```bash
npm run lint
npm run build
```

## 内容说明

- 数据黑板文本依据项目文稿进行删减与拆分。
- 访谈票根中的故事内容来自项目访谈材料。
- 部分数据存在不同统计口径，具体记录见 `DATA_CONFLICTS.md`。

## 部署

项目通过 Netlify 持续部署，构建命令为 `npm run build`，发布目录为 `dist`。
