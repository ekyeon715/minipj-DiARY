// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, query, orderBy, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
        'timestamp': date.getTime() // 시간 정렬순 타임스탬프
      };
      await addDoc(collection(db, "comment"), docData);
      alert('발자취를 남겼습니다 :)');
      window.location.reload();
    });
  });
  

  // 입력된 데이터 HTML로 불러오기
  async function loadComments() {
    const q = query(collection(db, "comment"), orderBy("timestamp", "asc")); // 타임스탬프 기준으로 재정렬
    const querySnapshot = await getDocs(q);
  
    $('#comments').empty(); // 기존 댓글 비우기
    $('#count').text(querySnapshot.size); // 댓글 갯수 업데이트
  
    querySnapshot.forEach((doc) => {
      let row = doc.data();
      let comment = row['comment'];
      let time = row['time'];
      let user = row['user']
      let id = doc.id;
  
      let comment_html = `            
          <div class="eachComment" id="${id}">
            <div class="name">${user}</div>
              <span class="inputValue">${comment} <button class="deleteComment" data-id="${id}" data-comment="${comment}">삭제</button></span>
              <div class="time">${time}</div>
          </div>`;
      $('#comments').prepend(comment_html); // 최신 댓글이 위로 올라오도록 prepend 사용
    });
  
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