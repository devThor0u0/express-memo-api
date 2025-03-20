const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // ← CORS 추가
const router = require('./routes/memoRoutes');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// 🚀 CORS 허용 (특정 도메인 허용 가능)
app.use(cors({
    origin: '*',  // 모든 도메인에서 요청 가능 (보안 강화 필요 시 특정 도메인만 허용)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api', router);

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('./memos.db', (err) => {
    if (err) console.error('❌ SQLite 연결 실패:', err.message);
    else console.log('✅ SQLite 연결 성공');
});



router.get('/get-memos', (req, res) => {
    db.all('SELECT * FROM memos ORDER BY id DESC', [], (err, rows) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }

        res.json(rows);
    });
});


// 메모저장 API (POST 요청)
router.post('/save-memo', (req, res) => {
    const {memo} = req.body;
    if(!memo) {
        return res.status(400).json({error: '메모 내용이 없습니다.'});
    } 

    db.run('INSERT INTO memos (content) values (?)', [memo], function(err) {
        if(err) {
            return res.status(500).json({error: err.message});
        }

        res.sendStatus(200);
    });
});


// 메모삭제 API
router.post('/delete-memo', (req, res) => {
    const { memoId } = req.body; // ✅ 요청에서 memoId 추출

    if (!memoId) {
        return res.status(400).json({ error: '메모 ID가 없습니다.' });
    }

    db.run('DELETE FROM memos WHERE id = ?', [memoId], function (err) { // ✅ 매개변수를 배열로 전달
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.sendStatus(200);
    });
});



// 서버 실행
app.listen(3000, () => console.log('🚀 Server running on port 3000'));
