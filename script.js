var addTask = document.querySelector('.add');
var myList = document.querySelector('.todolist');
var tagList = document.querySelector('.tag-row');
var typeList = document.getElementById('task-type');
var taskList = JSON.parse(localStorage.getItem('task')) || [];
var tag;
var select = 'all';     // 預設為顯示全部
var count;  // 計算頁面印出的li數
var isModify = false;     // 修改狀態監控

printSelectType();      // 印出filter選項

if(!taskList.length) {
    noTaskMsg();
} else {
    printList();    // 有資料才印出清單
}

// 記錄用過的標籤
if(!localStorage.usedTag) {     // 若localStorage沒有記錄
    document.querySelector('.tag').classList.add('tag-select');
    tag = document.querySelector('span[class~="tag-select"]').textContent;  // 選擇有tag-select class的元素
    localStorage.usedTag = tag;
} else {
    tag = localStorage.usedTag;
    document.querySelectorAll('.tag').forEach(el => {
        if(el.textContent.indexOf(tag) !== -1){  // 篩出清單裡面的textContent符合上次用過的tag
            el.classList.add('tag-select');
        }
    });
}

// 選擇標籤
function addTag(e){
    if(e.target.nodeName !== 'SPAN'){ return; }   
    document.querySelectorAll('.tag').forEach(el => {
        if(el.classList.contains('tag-select')){    // 一次只能選取一個標籤
            el.classList.remove('tag-select');
        }
    });
    e.target.classList.add('tag-select');  
    tag = e.target.textContent;
    localStorage.usedTag = tag;   // 記錄用過的tag
}

// 新增任務
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

// 修改-刪除-完成任務
function modifyMyTask(e) {
    e.stopPropagation();
    var getNum = e.target.dataset.num;      // 取得目標index
    var task = document.querySelector('li[data-num="' + getNum + '"] .task-name');
    var newInput;
    if (e.target.classList.contains('delete')) { // 按下垃圾桶才可以刪除
        deleteTask();
    } else if(e.target.classList.contains('modify')) {     // 按下筆才可以修改
        // 若任務為完成狀態則不能修改
        if(document.querySelector('li[data-num="' + getNum + '"]').classList.contains('done-check')) { return; }
        isModify = true;       // 修改狀態改為true
        modifyTask();      
    } else { // 按下其他地方則表示完成任務打勾
        if(isModify === true) { return; }   // 在修改狀態下不能點完成任務
        finishTask();
    }
    // 刪除
    function deleteTask(){
        document.querySelector('li[data-num="' + getNum + '"]').classList.add('delete-animation');      // 動畫效果
        setTimeout(function() {     // 讓刪除的動作延遲執行
            taskList.splice(getNum, 1);
            localStorage.task = JSON.stringify(taskList); // taskList陣列字串化後賦給localStorage.task
            printList();
            if (taskList.length === 0) { // 若taskList陣列沒有值了則印出
                var el = document.querySelector('.info');
                el.textContent = 'Congratulations! No more task to do.';
            }
        }, 600);
    }
    // 修改
    function modifyTask() {
        if(isModify === true) {
            var getInput = task.textContent;
            task.innerHTML = '<input type="text" value="'+getInput+'" class="modify-input">';
            newInput = document.querySelector('li[data-num="' + getNum + '"] .task-name input');
            newInput.focus();
            var val = newInput.value;   // 實現focus讓游標在文字最末端
            newInput.value = '';
            newInput.value = val;
            document.body.addEventListener('click', modifyFinish, true);     // 想要滑鼠按任意地方或enter鍵可以儲存修改
            document.body.addEventListener('keydown', modifyFinishByEnter);
        }
        // 滑鼠點擊任意地方修改完成
        function modifyFinish(e){
            e.stopPropagation();
            if(e.target.classList.contains('modify-input')) { return; } 
            updateContent();
            document.body.removeEventListener('keydown', modifyFinishByEnter);   // 刪掉沒用到的監聽
            document.body.removeEventListener('click', modifyFinish, true);  // 修改完成刪掉監聽
        }
        // enter修改完成
        function modifyFinishByEnter(e) {
            if(e.keyCode === 13) {
                updateContent();
                document.body.removeEventListener('click', modifyFinish, true);
                document.body.removeEventListener('keydown', modifyFinishByEnter, false);
            }
        }
        
        function updateContent(){
            task.innerHTML = newInput.value;
            taskList[getNum].task = task.textContent;
            localStorage.task = JSON.stringify(taskList);
            isModify = false;
        }
    }
    // 完成任務
    function finishTask() {
        var num;        // 設定變數去取得目標元素的index
        var target = e.target.parentElement.nodeName;      // 因為點擊會點到div、及裡面的span或i
        switch (target) {                                  // 所以用e.target的父元素去做判斷
            case 'UL':      // 點到LI
                num = e.target.dataset.num;     // 取LI的index
                break;
            case 'LI':      // 點到DIV        
                num = num = e.target.parentElement.dataset.num;     // 取得父元素LI的index
                break;
            case 'DIV':     // 點到SPAN或I         
                num = num = e.target.parentElement.parentElement.dataset.num;   // 取得父元素的父元素LI的index
                break;
        }
        var targetLi = document.querySelector('li[data-num="' + num + '"]');    // 利用屬性選擇器撈出目標元素
        targetLi.classList.toggle('done-check');
        if (targetLi.classList.contains('done-check')) {    // 完成的項目存到localStorage
            taskList[num].done = true;
            localStorage.task = JSON.stringify(taskList);
        } else {
            taskList[num].done = false;
            localStorage.task = JSON.stringify(taskList);
        }
    }
}

