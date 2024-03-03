let mat, mat2, temp, index1, set = 0, turn2, x, y, bombs, flags, time, func, turn, isOver, con, im1, t;
function homeLoad() {//טעינת דף הבית הוספת מעבר על הקישורים 
    document.getElementsByClassName("home")[0].children[0].children[3].classList.add("hover");
    document.getElementsByClassName("home")[0].children[0].children[1].classList.add("hover");
    if (localStorage.getItem("saveX")) {
        document.getElementsByClassName("home")[0].children[0].children[2].classList.add("hover");
    }
}

function load(x1, y1, b1) {// מקבלת את גודל המטריצה
    isOver = 0;
    document.getElementsByClassName("game")[0].children[1].style.display = "none";//דיו הודעה
    document.getElementsByTagName("table")[0].addEventListener("click", press);
    document.getElementsByTagName("table")[0].addEventListener("contextmenu", degel);
    document.getElementsByTagName("table")[0].addEventListener("dblclick", dbclick);
    document.getElementsByClassName("game")[0].children[0].children[6].addEventListener("click", settings);
    if (localStorage.getItem("continue") == 5) {//בדיקה האם לפתוח משחק קודם
        // console.log("enter");
        x = localStorage.getItem("saveX"); 
        y = localStorage.getItem("saveY");
        bombs = localStorage.getItem("saveB");
        mat = new Array(x);
        for (i = 0; i < y; i++)
            mat[i] = new Array(y);
        temp = localStorage.getItem("saveM");
        time = Number(localStorage.getItem("saveT"));
        document.getElementsByTagName("div")[0].children[3].innerHTML = time;
        temp = temp.split(",");
        index1 = 0;
        for (i = 0; i < x; i++)
            for (j = 0; j < y; j++) {
                mat[i][j] = temp[index1++];
            }
        turn2 = 0;    
    }
    else {
        if (!x1) {
            x = 8;
            y = 8;
            bombs = 10;
        }
        else {
            x = x1;
            y = y1;
            bombs = b1;
        }
        mat = new Array(x);
        for (i = 0; i < y; i++)
            mat[i] = new Array(y);
        rand_bombs();
        time = 0;
        turn = 0;
        document.getElementsByTagName("div")[0].children[3].innerHTML = "00";
    }
    flags = bombs;
    document.getElementsByTagName("table")[0].innerHTML = "";
    clearInterval(func);
    if (bombs == 10) {
        document.getElementsByTagName("table")[0].classList.add("small");
        document.getElementsByTagName("table")[0].classList.remove("big");
        document.getElementsByTagName("table")[0].classList.remove("large");
    }
    else {
        if (bombs == 30) {
            document.getElementsByTagName("table")[0].classList.add("big");
            document.getElementsByTagName("table")[0].classList.remove("small");
            document.getElementsByTagName("table")[0].classList.remove("large");
        }
        else {
            document.getElementsByTagName("table")[0].classList.add("large");
            document.getElementsByTagName("table")[0].classList.remove("big");
            document.getElementsByTagName("table")[0].classList.remove("small");
        }
    }
    for (let i = 0; i < x; i++) {
        document.getElementsByTagName("table")[0].innerHTML += "<tr data-row='" + i + "'></tr>";
        for (let j = 0; j < y; j++) {
            document.querySelector('[data-row="' + i + '"]').innerHTML += "<td data-visited='0' data-colum='" + j + "'class='square'></td>";
        }
    }
    if (localStorage.getItem("continue") == 5) {//השמת הנתונים בהתאם למשחק שנשמר
        temp = localStorage.getItem("saveM2");
        temp = temp.split(",");
        localStorage.clear();
        index1 = 0;
        for (i = 0; i < x; i++)
            for (j = 0; j < y; j++) {
                if (temp[index1] == 1) {
                    if (mat[i][j] != 0)
                        document.querySelector('[data-row="' + i + '"]').children[j].style.backgroundImage = "url('../image/p" + mat[i][j] + ".png')";
                    document.querySelector('[data-row="' + i + '"]').children[j].classList.remove("square");
                    document.querySelector('[data-row="' + i + '"]').children[j].setAttribute("data-visited","vi");
                }
                else if (temp[index1] == 2) {
                    document.querySelector('[data-row="' + i + '"]').children[j].classList.remove("square");
                    document.querySelector('[data-row="' + i + '"]').children[j].classList.add("flag");
                    flags--;
                }
                index1++;
            }
    }
    document.getElementsByClassName("game")[0].children[0].children[9].style.display = "none";
    document.getElementsByTagName("div")[0].children[5].innerHTML = String(flags);
    localStorage.clear();
}

