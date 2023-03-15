const size = 20;
const width = 31;
const height = 31;
let ctx = null;                 // キャンバスコンテキスト
let snakePos = [                // スネーク座標
    [15, 24],
    [16, 24],
    [17, 24],
    [18, 24]
];
//let score = snakePos.length;    // スコア
let score = 0;                  // スコア
let speed = 200;                // 進行速度
let aniFlg = 0;                 // アニメーション
let directionMove = 3;          // 移動方向
let nextDirectionMove = 0;
let foodPos = {x:1, y:2};       // 餌位置
// 壁マップ
// 1:無描画 2:縦 3:横 4:2重縦 未実装=>5:2重横<= 6:左上角丸 7:左下角丸 8:右上角丸 9:右下角丸
let wallPos = [
   //0---------+---------*---------+---------*---------+---------*---  
    [6,3,3,3,3,3,3,3,3,3,3,3,3,3,3,8,6,3,3,3,3,3,3,3,3,3,3,3,3,3,3,8],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,6,3,3,3,8,0,6,3,3,3,3,8,0,2,2,0,6,3,3,3,3,8,0,6,3,3,3,8,0,2],
    [2,0,2,1,1,1,2,0,2,1,1,1,1,2,0,2,2,0,2,1,1,1,1,2,0,2,1,1,1,2,0,2],
    [2,0,2,1,1,1,2,0,2,1,1,1,1,2,0,2,2,0,2,1,1,1,1,2,0,2,1,1,1,2,0,2],
    [2,0,7,3,3,3,9,0,7,3,3,3,3,9,0,7,9,0,7,3,3,3,3,9,0,7,3,3,3,9,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,6,3,3,3,8,0,6,8,0,6,3,3,3,3,3,3,3,3,8,0,6,8,0,6,3,3,3,8,0,2],
    [2,0,7,3,3,3,9,0,2,2,0,7,3,3,3,8,6,3,3,3,9,0,2,2,0,7,3,3,3,9,0,2],
    [2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,0,0,0,2],
    [7,3,3,3,3,3,8,0,2,7,3,3,3,8,0,2,2,0,6,3,3,3,9,2,0,6,3,3,3,3,3,9],
    [1,1,1,1,1,1,2,0,2,6,3,3,3,9,0,7,9,0,7,3,3,3,8,2,0,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,0,2,2,0,6,3,3,3,3,3,3,3,3,8,0,2,2,0,2,1,1,1,1,1,1],
    [3,3,3,3,3,3,9,0,7,9,0,2,1,1,1,1,1,1,1,1,2,0,7,9,0,7,3,3,3,3,3,3],
    [0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0],
    [3,3,3,3,3,3,8,0,6,8,0,2,1,1,1,1,1,1,1,1,2,0,6,8,0,6,3,3,3,3,3,3],
    [1,1,1,1,1,1,2,0,2,2,0,7,3,3,3,3,3,3,3,3,9,0,2,2,0,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,0,2,2,0,6,3,3,3,3,3,3,3,3,8,0,2,2,0,2,1,1,1,1,1,1],
    [6,3,3,3,3,3,9,0,7,9,0,7,3,3,3,8,6,3,3,3,9,0,7,9,0,7,3,3,3,3,3,8],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,6,3,3,3,8,0,6,3,3,3,3,8,0,2,2,0,6,3,3,3,3,8,0,6,3,3,3,8,0,2],
    [2,0,7,3,3,8,2,0,7,3,3,3,3,9,0,7,9,0,7,3,3,3,3,9,0,2,6,3,3,9,0,2],
    [2,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,2],
    [7,3,3,8,0,2,2,0,6,8,0,6,3,3,3,3,3,3,3,3,8,0,6,8,0,2,2,0,6,3,3,9],
    [6,3,3,9,0,7,9,0,2,2,0,7,3,3,3,8,6,3,3,3,9,0,2,2,0,7,9,0,7,3,3,8],
    [2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,0,0,0,2],
    [2,0,6,3,3,3,3,3,9,7,3,3,3,8,0,2,2,0,6,3,3,3,9,7,3,3,3,3,3,8,0,2],
    [2,0,7,3,3,3,3,3,3,3,3,3,3,9,0,7,9,0,7,3,3,3,3,3,3,3,3,3,3,9,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [7,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,9]
];

