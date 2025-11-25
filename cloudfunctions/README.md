# 微信云开发云函数

本目录包含使用 wx-server-sdk 的云函数代码。

## 云环境配置

- 云环境ID: `cloudbase-5gqcz0ab010d3288`

## 云函数列表

### 1. auth - 用户认证
- **功能**: 处理用户登录和注册
- **调用方式**: 
  - 登录: `{ action: 'login', phone: 'xxx', password: 'xxx' }`
  - 注册: `{ action: 'register', phone: 'xxx', password: 'xxx' }`

### 2. user - 用户信息管理
- **功能**: 获取用户信息、更新使用次数、更新会员等级
- **调用方式**:
  - 获取用户信息: `{ action: 'getInfo', userId: 'xxx' }`
  - 更新场景扩展使用次数: `{ action: 'updateSceneUsage', userId: 'xxx', increment: 1 }`
  - 更新表情包制作使用次数: `{ action: 'updateMemeUsage', userId: 'xxx', increment: 1 }`
  - 更新会员等级: `{ action: 'updateTier', userId: 'xxx', userTier: 'PREMIUM' }`

## 数据库集合

### users 集合结构
```javascript
{
  _id: String,              // 用户ID
  phone: String,            // 手机号
  password: String,         // 密码（应加密存储）
  userTier: String,         // 会员等级: 'FREE' | 'PREMIUM'
  sceneUsage: {             // 场景扩展使用次数
    date: String,           // 日期: 'YYYY-MM-DD'
    count: Number           // 使用次数
  },
  memeUsage: {              // 表情包制作使用次数
    date: String,           // 日期: 'YYYY-MM-DD'
    count: Number           // 使用次数
  },
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

## 部署说明

1. 在微信开发者工具中打开项目
2. 右键点击 `cloudfunctions/auth` 文件夹，选择"上传并部署：云端安装依赖"
3. 右键点击 `cloudfunctions/user` 文件夹，选择"上传并部署：云端安装依赖"
4. 在云开发控制台创建 `users` 集合

## 注意事项

- 生产环境应该对密码进行加密存储（如使用 bcrypt）
- 建议添加索引以提高查询性能
- 建议添加数据验证规则

