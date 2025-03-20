const apiUrl = "https://2395-220-74-13-231.ngrok-free.app";

$(function() {

    // 초기화 함수
    init();
    
});


function init() {

    loadMemos();
}


$(document).on("click", ".btn_delete", function() {
    const memoId = $(this).attr("data-id");
    if(!memoId) return;

    deleteMemo(memoId);
});


// 메모로드
async function loadMemos() {

    const memoList = $("#memoList");
    memoList.empty();

    try {
        const response = await fetch(apiUrl + "/api/get-memos");
        if(response.ok) {

            const responseJson = await response.json();

            responseJson.forEach(function(ele) {
                if(ele) {
                    
                    let sHtml = "";
                    let memoId = ele.id;
                    let memoContent = ele.content;

                    sHtml += `<div class='memo-item' data-id='${memoId}'>`;
                    sHtml += `   <div class='memo-content'>${memoContent}</div>`;
                    sHtml += `   <div class='container-btn'>`;
                    sHtml += `       <button class='btn_modify' data-id='${memoId}'>수정</button>`;
                    sHtml += `       <button class='btn_delete' data-id='${memoId}'>삭제</button>`;
                    sHtml += `   </div>`;
                    sHtml += `</div>`;
                    
                    memoList.append(sHtml);
                }
            });
        }


    } catch (error) {
        alert(`메모 불러오기 실패: ${console.error(error)} ${response.statusText}`);
    }
}


// 메모저장
async function saveMemo() {
    const memoInput = document.getElementById('memo');
    const memo = memoInput.value.trim();
    if (memo) {
        try {
            const response = await fetch( apiUrl + '/api/save-memo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memo })
            });
            if (response.ok) {
                memoInput.value = '';
                loadMemos();
            }
        } catch (error) {
            alert(`메모 저장 실패: ${console.error(error)} ${response.statusText}`);
        }
    }
}





async function deleteMemo(memoId) {


        $.ajax({
            url: `${apiUrl}/api/delete-memo`,
            type: 'POST',
            data: JSON.stringify({ memoId }),
            contentType: 'application/json',
            success: function(data) {
                alert("메모가 삭제되었습니다.");
                loadMemos();
            },error: function(xhr, status, error) {
                console.error('메모 삭제 오류:', error);
                alert(`메모 삭제 중 오류 발생: ${error.message}`);
            }
        });
    // try {
    //     const response = await fetch(`${apiUrl}/api/delete-memo`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ memoId })
    //     });

    //     if (!response.ok) {
    //         const errorText = await response.text();
    //         throw new Error(`메모 삭제 실패: ${response.status} ${errorText}`);
    //     }

    //     alert("메모가 삭제되었습니다.");
    //     loadMemos(); // 삭제 후 메모 목록 다시 불러오기
    // } catch (error) {
    //     console.error('메모 삭제 오류:', error);
    //     alert(`메모 삭제 중 오류 발생: ${error.message}`);
    // }
}
