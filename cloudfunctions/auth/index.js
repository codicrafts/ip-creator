const cloud = require('wx-server-sdk');

// 初始化云环境
cloud.init({
  env: 'cloudbase-5gqcz0ab010d3288'
});

const db = cloud.database();

/**
 * 用户登录
 */
exports.main = async (event, context) => {
  const { phone, password, action } = event;
  
  try {
    if (action === 'login') {
      // 登录
      const result = await db.collection('users')
        .where({
          phone: phone,
          password: password // 实际生产环境应该使用加密密码
        })
        .get();
      
      if (result.data.length === 0) {
        return {
          success: false,
          message: '手机号或密码错误'
        };
      }
      
      const user = result.data[0];
      return {
        success: true,
        data: {
          userId: user._id,
          phone: user.phone,
          userTier: user.userTier || 'FREE',
          sceneUsage: user.sceneUsage || { date: new Date().toLocaleDateString(), count: 0 },
          memeUsage: user.memeUsage || { date: new Date().toLocaleDateString(), count: 0 }
        }
      };
    } else if (action === 'register') {
      // 注册
      // 检查手机号是否已存在
      const existResult = await db.collection('users')
        .where({
          phone: phone
        })
        .get();
      
      if (existResult.data.length > 0) {
        return {
          success: false,
          message: '该手机号已注册'
        };
      }
      
      // 创建新用户
      const today = new Date().toLocaleDateString();
      const newUser = {
        phone: phone,
        password: password, // 实际生产环境应该加密
        userTier: 'FREE',
        sceneUsage: { date: today, count: 0 },
        memeUsage: { date: today, count: 0 },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const addResult = await db.collection('users').add({
        data: newUser
      });
      
      return {
        success: true,
        data: {
          userId: addResult._id,
          phone: newUser.phone,
          userTier: newUser.userTier,
          sceneUsage: newUser.sceneUsage,
          memeUsage: newUser.memeUsage
        }
      };
    } else {
      return {
        success: false,
        message: '未知操作'
      };
    }
  } catch (error) {
    console.error('Auth error:', error);
    return {
      success: false,
      message: error.message || '操作失败'
    };
  }
};

