var addTask = document.querySelector('.add');
var myList = document.querySelector('.todolist');
var tagList = document.querySelector('.tag-row');
var typeList = document.getElementById('task-type');
var taskList = JSON.parse(localStorage.getItem('task')) || [];
var tag;
var select = 'all';     // 預設為顯示全部
var count;  // 計算頁面印出的li數

if(!localStorage.usedTag) {     // 若localStorage沒有記錄
    document.querySelector('.tag').classList.add('tag-select');
    tag = document.querySelector('span[class~="tag-select"]').textContent;  // 選擇有tag-select class的元素
} else {
    tag = localStorage.usedTag;
    document.querySelectorAll('.tag').forEach(el => {
        if(el.textContent.indexOf(tag) != -1){  // 篩出清單裡面的textContent符合上次用過的tag
            el.classList.add('tag-select');
        }
    });
}


function addTag(e){
    if(e.target.nodeName !== 'SPAN'){ return; }
    document.querySelectorAll('.tag').forEach(el => {   // 一次只能選取一個標籤
        el.classList.remove('tag-select'); 
    });
    e.target.classList.add('tag-select');  
    tag = e.target.textContent;
    localStorage.setItem('usedTag', tag);   // 記錄用過的tag
}


function addNewTask(){
    var aTask = document.querySelector('.task-input');
    var check = aTask.value.trim();
    if(!check.length){ return; }    // 防止空白字元及直接按enter送出
    var obj = { 
        task: aTask.value,
        tag: tag,
        done: false
    };
    taskList.push(obj);
    var objToString = JSON.stringify(taskList);
    localStorage.setItem('task', objToString);
    aTask.value = '';   // 送出後清空表單
    printList();
}

function delMyTask(e) {
    var getNum = e.target.dataset.num;
    if (e.target.className.search('delete') != -1) { // 按下垃圾桶才可以刪除
        taskList.splice(getNum, 1);
        localStorage.task = JSON.stringify(taskList); // taskList陣列字串化後賦給localStorage.task
        printList();
    } else { // 按下其他地方則表示完成任務打勾
        var num;
        var target = e.target.parentElement.nodeName;
        switch (target) {
            case 'UL':
                num = e.target.dataset.num;
                break;
            case 'LI':
                num = num = e.target.parentElement.dataset.num;
                break;
            case 'DIV':
                num = num = e.target.parentElement.dataset.num;
                break;
        }
        var targetLi = document.querySelector('li[data-num="' + num + '"]');
        targetLi.classList.toggle('done-check');
        
        var data = JSON.parse(localStorage.task);   // 完成的項目存到localStorage
        if (targetLi.className.search('done-check') != -1) {
            data[num].done = true;
            localStorage.task = JSON.stringify(data);
        } else {
            data[num].done = false;
            localStorage.task = JSON.stringify(data);
        }
    }
    if (!taskList.length) { // 若taskList陣列沒有值了則印出
        var el = document.querySelector('.info');
        el.textContent = 'Congratulations! No more task to do.';
    }
}
function delAll(e){
    e.preventDefault();
    for(var i = 0; i < count; i++){     // 將篩選過後的list全部刪除
        var getNum = document.querySelector('.todolist').firstChild.dataset.num;
        taskList.splice(getNum, 1);     // 逐筆刪除
    }
    localStorage.task = JSON.stringify(taskList);
    
    printList();
    if(!taskList.length){   // 若taskList陣列沒有值了則印出
        var el = document.querySelector('.info');
        el.textContent = 'Congratulations! No more task to do.';
    }
}


function printList(){
    myList.innerHTML = '';  // 每次印出之前先把之前列出的給清空
    document.querySelector('.info').textContent = '';   // 提示文字也清空
    count = 0;  // count初始化 - 切換filter的時候會重新計算
    for(var i = 0; i < taskList.length; i++){
        if(taskList[i].tag == select || select == 'all'){  // filter
            var el = document.createElement('li');
            var div = document.createElement('div');
            var check = document.createElement('i');    // check icon
            var tagDisplay = document.createElement('span');    // tag
            var del = document.createElement('i');  // 垃圾桶icon
            tagDisplay.textContent = taskList[i].tag;
            del.classList.add('fas', 'fa-trash', 'delete');
            check.classList.add('fas', 'fa-check-circle', 'done');
            div.dataset.num = i;
            del.dataset.num = i;
            check.dataset.done = i;
            el.dataset.num = i;
            div.classList.add('list-task');
            tagDisplay.classList.add('list-tag', taskList[i].tag);
            div.appendChild(check);
            div.appendChild(tagDisplay);
            div.innerHTML += taskList[i].task;
            el.appendChild(div);
            el.appendChild(del);
            document.querySelector('.todolist').appendChild(el);
            
            var data = JSON.parse(localStorage.task)    // 取得任務完成的項目資料
            if(data[i].done === true) {     // 讓頁面能即時更新打勾過的項目
                el.classList.add('done-check');
            }
            count += 1;
        }
    }
    
    if(!taskList.length || count === 0){   // 若清單上沒有任務則印出
        var pElement = document.createElement('p');
        pElement.style.color = '#aaa';
        pElement.style.margin = '0 0 1.5rem 0';
        pElement.textContent = 'No task here...';
        myList.appendChild(pElement);
        document.querySelector('.delete-all').style.display = 'none';
    } else if(taskList.length > 1){
        document.querySelector('.delete-all').style.display = 'inline-block';
    }
    
}

function printSelectType(){     // 動態印出filter選項
    document.querySelectorAll('.tag').forEach(el => {
        var type = document.createElement('option');
        type.textContent = el.textContent;
        type.value = el.textContent;
        document.getElementById('task-type').appendChild(type);
    });
}

function taskFilter(e){
    select = e.target.value;
    printList();
}


printSelectType();      // 印出filter
printList();

tagList.addEventListener('click', addTag);
addTask.addEventListener('click', addNewTask);
myList.addEventListener('click', delMyTask, true);
document.querySelector('.delete-all').addEventListener('click', delAll);
document.body.addEventListener('keydown', function(key){    // 按下enter也可以送出表單
    if(key.keyCode === 13) { addNewTask(); }     // 若按下enter就執行addNewTask function
});
typeList.addEventListener('change', taskFilter);
//
//myList.addEventListener('mouseover', function(e){
//    console.log(e.target.parentNode)
//    var index = e.target.dataset.num;
//    document.querySelector('i[data-done="'+index+'"]').classList.add('done-hover');
//    
//});
//myList.addEventListener('mouseout', function(e){
//    e.target
//    var index = e.target.dataset.num;
//    document.querySelector('i[data-done="'+index+'"]').classList.remove('done-hover');
//});