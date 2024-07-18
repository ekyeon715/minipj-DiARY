// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  increment,
  getDoc,
  collection,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정
const firebaseConfig = {
  apiKey: "AIzaSyCABiHiGzxGELpkUPOgFO_sgwI2SqUblLw",
  authDomain: "diary-be831.firebaseapp.com",
  projectId: "diary-be831",
  storageBucket: "diary-be831.appspot.com",
  messagingSenderId: "1030858653688",
  appId: "1:1030858653688:web:e25e3a5d7965126b84600d",
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const likeButton = document.getElementById("likeButton");

async function toggleHeart() {
  const userId = crypto.randomUUID(); // 로그인 없이 유니크한 사용자 ID 생성
  const postId = "seungwoo"; // 예제 포스트 ID
  const postRef = doc(db, "profile", postId); // 경로 수정
  const userLikeRef = doc(collection(postRef, "likedUsers"), userId);

  const docSnap = await getDoc(userLikeRef);
  let likeCount = 0;

  if (docSnap.exists()) {
    await deleteDoc(userLikeRef);
    await updateDoc(postRef, { likeCount: increment(-1) });
    document.getElementById("toggleImg").classList.remove("filled");
  } else {
    await setDoc(userLikeRef, {});
    await updateDoc(postRef, { likeCount: increment(1) });
    document.getElementById("toggleImg").classList.add("filled");
  }

  const postSnap = await getDoc(postRef);
  if (postSnap.exists()) {
    likeCount = postSnap.data().likeCount;
  }

  document.getElementById("likeCount").innerText = likeCount;
}

likeButton.addEventListener("click", toggleHeart); // 클릭 이벤트 리스너 추가

document.addEventListener("DOMContentLoaded", async () => {
  // DOMContentLoaded 이벤트 리스너 추가
  const postId = "seungwoo"; // 예제 포스트 ID
  const postRef = doc(db, "profile", postId); // 경로 수정
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    document.getElementById("likeCount").innerText =
      postSnap.data().likeCount || 0; // 좋아요 수 표시 코드
  }
});

// 이미지 슬라이드 기능 추가
document.addEventListener("DOMContentLoaded", () => {
  const images = ["./images/seungwoo1.jpg", "./images/seungwoo2.jpg"];
  let currentIndex = 0;
  const profileImage = document.querySelector(".profileimg");

  setInterval(() => {
    profileImage.style.opacity = 0; // 페이드 아웃

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % images.length;
      profileImage.src = images[currentIndex];
      profileImage.style.opacity = 2; // 페이드 인
    }, 1000); // 페이드 아웃 시간 (1초)과 일치시킴
  }, 3000); // 2초마다 이미지 전환
});

document.addEventListener("DOMContentLoaded", (event) => {
  const modal = document.querySelector(".modal");
  const modalOpen = document.querySelector(".modal_btn");
  const modalClose = document.querySelector(".close_btn");

  //열기 버튼을 눌렀을 때 모달팝업이 열림
  modalOpen.addEventListener("click", function () {
    //'on' class 추가
    modal.classList.add("on");
  });
  //닫기 버튼을 눌렀을 때 모달팝업이 닫힘
  modalClose.addEventListener("click", function () {
    //'on' class 제거
    modal.classList.remove("on");
  });
});