// 刪除全部任務
function delAll(e){
    e.preventDefault();
    for(var i = 0; i < count; i++){     // 將篩選過後的list全部刪除
        var getNum = document.querySelector('.todolist').firstChild.dataset.num;    // 撈出UL的第一個子元素LI
        taskList.splice(getNum, 1);     // 逐筆刪除
    }
    localStorage.task = JSON.stringify(taskList);       // 更新data到localStorage
    
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
        if(taskList[i].tag == select || select == 'all'){  // 篩出和選擇的tag相符的對象
            var el = document.createElement('li');
            var taskArea = document.createElement('div');
            var modifyArea = document.createElement('div');
            var check = document.createElement('i');    // check icon
            var tagDisplay = document.createElement('span');    // tag
            var taskDisplay = document.createElement('span');   // task name
            var modify = document.createElement('i');   // modify icon
            var del = document.createElement('i');  // 垃圾桶icon
            tagDisplay.textContent = taskList[i].tag;
            del.classList.add('fas', 'fa-trash', 'delete');
            check.classList.add('fas', 'fa-check-circle', 'done');
            modify.classList.add('fas', 'fa-pen', 'modify');
            del.style.padding = '0.8rem';   // 讓icon更容易被點擊
            modify.style.padding = '0.8rem';
            modify.dataset.num = i;
            del.dataset.num = i;
            el.dataset.num = i;
            taskArea.classList.add('list-task');
            tagDisplay.classList.add('list-tag', taskList[i].tag);
            taskDisplay.textContent = taskList[i].task;
            taskDisplay.classList.add('task-name');
            taskArea.appendChild(check);
            taskArea.appendChild(tagDisplay);
            taskArea.appendChild(taskDisplay);
            modifyArea.appendChild(modify);
            modifyArea.appendChild(del);
            el.appendChild(taskArea);
            el.appendChild(modifyArea);
            document.querySelector('.todolist').appendChild(el);
            
            if(taskList[i].done === true) {     // 讓頁面能即時更新打勾過的項目
                el.classList.add('done-check');
            }
            count += 1;     // 計算頁面清單的長度 -- delAll函式會用到
        }
    }
    
    if(count > 1){  // 若清單長度大於1則顯示刪除全部按鈕
        document.querySelector('.delete-all').style.display = 'inline-block';  
    } else if(count <= 1){
        document.querySelector('.delete-all').style.display = 'none'; 
        if(count === 0){    // 若清單上沒有任務則印出
            noTaskMsg();
        }
    }    
}

function noTaskMsg(){
    var pElement = document.createElement('p');
    pElement.style.color = '#aaa';
    pElement.style.margin = '0 0 1.5rem 0';
    pElement.textContent = 'No task here...';
    myList.appendChild(pElement);
}


function printSelectType(){     // 動態印出filter選項
    document.querySelectorAll('.tag').forEach(el => {
        var type = document.createElement('li');
        type.classList.add('option');
        type.textContent = el.textContent;
        document.querySelector('.type-selector').appendChild(type);
    });
}

//function taskFilter(e){     // 選單監聽
//    select = e.target.textContent;
//    printList();
//}

function chooseSelector(e) {
    e.stopPropagation();
    document.querySelector('.type-selector').classList.toggle('hide');
    if(e.target.classList.contains('option')) {
        document.querySelector('.chosen').textContent = e.target.textContent;
        select = e.target.textContent;
        printList();
    }
    document.body.addEventListener('click', function(e){
        if(e.target.classList.contains('option') || e.target.classList.contains('chosen')) { return }
        if(!document.querySelector('.type-selector').classList.contains('hide')){
            document.querySelector('.type-selector').classList.add('hide');
        }
    }, true)
}

tagList.addEventListener('click', addTag);      // 選擇tag
addTask.addEventListener('click', addNewTask);      // 添加新項目
myList.addEventListener('click', modifyMyTask);      // 點擊完成任務或刪除

document.querySelector('.delete-all').addEventListener('click', delAll);        // 刪除全部任務
document.body.addEventListener('keydown', function(key){    // 按下enter也可以送出表單
    if(key.keyCode === 13) { addNewTask(); }     // 若按下enter就執行addNewTask function
});
//typeList.addEventListener('change', taskFilter);    // filter選單
document.querySelector('#task-type').addEventListener('click', chooseSelector, false);



// 滑鼠hover監聽 - 用CSS比較快
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