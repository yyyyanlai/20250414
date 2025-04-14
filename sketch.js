let circles = [];
let iframe; // 用於嵌入網頁的 iframe
let fishes = []; // 用於存放魚的陣列
let snake1, snake2; // 用於存放蛇的物件
let font; // 用於顯示文字的字型

function setup() {
  createCanvas(windowWidth, windowHeight); // 設置畫布為視窗大小

  // 初始化蛇
  snake1 = new Snake(width / 3 - 20, 2 * height / 3);
  snake2 = new Snake(width / 2 + 30, height / 3);

  // 載入字型
  font = loadFont('paopao.otf');

  // 建立選單
  createMenu();

  // 建立 iframe
  iframe = createElement('iframe');
  iframe.style('position', 'absolute');
  iframe.style('top', '100px'); // iframe 放置於選單下方
  iframe.style('left', '10px');
  iframe.style('width', '90%');
  iframe.style('height', '80%');
  iframe.style('border', 'none');
  iframe.style('background', 'transparent'); // 使用透明背景
  iframe.hide(); // 預設隱藏 iframe
}

function draw() {
  background('#F2C10F'); // 設定背景顏色

  // 更新並繪製蛇
  snake1.Update();
  snake2.Update();

  // 左邊的蛇邏輯
  if (snake1.stage == 0 && snake1.x > snake1.startX + 150) {
    snake1.SetDir(0, -1);
    snake1.stage = 1;
  } else if (snake1.stage == 1 && snake1.y < snake1.startY - 200) {
    snake1.SetDir(-1, 0);
    snake1.stage = 2;
  } else if (snake1.stage == 2 && snake1.x < snake1.startX) {
    snake1.SetDir(0, 1);
    snake1.stage = 3;
  } else if (snake1.stage == 3 && snake1.y > snake1.startY) {
    snake1.SetDir(-1, 0);
    snake1.stage = 4;
  } else if (snake1.stage == 4 && snake1.x < snake1.startX - 200) {
    snake1.SetDir(0, -1);
    snake1.stage = 5;
  } else if (snake1.stage == 5 && snake1.y < snake1.startY - 100) {
    snake1.SetDir(1, 0);
    snake1.stage = 6;
  } else if (snake1.stage == 6 && snake1.x > snake1.startX - 60) {
    snake1.SetDir(0, -1);
    snake1.stage = 7;
  } else if (snake1.stage == 7 && snake1.y < snake1.startY - 200) {
    snake1.SetDir(-1, 0);
    snake1.stage = 8;
  } else if (snake1.stage == 8 && snake1.x < snake1.startX - 200) {
    snake1.Stop();
  }

  // 右邊的蛇邏輯
  if (snake2.stage == 0 && snake2.x > snake2.startX + 150) {
    snake2.SetDir(0, 1);
    snake2.stage = 1;
  } else if (snake2.stage == 1 && snake2.y > snake2.startY + 100) {
    snake2.SetDir(-1, 0);
    snake2.stage = 2;
  } else if (snake2.stage == 2 && snake2.x < snake2.startX + 10) {
    snake2.SetDir(0, 1);
    snake2.stage = 3;
  } else if (snake2.stage == 3 && snake2.y > snake2.startY + 200) {
    snake2.SetDir(1, 0);
    snake2.stage = 4;
  } else if (snake2.stage == 4 && snake2.x > snake2.startX + 350) {
    snake2.SetDir(0, -1);
    snake2.stage = 5;
  } else if (snake2.stage == 5 && snake2.y < snake2.startY + 100) {
    snake2.SetDir(-1, 0);
    snake2.stage = 6;
  } else if (snake2.stage == 6 && snake2.x < snake2.startX + 210) {
    snake2.SetDir(0, -1);
    snake2.stage = 7;
  } else if (snake2.stage == 7 && snake2.y < snake2.startY) {
    snake2.SetDir(1, 0);
    snake2.stage = 8;
  } else if (snake2.stage == 8 && snake2.x > snake2.startX + 350) {
    snake2.Stop();
  }

  // 顯示文字
  if (!snake1.isMoving) {
    textSize(80);
    textFont(font);
    fill(255);
    text("蛇年大吉!", width / 2 - 100, height / 5);
  }
}

