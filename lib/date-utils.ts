/**
 * 日期工具函数
 * 统一日期格式，避免不同环境下的格式差异
 */

/**
 * 获取今天的日期字符串（格式：YYYY-MM-DD）
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 将日期转换为统一格式（YYYY-MM-DD）
 * 如果输入是字符串，尝试解析并转换
 */
export function normalizeDateString(date: string | Date): string {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // 如果是字符串，尝试解析
  const dateObj = new Date(date);
  if (!isNaN(dateObj.getTime())) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // 如果已经是 YYYY-MM-DD 格式，直接返回
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // 尝试解析其他格式（如 M/D/YYYY 或 YYYY/M/D）
  const parts = date.split(/[\/\-]/);
  if (parts.length === 3) {
    let year: string, month: string, day: string;
    
    // 判断格式：如果第一部分是4位数，则是 YYYY/M/D
    if (parts[0].length === 4) {
      year = parts[0];
      month = parts[1].padStart(2, '0');
      day = parts[2].padStart(2, '0');
    } else {
      // 否则是 M/D/YYYY
      month = parts[0].padStart(2, '0');
      day = parts[1].padStart(2, '0');
      year = parts[2];
    }
    
    return `${year}-${month}-${day}`;
  }
  
  // 如果无法解析，返回原字符串
  return date;
}

