const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// 📌 SQLite 데이터베이스 연결
const db = new sqlite3.Database('./memos.db', (err) => {
    if (err) console.error('❌ SQLite 연결 실패:', err.message);
    else console.log('✅ SQLite 연결 성공');
});

// 📌 메모 저장 API (POST 요청)
router.post('/save-memo', (req, res) => {
    const { memo } = req.body;
    if (!memo) return res.status(400).json({ error: '메모 내용이 없습니다.' });

    db.run('INSERT INTO memos (content) VALUES (?)', [memo], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.sendStatus(200);
    });
});

// 📌 저장된 메모 불러오기 API (GET 요청)
router.get('/get-memos', (req, res) => {
    db.all('SELECT * FROM memos ORDER BY id DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 📌 특정 메모 삭제 API (DELETE 요청)
router.delete('/delete-memo/:id', (req, res) => {
    const memoId = req.params.id;
    db.run('DELETE FROM memos WHERE id = ?', [memoId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.sendStatus(200);
    });
});

// 📌 특정 메모 수정 API (PUT 요청)
router.put('/update-memo/:id', (req, res) => {
    const memoId = req.params.id;
    const { content } = req.body;
    db.run('UPDATE memos SET content = ? WHERE id = ?', [content, memoId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.sendStatus(200);
    });
});

module.exports = router;
