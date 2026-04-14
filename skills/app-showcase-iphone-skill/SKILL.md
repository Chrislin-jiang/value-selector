---
name: app-showcase-iphone-skill
version: 1.0.0
description: "生成移动端应用页面预览页面（带 iPhone 框架展示）。当用户需要生成 app 预览页面、手机页面展示、iPhone 模拟器展示时使用。"
metadata:
  requires:
    bins: []
---

# 📱 移动端预览页面生成器

## 功能说明

基于 `template.html` 模板生成 HTML 预览页面，以 iPhone 16 Pro 框架展示移动端应用的多个页面。支持深色/浅色模式切换。

## 核心文件

| 文件 | 说明 |
|------|------|
| `template.html` | 预览页面模板，包含完整的 iPhone 框架样式和交互逻辑 |
| `SKILL.md` | 本说明文件 |

## 使用方式

### 交互式对话

```
用户：生成预览页面
Skill：请提供以下信息：
  1. 应用名称（如：念头解绑）
  2. Logo 图片路径或 Emoji（如：/favicon.svg 或 🫧）
  3. 需要展示的页面列表，格式：路径 | 标题 | 描述
  4. 基础 URL（如：http://localhost:5173）
Skill：基于 template.html 生成 preview.html 文件
```

### 示例输入

```
应用名称：念头解绑
Logo：🫧
主题色：#00f0ff
RGB主题色：0, 240, 255
页面：
  /#/space | 念头空间 | 记录、分类与解绑念头
  /#/journal | 觉察日志 | 回顾你的觉察旅程
  /#/lab | 解钩实验室 | 创意练习与角色扮演
  /#/night | 夜间模式 | 在星光下安然入睡
基础 URL：http://localhost:5173
```

### 颜色配置说明

模板使用占位符表示颜色，生成时需要替换以下变量：

| 占位符 | 说明 | 浅色模式示例 | 深色模式示例 |
|--------|------|-------------|-------------|
| `{BG_START}` | 背景起始色 | `#f8fafb` | `#0f0f1a` |
| `{BG_END}` | 背景结束色 | `#eef2f5` | `#1a1a2e` |
| `{TEXT_PRIMARY}` | 主文字色 | `#1a1a2e` | `#ffffff` |
| `{TEXT_SECONDARY}` | 次要文字色 | `#6b7280` | `#9ca3af` |
| `{TEXT_TERTIARY}` | 辅助文字色 | `#9ca3af` | `#6b7280` |
| `{FRAME_BG}` | 手机框架背景 | `#1a1a2e` | `#2a2a3e` |
| `{FRAME_ACCENT}` | 框架装饰色 | `#2a2a3e` | `#3a3a4e` |
| `{CARD_SHADOW}` | 卡片阴影 | `rgba(0,0,0,0.15)` | `rgba(0,0,0,0.4)` |
| `{ACCENT_COLOR}` | 主题强调色 | `#5EBDAB` | `#5EBDAB` |
| `{ACCENT_COLOR_RGB}` | 主题色 RGB 值 | `94, 189, 171` | `94, 189, 171` |

## 生成的文件

`preview.html` - 基于 `template.html` 生成，包含以下功能：

| 功能 | 说明 |
|------|------|
| 📱 iPhone 16 Pro 框架 | 逼真的手机外框 + 侧边按钮 + 灵动岛 |
| 🌙 深色/浅色模式 | 右上角切换按钮，自动记忆偏好 |
| ⏰ 动态状态栏 | 实时时间、信号强度、WiFi、电量图标 |
| 📐 自适应缩放 | scale(0.6567) 使 402×874 屏幕适配框架 |
| 📱 响应式设计 | 移动端适配，小屏幕自动调整 |
| 🎨 加载动画 | 页面加载中显示 spinner |
| ✨ 悬停效果 | 卡片悬停时上浮并增强光晕 |

## 模板特性

### iOS 风格元素

- **灵动岛**：62×16px 黑色圆角矩形
- **状态栏**：时间、信号格（4格）、WiFi、电量
- **圆角屏幕**：30px border-radius
- **侧边按钮**：音量键、静音键装饰（::before / ::after）

### 主题切换

```javascript
// 读取保存的主题偏好
const savedTheme = localStorage.getItem('preview-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

// 切换时向 iframe 发送消息以同步主题
document.querySelectorAll('iframe').forEach(iframe => {
    iframe.contentWindow?.postMessage({ type: 'theme-toggle', isDark: newTheme === 'dark' }, '*');
});
```