// 當視窗大小改變時，調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 魚的類別
class Fish {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = random(20, 40);
  }

  update() {
    this.x += this.speed;
    if (this.x > width) {
      this.x = -this.size; // 當魚游出畫布右側時，從左側重新出現
      this.y = random(height); // 隨機重置高度
    }
  }

  display() {
    fill(255, 150, 0);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size / 2); // 魚的身體
    triangle(
      this.x - this.size / 2,
      this.y,
      this.x - this.size,
      this.y - this.size / 4,
      this.x - this.size,
      this.y + this.size / 4
    ); // 魚的尾巴
  }
}

// 蛇的類別
class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xDir = 1;
    this.yDir = 0;
    this.speed = 3;
    this.length = 0;
    this.tail = [];
    this.startX = this.x;
    this.startY = this.y;
    this.isMoving = true;
    this.stage = 0;
  }

  SetDir(xDir, yDir) {
    this.xDir = xDir;
    this.yDir = yDir;
  }

  Stop() {
    this.isMoving = false;
  }

  Update() {
    if (this.isMoving) {
      // 移動
      this.x = this.x + this.xDir * this.speed;
      this.y = this.y + this.yDir * this.speed;
      if ((this.x - this.startX) % 6 == 0 || (this.y - this.startY) % 6 == 0) {
        // 添加尾巴節點
        let tailPos = createVector(this.x, this.y);
        this.tail.push(tailPos);
      }
    }

    // 繪製身體
    noStroke();
    for (let i = 0; i < this.tail.length; i++) {
      if (i % 8 == 0) {
        fill(247, 183, 64); // 黃色
      } else {
        fill("#F25757"); // 紅色
      }
      circle(this.tail[i].x, this.tail[i].y, 50);
    }
    push();
    translate(this.x, this.y);

    // 旋轉頭部
    if (this.xDir == 1) rotate(HALF_PI); // 向右
    else if (this.xDir == -1) rotate(-HALF_PI); // 向左
    else if (this.yDir == 1) rotate(PI); // 向下
    else if (this.yDir == -1) rotate(0); // 向上

    // 繪製頭部
    fill("#F25757");
    circle(0, 0, 60);
    fill(255);
    stroke(242, 104, 94);
    circle(0 - 15, 0 - 10, 30);
    circle(0 + 15, 0 - 10, 30);
    noStroke();
    fill(0);
    circle(0 + 15, 0 - 15, 15);
    circle(0 - 15, 0 - 15, 15);
    pop();
  }
}

