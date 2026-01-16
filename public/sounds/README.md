# 提示音资源

## 文件说明

需要在此目录放置以下音频文件：

### step-complete.mp3
- **用途**: 每个冲煮步骤完成时的提示音
- **时长**: 1-2秒
- **大小**: < 50KB
- **格式**: MP3
- **音量**: 适中，不刺耳
- **建议**: 柔和的叮咚声或铃声

## 临时解决方案

在没有音频文件的情况下，应用会：
1. 捕获播放错误（不会中断应用）
2. 仅使用振动反馈（如果设备支持）
3. 控制台显示警告信息

## 如何添加音频

1. 准备符合上述规格的 MP3 文件
2. 命名为 `step-complete.mp3`
3. 放置在 `public/sounds/` 目录
4. 重启开发服务器

## 在线资源

可以从以下网站获取免费音效：
- https://freesound.org/
- https://mixkit.co/free-sound-effects/
- https://soundbible.com/

搜索关键词：notification, bell, ding, chime