### 页面配置格式

```javascript
const pages = [
    { 
        path: "/#/space",     // 路由路径
        title: "念头空间",     // 页面标题
        desc: "记录与解绑"      // 页面描述
    },
    // ...更多页面
];
```

## 交互流程

1. **询问基本信息**
   - 应用名称
   - Logo（图片路径或 Emoji）
   - 基础 URL

2. **询问页面列表**
   - 每个页面：路径、标题、描述

3. **基于模板生成**
   - 读取 `template.html` 内容
   - 替换占位符：`{APP_NAME}`、`{LOGO_PATH}`、`{SUBTITLE}`、`{BASE_URL}`、`{PAGES_JSON}`
   - 生成 `preview.html`

4. **交付说明**
   - 告知用户文件位置
   - 说明启动应用的方式

## 输出文件

生成的 `preview.html` 保存在用户当前工作目录。

---

## 👤 用户使用说明

### 开发者使用

**前提条件：**

- 你的应用已启动运行（如 `npm run dev`）

**使用步骤：**

1. **激活 Skill**  
   在对话中输入："生成预览页面"

2. **提供信息**  
   Skill 会询问以下内容：
   - 应用名称
   - Logo（图片路径或 Emoji）
   - 页面列表：路由路径 | 标题 | 描述
   - 基础 URL

3. **自动生成**  
   Skill 基于 `template.html` 自动生成 `preview.html`

4. **预览**  
   - 在浏览器中打开 `preview.html`
   - 或在 IDE 中右键 → Open In Browser

### 小白用户使用

**前提条件：**
- 只需要一个浏览器（Safari 或 Chrome）

**使用步骤：**

1. **打开文件**  
   - 找到 `preview.html` 文件，双击在浏览器中打开
   - 或在 IDE 中右键点击 → Open In Browser

2. **查看预览**  
   - 自动显示多个 iPhone 框架页面
   - 每个框架内显示一个页面
   - 显示加载动画直到 iframe 内容加载完成

3. **切换主题**  
   - 点击右上角 ☀️/🌙 按钮切换深色/浅色模式
   - 偏好自动保存到 localStorage

4. **体验完整应用**  
   - 点击底部"打开完整应用 →"链接
   - 确保应用已启动

---

## 📦 交付物说明

生成的预览页面包含以下文件：

| 文件 | 说明 | 适用人群 |
|------|------|----------|
| `preview.html` | 预览页面主文件 | 所有人 |

**无需安装任何依赖**，双击即可在浏览器中查看。

---

## ❓ 常见问题

| 问题 | 解答 |
|------|------|
| 预览页面显示空白？ | 确保应用已启动（运行 `npm run dev`） |
| 页面加载很慢？ | 等待 loading 动画消失，iframe 懒加载中 |
| 想添加新页面？ | 修改 `pages` 数组配置 |
| 如何分享给其他人？ | 截图或者录屏分享 |

---

## 🔧 自定义配置

如需修改预览页面，编辑 `preview.html` 中的以下内容：

```javascript
// 1. 页面列表
const pages = [
    { path: "/", title: "首页", desc: "描述" },
    { path: "/about", title: "关于", desc: "介绍页" },
    // 添加更多页面...
];

// 2. 基础 URL
const BASE_URL = 'http://localhost:5173';

// 3. 应用信息（在 HTML 中搜索修改）
<h1>念头解绑</h1>
<p class="subtitle">Thought Unhook</p>

// 4. Logo（在 HTML 中搜索修改）
<div class="logo">🫧</div>  // 或 <img src="..." />
```

---

## 🎨 样式变量

模板使用 CSS 变量管理主题：

```css
:root {
    --bg-start: #0a0a12;          /* 背景起始色 */
    --bg-end: #12121a;           /* 背景结束色 */
    --text-primary: #e0e8f0;     /* 主文字色 */
    --text-secondary: #8892a0;   /* 次要文字色 */
    --frame-bg: #1a1a24;         /* 手机框架背景 */
    --accent: #3766F0;           /* 强调色/光晕色 */
}

[data-theme="light"] {
    --bg-start: #f8fafb;
    --bg-end: #eef2f5;
    --text-primary: #1a1a2e;
    --frame-bg: #1a1a2e;
    /* ... */
}
```
