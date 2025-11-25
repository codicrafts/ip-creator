const cloud = require('wx-server-sdk');

// 初始化云环境
cloud.init({
  env: 'cloudbase-5gqcz0ab010d3288'
});

const db = cloud.database();

/**
 * 用户信息管理
 */
exports.main = async (event, context) => {
  const { userId, action, increment, userTier } = event;
  
  try {
    if (!userId) {
      return {
        success: false,
        message: '用户ID不能为空'
      };
    }
    
    const today = new Date().toLocaleDateString();
    
    if (action === 'getInfo') {
      // 获取用户信息
      const result = await db.collection('users')
        .doc(userId)
        .get();
      
      if (!result.data) {
        return {
          success: false,
          message: '用户不存在'
        };
      }
      
      const user = result.data;
      
      // 检查是否需要重置每日使用量
      let sceneUsage = user.sceneUsage || { date: today, count: 0 };
      let memeUsage = user.memeUsage || { date: today, count: 0 };
      
      if (sceneUsage.date !== today) {
        sceneUsage = { date: today, count: 0 };
      }
      if (memeUsage.date !== today) {
        memeUsage = { date: today, count: 0 };
      }
      
      return {
        success: true,
        data: {
          userId: user._id,
          phone: user.phone,
          userTier: user.userTier || 'FREE',
          sceneUsage: sceneUsage,
          memeUsage: memeUsage
        }
      };
    } else if (action === 'updateSceneUsage') {
      // 更新场景扩展使用次数
      const userResult = await db.collection('users')
        .doc(userId)
        .get();
      
      if (!userResult.data) {
        return {
          success: false,
          message: '用户不存在'
        };
      }
      
      const user = userResult.data;
      let sceneUsage = user.sceneUsage || { date: today, count: 0 };
      
      // 如果日期不同，重置计数
      if (sceneUsage.date !== today) {
        sceneUsage = { date: today, count: increment || 1 };
      } else {
        sceneUsage.count = (sceneUsage.count || 0) + (increment || 1);
      }
      
      await db.collection('users')
        .doc(userId)
        .update({
          data: {
            sceneUsage: sceneUsage,
            updatedAt: new Date()
          }
        });
      
      return {
        success: true,
        data: {
          sceneUsage: sceneUsage
        }
      };
    } else if (action === 'updateMemeUsage') {
      // 更新表情包制作使用次数
      const userResult = await db.collection('users')
        .doc(userId)
        .get();
      
      if (!userResult.data) {
        return {
          success: false,
          message: '用户不存在'
        };
      }
      
      const user = userResult.data;
      let memeUsage = user.memeUsage || { date: today, count: 0 };
      
      // 如果日期不同，重置计数
      if (memeUsage.date !== today) {
        memeUsage = { date: today, count: increment || 1 };
      } else {
        memeUsage.count = (memeUsage.count || 0) + (increment || 1);
      }
      
      await db.collection('users')
        .doc(userId)
        .update({
          data: {
            memeUsage: memeUsage,
            updatedAt: new Date()
          }
        });
      
      return {
        success: true,
        data: {
          memeUsage: memeUsage
        }
      };
    } else if (action === 'updateTier') {
      // 更新用户会员等级
      await db.collection('users')
        .doc(userId)
        .update({
          data: {
            userTier: userTier,
            updatedAt: new Date()
          }
        });
      
      const userResult = await db.collection('users')
        .doc(userId)
        .get();
      
      const user = userResult.data;
      
      return {
        success: true,
        data: {
          userId: user._id,
          phone: user.phone,
          userTier: user.userTier,
          sceneUsage: user.sceneUsage || { date: today, count: 0 },
          memeUsage: user.memeUsage || { date: today, count: 0 }
        }
      };
    } else {
      return {
        success: false,
        message: '未知操作'
      };
    }
  } catch (error) {
    console.error('User service error:', error);
    return {
      success: false,
      message: error.message || '操作失败'
    };
  }
};

