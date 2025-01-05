document.addEventListener('DOMContentLoaded', () => {
    // 1. 检查 URL 中是否有 hash
    const hash = window.location.hash.substring(1);
    const initialPage = hash ? hash : 'home'; // 如果有 hash 使用 hash, 没有则使用 home

    // 2. 加载初始页面
    loadPage(initialPage);

    // 为所有导航链接添加点击事件监听器
    document.querySelectorAll('.menu a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.getAttribute('data-page');
            loadPage(page);
            
            // 处理移动端菜单（如果需要）
            const submenu = e.currentTarget.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
});


async function loadPage(pageName) {
    try {
        const mainPanel = document.getElementById('main-panel');
        
        // 0. 在添加 fade-out 之前，移除 fade-in 类**
        mainPanel.classList.remove('fade-in');
        
        // 1. 开始淡出动画
        mainPanel.classList.add('fade-out');
        
        // 2. 等待淡出动画完成
        await new Promise(resolve => setTimeout(resolve, 100)); // 300ms 与 CSS transition 持续时间匹配
        
        // 3. 加载新内容
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const content = await response.text();
        
        // 4. 更新内容
        mainPanel.innerHTML = content;
        
        // 5. 触发重排以确保过渡效果生效
        mainPanel.offsetHeight;
        
        // 6. 移除淡出类并添加淡入类
        mainPanel.classList.remove('fade-out');
        mainPanel.classList.add('fade-in');
        
        // 7. 更新 URL
        if (window.location.hash !== `#${pageName}`) {
            history.pushState({ page: pageName }, '', `#${pageName}`);
        }
        
        // 8. 初始化页面
        initializePage(pageName);
        
    } catch (error) {
        console.error('Error loading page:', error);
        mainPanel.innerHTML = '<div class="error">加载页面时出错</div>';
    }
}

// 处理浏览器的后退/前进按钮
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        loadPage(event.state.page);
    }
});

// 页面特定的初始化函数
function initializePage(pageName) {
    switch(pageName) {
        case 'home':
            // 首页特定的初始化代码
            break;
        case 'library':
            // 图书馆页面特定的初始化代码
            break;
        // 添加其他页面的初始化代码
    }
}


// 实现主题切换功能

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const html = document.documentElement;

// 从cookie获取theme
function getThemeFromCookie(){
  const name = "theme=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
}
// 设置cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires="+ date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function updateTheme(theme){
    html.setAttribute('data-theme', theme);
    setCookie('theme', theme, 365)
}

const initialTheme = getThemeFromCookie();
if (initialTheme) {
    updateTheme(initialTheme);
}else{
    updateTheme('light')
}


themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme)
});