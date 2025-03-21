const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// PostgreSQL 연결
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:gxtKSiUloqcTQyWetpQmFpNntvYPeKpK@gondola.proxy.rlwy.net:10175/railway',
  ssl: { rejectUnauthorized: false }
});

// ✅ 메모 수정 라우트
router.post('/edit-memo', async (req, res) => {
  const { memoId, memoContent } = req.body;

  if (!memoId || !memoContent || memoContent.trim() === '') {
    return res.status(400).json({ error: '수정할 데이터가 없습니다.' });
  }

  try {
    await pool.query('UPDATE memos SET content = $1 WHERE id = $2', [memoContent, memoId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ 메모 수정 실패:', err);
    res.status(500).json({ error: err.message });
  }
});

// 다른 메모 관련 API도 여기에 추가 가능 (get-memos, save-memo, delete-memo 등)

module.exports = router;