function load1() {
    load(x, y, bombs);
}

function rand_bombs() {//הגרלת מיקומי הפצצות
    let r, c;
    for (i = 0; i < x; i++)
        for (j = 0; j < y; j++)
            mat[i][j] = 0;
    for (i = 0; i < bombs; i++) {
        r = Math.round(Math.random() * (x - 1));
        c = Math.round(Math.random() * (y - 1));
        while (mat[r][c] >= 9) {
            r = Math.round(Math.random() * (x - 1));
            c = Math.round(Math.random() * (y - 1));
        }
        mat[r][c] = 9;//עדכון המטריצה בהתאם למיקומי הפצצות
        if (r != 0) {
            mat[r - 1][c] += 1;
            if (c != 0) 
                mat[r - 1][c - 1] += 1;
            if (c != y - 1) 
                mat[r - 1][c + 1] += 1;
        }
        if (r != x - 1) {
            mat[r + 1][c] += 1;
            if (c != 0) 
                mat[r + 1][c - 1] += 1;
            if (c != y - 1) 
                mat[r + 1][c + 1] += 1;
        }
        if (c != 0) 
            mat[r][c - 1] += 1;
        if (c != y - 1) 
            mat[r][c + 1] += 1;
    }
}

function press() {
    if (!event.target.classList.contains("flag") && event.target.getAttribute("data-visited") != "vi" && event.target != event.currentTarget) {
        let r1 = event.target.parentElement.getAttribute("data-row");
        let c1 = event.target.getAttribute("data-colum");
        if (turn == 0) {
            func = setInterval(timer, 1000);//הפעלת הטיימר
            first_bomb(r1, c1);//בדיקה שלא לחץ על פצצה בפעם הראשונה
        }
        if (turn2 == 0) {
            func = setInterval(timer, 1000);
            turn2 = 1;
        }
        if (mat[r1][c1] >= 9) {//אם לחץ על פצצה- סיום המשחק
            turn += 1;
            event.target.classList.add("bombR");
            event.target.classList.remove("square");
            setTimeout(function () { game_over(r1, c1) }, 200);
        }
        else {
            if (mat[r1][c1] == 0) {
                zero(r1, c1);
                turn += 1;
                if_win();
            }
            else {
                document.querySelector('[data-row="' + r1 + '"]').children[c1].setAttribute("data-visited", "vi");
                document.querySelector('[data-row="' + r1 + '"]').children[c1].classList.remove("square");
                document.querySelector('[data-row="' + r1 + '"]').children[c1].style.backgroundImage ="url('../image/p"+mat[r1][c1]+".png')";
                turn += 1;
                playAudio("5");
                if_win();
            }
        }
    }
}

function timer() {
    time += 1;
    if (time < 10)
        document.getElementsByTagName("div")[0].children[3].innerHTML = "0" + time;
    else
        document.getElementsByTagName("div")[0].children[3].innerHTML = time;
}

function first_bomb(r, c) {
    while (mat[r][c] >= 9)
        rand_bombs();
}

function degel() {//סימון דגל בעת לחיצה על מקש ימני
    event.preventDefault()
    if (event.target.classList.contains("flag") == false) {
        if (flags > 0 && event.target.innerHTML == "") {
            event.target.classList.remove("square");
            event.target.classList.add("flag");
            flags--;
        }
    }
    else {
        event.target.classList.remove("flag");
        flags++;
        event.target.classList.add("square");
    }
    document.getElementsByTagName("div")[0].children[5].innerHTML = String(flags);
}

