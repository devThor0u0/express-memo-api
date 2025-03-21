const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL 모듈

const app = express();
const port = process.env.PORT || 3000;

// ✅ PostgreSQL 연결
const pool = new Pool({
  connectionString: 'postgresql://postgres:gxtKSiUloqcTQyWetpQmFpNntvYPeKpK@gondola.proxy.rlwy.net:10175/railway',
  ssl: { rejectUnauthorized: false }
});

// ✅ 미들웨어
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());
app.use(express.static('public'));
// ✅ "/api"로 시작하는 요청만 memoRoutes에서 처리


// 그 외 요청은 404 처리
app.use((req, res) => {
    res.status(404).send('Not Found');
});


// ✅ 메모 불러오기
app.get('/api/get-memos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM memos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ 메모 불러오기 실패:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 메모 저장
app.post('/api/save-memo', async (req, res) => {
  const { memo } = req.body;
  if (!memo) {
    return res.status(400).json({ error: '메모 내용이 없습니다.' });
  }

  try {
    await pool.query('INSERT INTO memos (content) VALUES ($1)', [memo]);
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ 메모 저장 실패:', err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 메모 수정
app.post('/api/edit-memo', async (req, res) => {

    var params = JSON.parse(req.params);

    if(params.length <= 0){
        return res.status(400).json({ error: '수정할 객체 없습니다.' });

    } else {
        

            for(var i=0, j=params.length; i < j; i++) {

                var memoId = params[i].memoId;
                var memoContent = params[i].memoContent;

                if(!memoId || !memoContent || $.trim(memoContent) == "") {
                    return  res.status(400).json({ error: '수정할 데이터가 없습니다.' });
                } else {
                    try {
                        await pool.query('UPDATE memos SET content = $1 WHERE id = $2', [memoContent, memoId]);
                        res.sendStatus(200);
                    } catch(error) {
                        console.error('❌ 메모 수정 실패:', err);
                        res.status(500).json({ error: err.message });
                    }
                }
            }

        
    }
});


// ✅ 메모 삭제
app.post('/api/delete-memo', async (req, res) => {
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

// ✅ 서버 시작
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
