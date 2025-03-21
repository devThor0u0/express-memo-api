const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// ✅ PostgreSQL 연결
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:gxtKSiUloqcTQyWetpQmFpNntvYPeKpK@gondola.proxy.rlwy.net:10175/railway',
  ssl: { rejectUnauthorized: false }
});


// ✅ 1. 메모 목록 불러오기
router.get('/get-memos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM memos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ 메모 불러오기 실패:', err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 2. 메모 저장
router.post('/save-memo', async (req, res) => {
  const { memo } = req.body;

  if (!memo || memo.trim() === '') {
    return res.status(400).json({ error: '메모 내용이 없습니다.' });
  }

  try {
    await pool.query('INSERT INTO memos (content) VALUES ($1)', [memo.trim()]);
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ 메모 저장 실패:', err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 3. 메모 수정
router.post('/edit-memo', async (req, res) => {
  const { memoId, memoContent } = req.body;

  if (!memoId || !memoContent || memoContent.trim() === '') {
    return res.status(400).json({ error: '수정할 데이터가 없습니다.' });
  }

  try {
    await pool.query('UPDATE memos SET content = $1 WHERE id = $2', [memoContent.trim(), memoId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ 메모 수정 실패:', err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 4. 메모 삭제
router.post('/delete-memo', async (req, res) => {
  const { memoId } = req.body;

  if (!memoId) {
    return res.status(400).json({ error: '메모 ID가 없습니다.' });
  }

  try {
    await pool.query('DELETE FROM memos WHERE id = $1', [memoId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ 메모 삭제 실패:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