function createMenu() {
  // 建立選單容器
  let menu = createElement('ul');
  menu.style('position', 'absolute');
  menu.style('top', '10px');
  menu.style('left', '10px'); // 調整為左上角
  menu.style('display', 'flex'); // 水平排列
  menu.style('gap', '15px'); // 選項間距
  menu.style('padding', '0'); // 移除容器內邊距
  menu.style('background', 'transparent'); // 容器背景透明
  menu.style('border', 'none'); // 移除容器邊框
  menu.style('z-index', '1000'); // 確保選單在最上層

  // 選單項目
  let items = ['首頁', '自我介紹', '作品集', '測驗卷', '教學影片', '筆記'];
  for (let item of items) {
    let li = createElement('li', item);
    li.style('list-style', 'none'); // 移除項目符號
    li.style('cursor', 'pointer');
    li.style('color', '#007BFF');
    li.style('text-align', 'center');
    li.style('text-decoration', 'none');
    li.style('padding', '10px 15px');
    li.style('border-radius', '10px'); // 每個項目為圓角矩形
    li.style('background', '#ffffff'); // 每個項目背景色
    li.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)'); // 每個項目陰影
    li.style('border', '1px solid #ccc'); // 每個項目邊框

    // 滑鼠移入事件
    li.mouseOver(() => {
      li.style('background', '#007BFF'); // 背景變藍
      li.style('color', '#ffffff'); // 文字變白
    });

    // 滑鼠移出事件
    li.mouseOut(() => {
      li.style('background', '#ffffff'); // 背景恢復白色
      li.style('color', '#007BFF'); // 文字恢復藍色
    });

    // 點擊事件
    li.mousePressed(() => {
      if (item === '首頁') {
        iframe.hide(); // 隱藏 iframe

        // 移除自我介紹的文字區塊（如果存在）
        let existingMessage = select('div'); // 選取文字區塊
        if (existingMessage) {
          existingMessage.remove(); // 移除文字區塊
        }
      } else if (item === '自我介紹') {
        iframe.hide(); // 隱藏 iframe

        // 建立文字區塊
        let message = createElement('div', '我叫賴竺妍');
        message.style('position', 'absolute');
        message.style('top', '50%'); // 垂直置中
        message.style('left', '50%'); // 水平置中
        message.style('transform', 'translate(-50%, -50%)'); // 修正偏移
        message.style('padding', '20px 40px');
        message.style('background', '#ffffff');
        message.style('border', '1px solid #ccc');
        message.style('border-radius', '10px');
        message.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
        message.style('text-align', 'center');
        message.style('font-size', '20px');
        message.style('color', '#333');
        message.style('z-index', '1002'); // 確保文字區塊在最上層

        // 3秒後自動移除文字區塊
        setTimeout(() => {
          message.remove();
        }, 3000);
      } else if (item === '測驗卷') {
        iframe.attribute('src', 'https://yyyyanlai.github.io/20250310/'); // 設定 iframe 的來源
        iframe.show(); // 顯示 iframe
      } else if (item === '教學影片') {
        iframe.attribute('src', 'https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/B2/week8/20250407_091922.mp4'); // 設定影片的來源
        iframe.show(); // 顯示 iframe
      } else if (item === '筆記') {
        iframe.attribute('src', 'https://hackmd.io/@cXBDz1qJRdCeONnktZ5UqA/Hy2OPpeRyg'); // 設定筆記的來源
        iframe.show(); // 顯示 iframe
      }
    });

    // 如果是「作品集」，新增子選項
    if (item === '作品集') {
      let subMenu = createElement('ul');
      subMenu.style('position', 'absolute'); // 子選單絕對定位
      subMenu.style('top', '42px'); // 子選單放置於「作品集」下方
      subMenu.style('left', '167px'); // 子選單向右移動 50px
      subMenu.style('display', 'none'); // 預設隱藏子選單
      subMenu.style('flex-direction', 'column');
      subMenu.style('gap', '5px');
      subMenu.style('padding', '10px');
      subMenu.style('background', '#ffffff');
      subMenu.style('border', '1px solid #ccc');
      subMenu.style('border-radius', '10px');
      subMenu.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
      subMenu.style('z-index', '1001'); // 確保子選單在最上層

      let subItems = [
        { name: '第一周作業', url: 'https://yyyyanlai.github.io/20250303/' },
        { name: '第二周作業', url: 'https://yyyyanlai.github.io/20250310/' },
        { name: '第三周作業', url: 'https://yyyyanlai.github.io/20250317/' },
        { name: '第四周作業', url: 'https://yyyyanlai.github.io/20250324./' },
      ];

      for (let subItem of subItems) {
        let subLi = createElement('li', subItem.name);
        subLi.style('list-style', 'none');
        subLi.style('cursor', 'pointer');
        subLi.style('color', '#007BFF');
        subLi.style('text-align', 'center');
        subLi.style('text-decoration', 'none');
        subLi.style('padding', '5px 10px');
        subLi.style('border-radius', '5px');
        subLi.style('background', '#f8f9fa');
        subLi.style('border', '1px solid #ccc');

        // 滑鼠移入事件
        subLi.mouseOver(() => {
          subLi.style('background', '#007BFF');
          subLi.style('color', '#ffffff');
        });

        // 滑鼠移出事件
        subLi.mouseOut(() => {
          subLi.style('background', '#f8f9fa');
          subLi.style('color', '#007BFF');
        });

        // 點擊事件，顯示對應的網頁
        subLi.mousePressed(() => {
          iframe.attribute('src', subItem.url); // 設定 iframe 的來源
          iframe.show(); // 顯示 iframe
        });

        subLi.parent(subMenu);
      }

      subMenu.parent(li);

      // 滑鼠移入「作品集」時顯示子選單
      li.mouseOver(() => {
        subMenu.style('display', 'flex');
      });

      // 滑鼠移出「作品集」時隱藏子選單
      li.mouseOut(() => {
        subMenu.style('display', 'none');
      });
    }

    li.parent(menu);
  }
}
