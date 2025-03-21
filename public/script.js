// 🚨 여기에 당신의 Railway 도메인 주소를 넣으세요!
const apiUrl = "https://express-memo-api-production.up.railway.app";

$(function () {
    init();
});

function init() {
    loadMemos();
}

// 삭제 버튼 클릭 이벤트
$(document).on("click", ".btn_delete", function () {
    const memoId = $(this).attr("data-id");
    if (!memoId) return;
    deleteMemo(memoId);
});

// 메모 불러오기
async function loadMemos() {
    const memoList = $("#memoList");
    memoList.empty();

    try {
        const response = await fetch(`${apiUrl}/api/get-memos`);
        if (!response.ok) throw new Error("서버 오류");

        const memos = await response.json();

        memos.forEach((ele) => {
            if (ele) {
                const { id, content } = ele;

                const sHtml = `
                    <div class='memo-item' data-id='${id}'>
                        <div class='memo-content'>${content}</div>
                        <div class='container-btn'>
                            <button class='btn_modify' data-id='${id}'>수정</button>
                            <button class='btn_delete' data-id='${id}'>삭제</button>
                        </div>
                    </div>
                `;

                memoList.append(sHtml);
            }
        });
    } catch (error) {
        console.error("메모 불러오기 실패:", error);
        alert("❌ 메모를 불러오는 데 실패했습니다.");
    }
}

// 메모 저장
async function saveMemo() {
    const memoInput = document.getElementById("memo");
    const memo = memoInput.value.trim();
    if (!memo) return;

    try {
        const response = await fetch(`${apiUrl}/api/save-memo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memo }),
        });

        if (!response.ok) throw new Error("서버 응답 오류");

        memoInput.value = "";
        loadMemos();
    } catch (error) {
        console.error("메모 저장 실패:", error);
        alert("❌ 메모 저장에 실패했습니다.");
    }
}

// 메모 삭제
async function deleteMemo(memoId) {
    try {
        const response = await fetch(`${apiUrl}/api/delete-memo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memoId }),
        });

        if (!response.ok) throw new Error(`서버 응답 오류 (${response.status})`);

        alert("🗑️ 메모가 삭제되었습니다.");
        loadMemos();
    } catch (error) {
        console.error("메모 삭제 실패:", error);
        alert("❌ 메모 삭제에 실패했습니다.");
    }
}