function dbclick() {//בעת לחיצה כפולה על משבצת מגולה יחשפו כל המשבצות שסביבה במידה וסומנו לצידה מספר דגלים תואם
    let r, c, count = 0;
    if (event.target.getAttribute("data-visited") == "vi") {
        r = Number(event.target.parentElement.getAttribute("data-row"));
        c = Number(event.target.getAttribute("data-colum"));
        if (r != 0) {
            if (document.querySelector('[data-row="' + (r - 1) + '"]').children[c].classList.contains("flag"))
                count++;
            if (c != 0 && document.querySelector('[data-row="' + (r - 1) + '"]').children[c - 1].classList.contains("flag")) {
                count++;
            }
            if (c != y - 1 && document.querySelector('[data-row="' + (r - 1) + '"]').children[c + 1].classList.contains("flag")) {
                count++;
            }
        }
        if (r != x - 1) {
            if (document.querySelector('[data-row="' + (r + 1) + '"]').children[c].classList.contains("flag"))
                count++;
            if (c != 0 && document.querySelector('[data-row="' + (r + 1) + '"]').children[c - 1].classList.contains("flag")) {
                count++;
            }
            if (c != y - 1 && document.querySelector('[data-row="' + (r + 1) + '"]').children[c + 1].classList.contains("flag")) {
                count++;
            }
        }
        if (c != 0 && document.querySelector('[data-row="' + r + '"]').children[c - 1].classList.contains("flag")) {
            count++;
        }
        if (c != y - 1 && document.querySelector('[data-row="' + r + '"]').children[c + 1].classList.contains("flag")) {
            count++;
        }
        if (count == mat[r][c]) {
            doubleOpen(r - 1, c);
            doubleOpen(r - 1, c + 1);
            doubleOpen(r - 1, c - 1);
            doubleOpen(r, c + 1);
            doubleOpen(r, c - 1);
            doubleOpen(r + 1, c);
            doubleOpen(r + 1, c + 1);
            doubleOpen(r + 1, c - 1);
        }
    }
}
function doubleOpen(r, c) {
    if (r < 0 || r == x || c < 0 || c == y || document.querySelector('[data-row="' + r + '"]').children[c].classList.contains("flag"))
        return;
    if (mat[r][c] >= 9)
        game_over();
    else {
        if (mat[r][c] == 0) {
            zero(r, c);
            if_win();
        }
        else {
                document.querySelector('[data-row="' + r + '"]').children[c].setAttribute("data-visited", "vi");
                document.querySelector('[data-row="' + r + '"]').children[c].classList.remove("square");
                document.querySelector('[data-row="' + r + '"]').children[c].style.backgroundImage = "url('../image/p" + mat[r][c] + ".png')";
                playAudio("5");
                if_win();    
        }
    }
}
function zero(r1, c1) {//בעת לחיצה על משבצת ללא מוקשים סביבה יחשפו כל המשבצות הריקות סביבה עד שיוקפו המשבצות ממוספרות
    let r = Number(r1);
    let c = Number(c1);
    if (r < 0 || r == x || c < 0 || c == y || document.querySelector('[data-row="' + r + '"]').children[c].getAttribute("data-visited") == "vi")
        return;
    document.querySelector('[data-row="' + r + '"]').children[c].classList.remove("square");
    document.querySelector('[data-row="' + r + '"]').children[c].setAttribute("data-visited", "vi");
    if (document.querySelector('[data-row="' + r + '"]').children[c].classList.contains("flag")) {
        flags++;
        document.getElementsByTagName("div")[0].children[5].innerHTML = String(flags);
        document.querySelector('[data-row="' + r + '"]').children[c].classList.remove("flag");
    }
    if (mat[r][c] != 0) {
        document.querySelector('[data-row="' + r + '"]').children[c].style.backgroundImage = "url('../image/p" + mat[r][c] + ".png')";
        playAudio("5");
    }
    else {
        zero(r - 1, c - 1);
        zero(r - 1, c);
        zero(r - 1, c + 1);
        zero(r + 1, c - 1);
        zero(r + 1, c + 1);
        zero(r + 1, c);
        zero(r, c + 1);
        zero(r, c - 1);
    }
}