// 初期化
function init()
{
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = (width+1) * size;
    canvas.height = (height+1) * size;
}
// 壁描画
function wallDraw()
{
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0, (width+1) * size, (height+1) * size);

    ctx.strokeStyle = "blue" ;
    ctx.lineWidth = 2;
    for( let x=0; x<=width; x++)
    {
        for( let y=0; y<=height; y++)
        {
            switch(wallPos[y][x])
            {
                case 2: // 縦線
                    ctx.beginPath();
                    ctx.moveTo((x * size) + (size/2), y * size);        // 起点
                    ctx.lineTo((x * size) + (size/2), (y+1) * size);     // 終点
                    ctx.stroke() ;
                    break;
                case 3: // 横線
                    ctx.beginPath();
                    ctx.moveTo(x * size, (y * size) + (size/2));      // 起点
                    ctx.lineTo((x+1) * size, (y * size) + (size/2));     // 終点
                    ctx.stroke() ;
                    break;
                case 6: // 左上角丸
                    ctx.beginPath();
                    ctx.arc((x+1) * size, (y+1) * size, size/2, 1*Math.PI, 1.5*Math.PI, false);
                    ctx.stroke() ;
                    break;
                case 7: // 左下角丸
                    ctx.beginPath();
                    ctx.arc((x+1) * size, y * size, size/2, 0.5*Math.PI, 1.0*Math.PI, false);
                    ctx.stroke() ;
                    break;
                case 8: // 右上角丸
                    ctx.beginPath();
                    ctx.arc(x * size, (y+1) * size, size/2, 0*Math.PI, 1.5*Math.PI, true);
                    ctx.stroke() ;
                    break;
                case 9: // 右下角丸
                    ctx.beginPath();
                    ctx.arc(x * size, y * size, size/2, 0.5*Math.PI, 2.0*Math.PI, true);
                    ctx.stroke() ;
                    break;
            }
        }
    }
}
// 食べ物位置計算・表示
function makeFood()
{
    let fPos = [];

    // 位置演算
    for( let x=0; x<width; x++)
    {
        for( let y=0; y<height; y++)
        {
            if( wallPos[y][x] == 0 )
            {
                // スネーク自分判定
                let myp = 0;
                for( let i=0; i<snakePos.length; i++)
                {
                    [xx, yy] = snakePos[i];
                    if( xx == x && yy == y)
                        myp++;
                }
                if( myp == 0 ) fPos.push([x, y]);
            }
        }
    }
    //console.log(fPos.length);
    let num = Math.floor(Math.random() * fPos.length); 
    
    [fx, fy] = fPos[num];
    foodPos.x = fx;
    foodPos.y = fy;

    // 餌描画
    ctx.fillStyle = "#800";
    ctx.strokeStyle = "#800";
    ctx.fillRect( (foodPos.x) * size + (size/4),
            (foodPos.y) * size + (size/4),
            size/2, size/2);

}
// 自分描画
function drawMe()
{
    let stRad;
    let edRad;
    let arcFlg;
     if( aniFlg == 1 )
    {
        switch(directionMove)
        {
            case 1:     // 下方向
                stRad = (Math.PI/180) * (-90 - 45);
                edRad = (Math.PI/180) * (-45);
                arcFlg = true;
                break;
            case 2:     // 上方向
                stRad = (Math.PI/180) * 45;
                edRad = (Math.PI/180) * 90 + 45;
                arcFlg = true;
                break;
            case 3:     // 左方向
                stRad = (Math.PI/180) * (-90 - 45);
                edRad = (Math.PI/180) * (90 + 45);
                arcFlg = false;
                break;
            case 4:     // 右方向
                stRad = (Math.PI/180) * -45;
                edRad = (Math.PI/180) * 45;
                arcFlg = true;
                break;
        }
        aniFlg = 0;
    }
    else
    {
        stRad = 0;
        edRad = Math.PI*2;
        arcFlg = true;
        aniFlg = 1;
    }
    ctx.beginPath();
    ctx.fillStyle = "#880";
    ctx.strokeStyle = "#880";
    [x, y] = snakePos[0];
    ctx.moveTo((x+1) * size - (size/2),
        (y+1) * size - (size/2));           //円の中心に筆を持ってくる
    ctx.arc( (x+1) * size - (size/2),
             (y+1) * size - (size/2),
             size / 2,
             stRad, edRad, arcFlg ); 
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#844";
    ctx.strokeStyle = "#844";
    for( let i=1; i<snakePos.length; i++)
    {
        [x, y] = snakePos[i];
        ctx.fillRect( (x+1) * size - size,
                (y+1) * size - size,
                size, size);
    }
    ctx.closePath();
}
function eraseMe()
{
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    for( let i=0; i<snakePos.length; i++)
    {
        [x, y] = snakePos[i];
        ctx.fillRect( (x+1) * size - size,
                (y+1) * size - size,
                size, size);
    }
}
// 当たり判定
function bingo()
{
    [myX, myY] = snakePos[0];
    if( foodPos.x == myX && foodPos.y == myY)
    {
        [lastX, lastY] = snakePos[snakePos.length-1];
        snakePos.push([lastX, lastY]);

        score++;
        let sp = Math.abs((speed-200)/20);
        if( !(score % 5) && speed > 20) speed -=20;         // 速度アップ
        document.getElementById("gameScore").textContent = " Score: " + score + "  Speed:" + sp;

        const music = new Audio('se_get_1.mp3');
        music.currentTime = 0;
        music.play();
        
        makeFood();
    }
    
    for( let i=1; i<snakePos.length; i++)
    {
        [x, y] = snakePos[i];
        if( x == myX && y == myY)
        {
            return true;
        }   
    }
    return false;
}
// メインループ
async function play()
{
    while(true)
    {
        //wallDraw();
        eraseMe();

        [x, y] = snakePos[0];

        switch(nextDirectionMove)
        {
            case 1:
                if( wallPos[y - 1][x] == 0)     // 下方向
                {
                    nextDirectionMove = 0;
                    directionMove = 1;
                }
                break;
            case 2:
                if( wallPos[y + 1][x] == 0)     // 上方向
                {
                    nextDirectionMove = 0;
                    directionMove = 2;
                }
                break;
            case 3:
                if( wallPos[y][x - 1] == 0)     // 左方向
                {
                    nextDirectionMove = 0;
                    directionMove = 3;
                }
                break;
            case 4:
                if( wallPos[y][x + 1] == 0)     // 右方向
                {
                    nextDirectionMove = 0;
                    directionMove = 4;
                }
                break;
        }
        //console.log(wallPos[y][x] + " x:" + x + " y:" + y);
        let mx = x;
        let my = y;        
        switch(directionMove)
        {
            case 1:
                if(wallPos[y - 1][x] == 0){ my --; }                // 上方向
                break;
            case 2:
                if(wallPos[y + 1][x] == 0){ my ++; }                // 下移動
                break;
            case 3:
                if(wallPos[y][x - 1] == 0){ mx --; }                // 左方向
                if( x==0 ) mx = width - 1;
                break;
            case 4:
                if(wallPos[y][x + 1] == 0){ mx ++; }                // 右方向
                if( x>=width ) mx = 0;
                break;
        }
        if( mx != x || my != y)
        {
            snakePos.unshift([mx, my]);     // 移動先追加
            snakePos.pop();                 // 後尾削除
            //console.log(snakePos);
        }
        drawMe();
        
        // 当たり判定
        if( bingo() == true )
        {
            // ゲームオーバー
            const music = new Audio('se_pyuuuuu.mp3');
            music.currentTime = 0;
            music.play();
            //window.alert("Game Over");
            [x, y] = snakePos[0];
            ctx.beginPath();
            ctx.strokeStyle = "Red" ;
            ctx.lineWidth = 3 ;
            ctx.moveTo(x * size, y * size);        // 起点
            ctx.lineTo((x+1) * size, (y+1) * size);     // 終点
            ctx.moveTo((x+1) * size, y * size);        // 起点
            ctx.lineTo(x * size, (y+1) * size);     // 終点
            // 線を描画を実行
            ctx.stroke() ;
            break;
        }
        //  ウェイト
        //await new Promise((r) => setTimeout(r, speed/2));
        //drawMe();
        //await new Promise((r) => setTimeout(r, speed/2));
        await new Promise((r) => setTimeout(r, speed));
    }
}
// キー押下イベント
window.addEventListener("keydown",keydown);
function keydown(event)
{
    //console.log(event.keyCode);
    if(event.keyCode==38){ nextDirectionMove = 1; }    // 上キー
    if(event.keyCode==40){ nextDirectionMove = 2; }    // 下キー
    if(event.keyCode==37){ nextDirectionMove = 3; }    // 左キー
    if(event.keyCode==39){ nextDirectionMove = 4; }    // 右キー
}
// ゲーム開始
function gameStart()
{
    document.getElementById("gameStart").disabled = true;
    //const btn = document.getElementById("gameStart").disabled = true;
    //btn.disabled = true;
    const music = new Audio('se_discovery_1.mp3');
    music.currentTime = 0;
    music.play();

    play();

}
// ロード
window.onload = () => 
{
    init();
    wallDraw();
    makeFood();
    drawMe();
}
