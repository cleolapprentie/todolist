# My To-Do-List
> 107堂課堂作業練習 - [Udemy](https://www.udemy.com/javascript-learning/learn/lecture/6789158)

![demo](https://raw.githubusercontent.com/kayahino/todolist/master/demo.png)

## Demo
https://kayahino.github.io/todolist/

## USER STORY

- 按下按鈕或Enter鍵添加任務
- 使用標籤將任務分類，選單切換分類頁面
- 可以記錄上次用過的標籤
- 在列表中刪除指定任務，也可以一次刪除各分類中全部任務
- 支援RWD

## 開發思路

一開始在做這份作業的時候我就把大致的 wireframe 設計好了 
接下來就是思考要加入那些功能    
一開始只有最基本的新增、刪除功能  
不過我還加入了當把清單全部清空的時候會出現回饋的句子  
以及載入頁面時若沒有資料就會顯示「No task」 

後來看到有同學的作業竟然加了filter的功能!!
於是我也很大膽的來挑戰看看（殊不知是個燒腦的開始....）
動態產生標籤選單再用監聽事件印出該分類的任務

完成之後我又有個更大膽的想法....就是我想要在分類頁面一次刪除該分類的任務
一開始想說很簡單，用個for迴圈跑一跑刪一刪應該就可以了吧？！
不!!!!!! 寫完發現按下按鈕刪掉的是別的分類的任務
能想到的是刪掉的清單會讓陣列重新排序，所以用既定的數字去綁陣列索引一定會GG

到底該怎麼在茫茫大海的陣列中挑出

