// 🚨 여기에 당신의 Railway 도메인 주소를 넣으세요!
const URL = "https://express-memo-api-production.up.railway.app";
const API_FOLDER = "api";
const apiUrl = `${URL}/${API_FOLDER}`;

$(function () {
    init();
});


function init() {
    loadMemos();
}


// 저장 버튼 클릭 이벤트
$(document).on("click", ".btn-save", function () {

    const memoId = $(this).attr("data-id");
    const memoContent = $(this).closest(".memo-item").find(".memo-content-edit").val();
    if (!memoId || typeof memoContent === "undefined" || !$.trim(memoContent)) {
        alert("메모값 입력은 필수 입니다.");
        return;
    }

    editMemo(memoId, memoContent);
});


// 수정 버튼 클릭 이벤트
$(document).on("click", ".btn-edit", function () {
    const memoId = $(this).attr("data-id");
    if (!memoId) return;

    const memoObj = $(".memo-item[data-id='" + memoId + "']");
    memoObj.attr("data-editable", "true");

    isMemoInEditMode(memoId);
});


$(document).on("click", ".btn-cancel", function () {

    const memoId = $(this).attr("data-id");
    if (!memoId) return;

    const memoObj = $(".memo-item[data-id='" + memoId + "']");

    if(confirm("수정을 취소하시겠습니까?")) {
        memoObj.attr("data-editable", "false");
        isMemoInEditMode(memoId);
    }
   
});


// 삭제 버튼 클릭 이벤트
$(document).on("click", ".btn-delete", function () {

    const memoId = $(this).attr("data-id");
    if (!memoId) return;

    if(confirm("삭제하시겠습니까?")) {
        deleteMemo(memoId);
    }
    
});

async function isMemoInEditMode(memoId) {

    if(!memoId) return; // ✅ 'memo'가 아니라 'memoId' 체크해야 함

    const memoObj = $(".memo-item[data-id='" + memoId + "']");
    const editableFlag = memoObj.attr("data-editable");

    memoObj.find("[data-editable]").each(function(idx, ele){
        if($(ele).attr("data-editable") === "true") {
            $(ele).show();
        } else {
            $(ele).hide();
        }
    });
}



// 메모 불러오기
async function loadMemos() {
    const memoList = $("#memoList");
    memoList.empty();

    try {
        const response = await fetch(`${apiUrl}/get-memos`);
        if (!response.ok) throw new Error("서버 오류");

        const memos = await response.json();

        memos.forEach((ele) => {
            if (ele) {
                const { id, content } = ele;

                const sHtml = `
                    <div class='memo-item' data-id='${id}' data-editable='false'>
                        <div class='container-content'>
                            <div class='memo-content' data-id='${id}' data-editable='false'></div>
                            <textarea class='memo-content-edit' value='${content}' data-id='${id}' data-editable='true' hidden></textarea>
                        </div>
                        <div class='container-btn'>
                            <button class='btn-save' data-id='${id}' data-editable='true' hidden>저장</button>
                            <button class='btn-cancel' data-id='${id}' data-editable='true' hidden>취소</button>
                            <button class='btn-edit' data-id='${id}' data-editable='false'>수정</button>
                            <button class='btn-delete' data-id='${id}' data-editable='false'>삭제</button>
                        </div>
                    </div>
                `;

                memoList.append(sHtml);
                memoList.find(".memo-content[data-id='" + id + "']").html(content);
                memoList.find(".memo-content-edit[data-id='" + id + "']").html(content);
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
    const memo = memoInput.val().trim();
    if (!memo) return;

    try {
        const response = await fetch(`${apiUrl}/save-memo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memo }),
        });

        if (!response.ok) throw new Error("서버 응답 오류");

        memoInput.val("");
        loadMemos();
    } catch (error) {
        console.error("메모 저장 실패:", error);
        alert("❌ 메모 저장에 실패했습니다.");
    }
}


async function editMemo(memoId, memoContent) {

    let params = {};
    params.memoId = memoId;
    params.memoContent = memoContent;

    $.ajax({
        url: `${apiUrl}/edit-memo`,
        type: "POST",
        contentType: "application/json", // ✅ 서버가 JSON을 받도록 지정
        data: JSON.stringify(params),
        success: function (response) {
            alert("✅ 메모가 수정되었습니다.");
            loadMemos();
        },
        error: function (error) {
            console.error("메모 수정 실패:", error);
            alert("❌ 메모 수정에 실패했습니다.");
        },
    });
}


// 메모 삭제
async function deleteMemo(memoId) {
    try {
        const response = await fetch(`${apiUrl}/delete-memo`, {
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