function game_over(r, c) {
    t = 200;
    document.getElementsByTagName("table")[0].removeEventListener("click", press);
    document.getElementsByTagName("table")[0].removeEventListener("contextmenu", degel);
    document.getElementsByTagName("table")[0].removeEventListener("dblclick", dbclick);
    document.getElementsByClassName("game")[0].children[0].children[6].removeEventListener("click", settings);
    document.getElementsByClassName("game")[0].children[0].children[6].src = "../image/settings.png";
    document.getElementsByClassName("game")[0].children[0].children[7].style.display = "none";
    isOver = 1;
    clearInterval(func);
    for (i = 0; i < x; i++)
        for (j = 0; j < y; j++) {
            if (mat[i][j] >= 9 && (i != r || j != c)) {
                openB(i, j, t);
                t = t + 100;
            }
            else {
                if (document.querySelector('[data-row="' + i + '"]').children[j].classList.contains("flag")) {
                    document.querySelector('[data-row="' + i + '"]').children[j].innerHTML = "x";
                }
            }
        }
    setTimeout(() => { openDiv() }, t);
}

function openB(i, j, t) {
    setTimeout(() => { openBomb(i, j) }, t);
}

function openBomb(i, j) {
    playAudio("4");
    document.querySelector('[data-row="' + i + '"]').children[j].classList.remove("square");
    document.querySelector('[data-row="' + i + '"]').children[j].classList.add("bombB");
}

function openDiv() {
    document.getElementsByClassName("game")[0].children[0].children[9].style.display = "grid";
    document.getElementsByClassName("game")[0].children[1].style.display = "block";
    document.getElementsByClassName("game")[0].children[0].children[9].children[0].innerHTML = "Oops! You stepped on a mine";
    playAudio("6");
}

function if_win() {//בדיקה האם ניצח
    for (let i = 0; i < x; i++)
        for (let j = 0; j < y; j++) {
            if (mat[i][j] < 9 && document.querySelector('[data-row="' + i + '"]').children[j].getAttribute("data-visited") == "0") {
                return;
            }
        }
    win();
}

function win() {
    clearInterval(func);
    document.getElementsByClassName("game")[0].children[0].children[9].style.display = "grid";
    document.getElementsByClassName("game")[0].children[1].style.display = "block";
    document.getElementsByClassName("game")[0].children[0].children[9].children[0].innerHTML = "YOU WIN!!!";
    playAudio("7");
    isOver = 1;
}

function nevigate(w) {
    if (w) {
        if (w == 1 && !localStorage.getItem("saveX"))
            return;
        else {
            if (w == 2)
                unload();//יציאה באמצע משחק
            else
                localStorage.setItem("continue", 5);
        }   
    }
    window.location.assign(event.target.getAttribute("data-link"));
}
function settings() {
    if (set == 0) {
        event.target.parentElement.children[7].style.display = "block";
        event.target.src = "../image/closeSetting.png";
        set = 1;
    }
    else {
        event.target.parentElement.children[7].style.display = "none";
        event.target.src = "../image/settings.png";
        set = 0;
    }
}
function playAudio(num) {
    let audio1 = document.getElementById(num);
    audio1.play();
}

function unload() {//שמירת נתוני המשחק שנסגר באמצע
    if (isOver == 0) {
        localStorage.setItem("saveX", x);
        localStorage.setItem("saveY", y);
        localStorage.setItem("saveB", bombs);
        localStorage.setItem("saveM", mat);
        mat2 = new Array(x);
        for (i = 0; i < x; i++) {
            mat2[i] = new Array(y);
            for (j = 0; j < y; j++) {
                if (document.querySelector('[data-row="' + i + '"]').children[j].getAttribute("data-visited") == "vi")
                    mat2[i][j] = 1;
                else if (document.querySelector('[data-row="' + i + '"]').children[j].classList.contains("flag"))
                    mat2[i][j] = 2;
                else
                    mat2[i][j] = 0;
            }
        }
        localStorage.setItem("saveM2", mat2);
        localStorage.setItem("saveT", time);
    }
}


function login() 
{
    var pass = document.getElementById("password").value;
    var user=document.getElementById("username").value;
    if(pass.length<8)
    {
        alert("your pass is less than 8 character");
        document.getElementById("password").value="";
    }
    else
    {
        if(user=="")
        {
            alert("enter your name");
        }
        else
        {
           window.location.href = "HomePage.html";
        }
    }
}
