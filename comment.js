// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, increment, query, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCABiHiGzxGELpkUPOgFO_sgwI2SqUblLw",
  authDomain: "diary-be831.firebaseapp.com",
  projectId: "diary-be831",
  storageBucket: "diary-be831.appspot.com",
  messagingSenderId: "1030858653688",
  appId: "1:1030858653688:web:e25e3a5d7965126b84600d"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 입력한 데이터 Firebase 넘기기
$(document).ready(function () {
  loadComments();

  $("#submit").click(async function () {
    let comment = $('#comment-input').val();
    let user = $('#user-input').val();

    let date = new Date();
    let year = ('0' + date.getFullYear()).slice(-2);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let wDate = ('0' + date.getDate()).slice(-2);
    let hour = ('0' + date.getHours()).slice(-2);
    let min = ('0' + date.getMinutes()).slice(-2);
    let sec = ('0' + date.getSeconds()).slice(-2);
    let usertime = year + '-' + month + '-' + wDate + ' ' + hour + ':' + min + ':' + sec;

    let docData = {
      'user': user,
      'comment': comment,
      'time': usertime,
      'timestamp': date.getTime(), // 시간 정렬순 타임스탬프
      'likeCount': 0 // 초기 좋아요 수
    };
    await addDoc(collection(db, "comment"), docData);
    alert('발자취를 남겼습니다 :)');
    window.location.reload();
  });
});


// 입력된 데이터 HTML로 불러오기
async function loadComments() {
  const cmtdb = query(collection(db, "comment"), orderBy("timestamp", "asc")); // 타임스탬프 기준으로 재정렬
  const commentdb = await getDocs(cmtdb);

  $('#comments').empty(); // 기존 댓글 비우기
  $('#count').text(commentdb.size); // 댓글 갯수 업데이트

  commentdb.forEach((doc) => {
    let row = doc.data();
    let comment = row['comment'];
    let time = row['time'];
    let user = row['user']
    let id = doc.id;
    let likeCount = row['likeCount'] || 0;

    let comment_html = `            
        <div class="eachComment" id="${id}">
          <div> 
          <div class="name">${user}</div>
              <span class="inputValue">${comment}</span>
              <div class="time">${time}</div>
          </div>
          <div class="buttons">
          <div style="margin-right:20%">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="likeheart" data-id="${id}" style="cursor: pointer;">
          <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"/></svg>
           <span id="likeCount-${id}">${likeCount}</span>
          </div>
          <button class="deleteComment" data-id="${id}" data-comment="${comment}">삭제</button>
          </div>
      </div>`;
    $('#comments').prepend(comment_html); // 최신 댓글이 위로 올라오도록 prepend 사용
  });

  $('.likeheart').click(async function () {
    let id = $(this).data('id');
    await incrementLikeCount(id);
  });

  // 좋아요 증가 함수
  async function incrementLikeCount(commentId) {
    const commentRef = doc(db, "comment", commentId);

    // 좋아요 수 증가
    await updateDoc(commentRef, { likeCount: increment(1) });

    // 업데이트된 좋아요 수 가져오기
    const commentSnap = await getDoc(commentRef);
    if (commentSnap.exists()) {
      const likeCount = commentSnap.data().likeCount;
      document.getElementById(`likeCount-${commentId}`).innerText = likeCount;
    }
  }

  // 삭제 버튼 이벤트
  $('.deleteComment').click(async function () {
    let id = $(this).data('id');
    let comment = $(this).data('comment');

    let confirmation = confirm(`"${comment}" 해당 댓글을 삭제하시겠습니까?`);
    if (confirmation) {
      await deleteDoc(doc(db, "comment", id));
      alert('댓글이 삭제되었습니다.');
      window.location.reload();
    }
  });
}
