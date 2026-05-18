import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateData } from '../src/data/validate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readJSON = (relPath) => {
  const absolutePath = path.resolve(__dirname, '..', relPath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
};

console.log('\x1b[36m%s\x1b[0m', '🔍 正在验证 Advisor Explorer 核心数据文件 (professors.json, directions.json, quiz.json, roadmap.json)...');

try {
  const professors = readJSON('src/data/professors.json');
  const directions = readJSON('src/data/directions.json');
  const quiz = readJSON('src/data/quiz.json');
  const roadmap = readJSON('src/data/roadmap.json');

  const errors = validateData({ professors, directions, quiz, roadmap });

  if (errors.length > 0) {
    console.error('\n\x1b[31m%s\x1b[0m', `❌ 数据验证失败！共发现 ${errors.length} 处格式或引用一致性问题：`);
    errors.forEach((err, idx) => {
      console.error(`  ${idx + 1}. \x1b[33m${err}\x1b[0m`);
    });
    console.log('\n\x1b[35m%s\x1b[0m', '💡 提示：请对照上面的报错信息修改对应的 JSON 配置文件。');
    process.exit(1);
  } else {
    console.log('\n\x1b[32m%s\x1b[0m', '✅ 验证成功！所有导师档案、学派方向、测评权重以及路线图配置完全合法且交叉引用一致！');
    process.exit(0);
  }
} catch (e) {
  console.error('\x1b[31m%s\x1b[0m', '💥 验证脚本执行中发生未知崩溃，请检查 JSON 文件是否有语法错误：');
  console.error(e);
  process.exit(1);
}
