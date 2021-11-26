const socket = io('/chattings'); // namespace 공간을 분리

const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

//* global socket handler
socket.on('user_connected', (username) => {
  drawNewChat(`${username} connected`);
});
socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username} : ${chat}`);
});
socket.on('disconnect_user', (username) => {
  drawNewChat(`${username} bye...`);
});

//* event callback functions
const handleSubmit = (event) => {
  event.preventDefault(); //submit 할때 새로고침 현상 막기
  const inputValue = event.target.elements[0].value; // 입력한 데이터
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    // 화면에 그리기
    drawNewChat(`me : ${inputValue}`);
    event.target.elements[0].value = ''; // 메세지 전송 후 메세지 빈 값으로 초기화
  }
};

//* draw functions
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Hello ${username} Stranger :)`);
const drawNewChat = (message, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

function helloUser() {
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
    console.log('리턴한 데이터 = ' + data); // return 한 데이터
  }); // emit(이벤트명 , 데이터) 클라이언트에서 서버로 보내기
  socket.on('hello_user', (data) => {
    //emit으로 보낸 데이터는  on으로 받을 수 있음
    console.log('hello_user = ' + data); // 클라이언트 콘솔에
  });
}

function init() {
  helloUser();
  formElement, addEventListener('submit', handleSubmit);
}

init();
