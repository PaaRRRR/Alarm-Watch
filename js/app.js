(function() {

  var timePresenter = document.querySelector('#time-presenter');

  var watchMode = document.querySelector('#watch-mode');
  var watchTime = document.querySelector('#watch-time');
  var watchTimeBtn = document.querySelector('#watch-time-btn');

  var alarmMode = document.querySelector('#alarm-mode');
  var alarmTime = document.querySelector('#alarm-time');
  var alarmText = document.querySelector('#alarm-text');
  var alarmBtn = document.querySelector('#alarm-btn');
  var alarmList = document.querySelector('#alarm-list');

  var alarmOffBtn = document.querySelector('#alarm-list-off-btn');
  var alarmDeleteBtn = document.querySelector('#alarm-list-delete-btn');

  var messageList = document.querySelector('#message-list');
  var newDate = new Date();
  var current = newDate.getTime();
  var currentTime = newDate.getHours()*60 + newDate.getMinutes();
  var x;
  var a,b,c; // 객체 생성시 값을 보관하기 위해 만든 변수
  // var timeGap = 1230; // isLoading값과 연동해서 일정 시간 후에 다시 알람기능할 수 있도록

  var alarmArrayAll = []; // 전체 알람 리스트
  var validID = 0;


  /**시간 설정**/
  watchTimeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      //clearInterval(intervalTime);

      x = watchTime.value;
      newDate = new Date(x);
      current = newDate.getTime();

      console.log("시간설정이 완료되었습니다.");
  });


  var intervalTime = setInterval(function() {
    // current = 1552393411263
    current += 1000;
    newDate = new Date(current);
    currentTime = newDate.getHours()*60 + newDate.getMinutes();

    timePresenter.innerHTML = newDate;

    alarmArrayAll.forEach(function(cur) {
      if(cur.turn && cur.sum === currentTime && cur.isLoading) {
        cur.isLoading = false;
        cur.makingMessage();
        // console.log(cur.text + " : " + cur.turn);
      }
    });

  }, 1000);

  /**알람 만들기**/
  alarmBtn.addEventListener('click', function(e) {
    e.preventDefault();

    var obj = {};
    obj["watch"] = watchMode.value;
    obj["alarm"] = alarmMode.value;

    a = obj;
    b = alarmTime.value || "10:30";
    c = alarmText.value || "주간 회의";

    alarmText.value = "";

    var abc = new AlarmList(a, b, c, true, validID);
    alarmArrayAll.push(abc);


    // UI 오름차순으로 정렬시키기.
    alarmArrayAll.sort(function(a, b) {
      if(a.sum < b.sum) {
        return -1;
      }
      if(a.sum > b.sum) {
        return 1;
      }
      return 0;
    });


    // UI에 나타내기
    alarmList.innerHTML = "";
    alarmArrayAll.forEach(function(cur) {
      cur.makingList();
    });


    validID++;
    console.log(alarmArrayAll);

    console.log("알람 리스트가 추가되었습니다.");
  });

  // 알람 리스트 객체
  function AlarmList (mode, time, text, turn ,id) {
    this.mode = mode || { "watch": "일반", "alarm": "긴급" };
    this.time = time || "10:30";
    this.text = text || "주간 회의";
    this.turn = turn;
    this.id = id || validID;
    this.isLoading = true; // 알람 울렸을 때 한번만 울리기 위해

    var timeArray = this.time.split(":");
    this.sum = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
  }

  AlarmList.prototype.makingList = function() {
    var html = "<li class='listChild " +
    (this.turn ? "": "offList") + "' id='alarm-list-" +
    this.id + "'>" +
    this.time + " " +
    this.text + " " + "<span class='alarmListBtn offBtn'>" +
    (this.turn ? "끄기" : "켜기") + "</span>" + " " + "<span class='alarmListBtn deleteBtn'>삭제</span></li>";

    alarmList.insertAdjacentHTML('beforeend', html);
  }

  AlarmList.prototype.makingMessage = function () {
    var html = "";
    var wMode = this.mode.watch;
    var aMode = this.mode.alarm;

    if(wMode === "일반") {
      html = "<li class='listChild'>!소리: " +
      this.time + "  " +
      this.text + "!</li>"
    } else if (wMode === "진동") {
      html = "<li class='listChild'>{진동: " +
      this.time + "  " +
      this.text + "}</li>"
    } else {
      if (aMode === "긴급") {
        html = "<li class='listChild'>!소리: " +
        this.time + "  " +
        this.text + "!</li>"
      } else {
        html = "<li class='listChild'>~무음: " +
        this.time + "  " +
        this.text + "~</li>"
      }
    }

    messageList.insertAdjacentHTML('beforeend', html);
  }



  /**알람리스트에 있는 버튼(off, delete) 컨트롤**/
  alarmList.addEventListener('click', function(e) {

      var idSplit, properID, numberID, el;
      var targetAlarm = e.target;
      var targetAlarmParent = e.target.parentNode;
      var targetID = "";
      var btnText = "";


        // off버튼을 눌렀을 시
      if(targetAlarm.className === "alarmListBtn offBtn") {
        targetID = targetAlarm.parentNode.id;
        idSplit = targetID.split('-');
        properID = idSplit[2];
        numberID = parseInt(properID);

        // Data에 적용시키기
        alarmArrayAll.forEach(function(cur) {
          if(cur.id === numberID) {
            cur.turn = !cur.turn;
          }
        });


        // UI에 적용시키기
        btnText = targetAlarm.textContent;

        if (btnText === "끄기") {
          targetAlarm.innerHTML = "켜기";
          targetAlarmParent.classList.toggle('offList');

        } else if (btnText === '켜기') {
          targetAlarm.innerHTML = "끄기";
          targetAlarmParent.classList.toggle('offList');
        }

        console.log("끄기버튼이 눌렸습니다.");


        // delete버튼을 눌렀을 시
      } else if (targetAlarm.className === "alarmListBtn deleteBtn") {
        targetID = targetAlarm.parentNode.id;
        idSplit = targetID.split('-');
        properID = idSplit[2];
        numberID = parseInt(properID);


        // var ind = 0;
        // ind = alarmArrayAll.map((cur, ind) => {
        //   if(cur.id === numberID) {
        //     return ind;
        //   }
        // })
        // alarmArrayAll.splice(ind, 1);


        // Data에서 지우기
        alarmArrayAll = alarmArrayAll.filter(function(cur) {
          return cur.id !== numberID;
        });


        // UI에서 지우기
        el = document.getElementById(targetID);
        el.parentNode.removeChild(el);

        console.log(alarmArrayAll);
        console.log("삭제가 성공적으로 수행되었습니다.");
      }
  });

})();
