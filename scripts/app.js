const $ = document;
const startBtn = $.getElementById("start_btn");
const statsBtn = $.getElementById("stats_btn");
const aboutBtn = $.getElementById("about_btn");
const newsBtn = $.getElementById("news_btn");
const goToTimerPageBtn = $.querySelector(".start_modal .submit_btn");
const signIntoNewsPaperBtn = $.querySelector(".news_modal .submit_btn");

function showStartModal() {
  const startModal = $.querySelector(".start_modal");
  const overlay = $.querySelector(".overlay");
  const modalCloseBtn = $.querySelector(".start_modal .close_span");
  startModal.classList.add("visible_modal");
  overlay.classList.add("visible_overlay");

  modalCloseBtn.addEventListener("click", hideStartModal);
  overlay.addEventListener("click", hideStartModal);
}
function hideStartModal() {
  const startModal = $.querySelector(".start_modal");
  const overlay = $.querySelector(".overlay");
  startModal.classList.remove("visible_modal");
  overlay.classList.remove("visible_overlay");
}
function showNewsModal() {
  const startModal = $.querySelector(".news_modal");
  const overlay = $.querySelector(".overlay");
  const modalCloseBtn = $.querySelector(".news_modal .close_span");
  startModal.classList.add("visible_modal");
  overlay.classList.add("visible_overlay");

  modalCloseBtn.addEventListener("click", hideNewsModal);
  overlay.addEventListener("click", hideNewsModal);
}
function hideNewsModal() {
  const startModal = $.querySelector(".news_modal");
  const overlay = $.querySelector(".overlay");
  startModal.classList.remove("visible_modal");
  overlay.classList.remove("visible_overlay");
}
function goToTimerPage() {
  const subjectNameInput = $.getElementById("name_input");
  const questionCountInput = $.getElementById("count_input");
  const minuteInput = $.getElementById("minute_input");
  const secondInput = $.getElementById("second_input");
  if (!subjectNameInput.value) {
    alert("نام درس رو وارد نکردی");
  } else {
    if (!questionCountInput.value) {
      alert("تعداد سوالات رو وارد نکردی");
    } else {
      if (!minuteInput.value) {
        alert("دقیقه برای هر سوال رو وارد نکردی");
      } else {
        if (!secondInput.value) {
          alert("ثانیه برای هر سوال رو وارد نکردی");
        } else {
          location.href = `timer.html?name=${encodeURIComponent(
            subjectNameInput.value.trim()
          )}&count=${questionCountInput.value}&minute=${
            minuteInput.value
          }&second=${secondInput.value}`;
          clearInputs();
        }
      }
    }
  }
}
function clearInputs() {
  const subjectNameInput = $.getElementById("name_input");
  const questionCountInput = $.getElementById("count_input");
  const minuteInput = $.getElementById("minute_input");
  const secondInput = $.getElementById("second_input");
  subjectNameInput.value = "";
  questionCountInput.value = "";
  minuteInput.value = "1";
  secondInput.value = "0";
}
function signIntoNewsPaper() {
  
}
startBtn.addEventListener("click", showStartModal);
newsBtn.addEventListener("click",showNewsModal)
statsBtn.addEventListener("click", () => (location.href = "stats.html"));
aboutBtn.addEventListener("click", () => (location.href = "about.html"));
goToTimerPageBtn.addEventListener("click", goToTimerPage);
signIntoNewsPaperBtn.addEventListener("click",signIntoNewsPaper)