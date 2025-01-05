document.addEventListener('DOMContentLoaded', () => {
    // 1. 检查 URL 中是否有 hash
    let hash = window.location.hash.substring(1);
    let initialPage = hash ? hash : 'home'; // 如果有 hash 使用 hash, 没有则使用 home
     // 2. 加载初始页面
    loadPage(initialPage);
    // 为所有导航链接添加点击事件监听器
    document.querySelectorAll('.menu a[data-page]').forEach(link => {
        link.addEventListener('click', handleMenuClick);
    });
       // 页面加载完成后，恢复之前存储的菜单状态
    restoreMenuState();
});

async function loadPage(pageName) {
    saveMenuState();
    try {
        const mainPanel = document.getElementById('main-panel');
        // 1. 触发页面淡出动画
        await fadeOutPage(mainPanel);
       
        // 2. 加载页面内容
        await loadPageContent(pageName, mainPanel);

        // 3. 触发容器高度过渡动画
        await animateContainerHeight(mainPanel);
       
         // 4. 触发页面淡入动画
        await fadeInPage(mainPanel);

        // 5. 更新 URL
        updateURL(pageName);

        // 6. 初始化页面
        initializePage(pageName);
         // 7. 高亮当前菜单
         highlightCurrentMenu(pageName);
    } catch (error) {
        console.error('Error loading page:', error);
        mainPanel.innerHTML = '<div class="error">加载页面时出错</div>';
    }
    finally{
         // 清除过渡效果，设置为 auto
          resetContainerHeight();
    }
}


async function fadeOutPage(mainPanel) {
    mainPanel.classList.remove('fade-in');
    mainPanel.classList.add('fade-out');
    await new Promise(resolve => setTimeout(resolve, 100));
}

async function fadeInPage(mainPanel) {
    mainPanel.classList.remove('fade-out');
    mainPanel.classList.add('fade-in');
}

async function loadPageContent(pageName, mainPanel) {
    const response = await fetch(`pages/${pageName}.html`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const content = await response.text();
    mainPanel.innerHTML = content;
    await new Promise(resolve => setTimeout(resolve, 0));
}

async function animateContainerHeight(mainPanel) {
    const container = document.querySelector('.container');
    const currentHeight = mainPanel.offsetHeight;
    const newHeight = mainPanel.offsetHeight;

    container.style.transition = 'height 0.3s ease-in-out';
    container.style.height = `${currentHeight}px`;

    await new Promise(resolve => requestAnimationFrame(resolve));
    container.style.height = `${newHeight}px`;
}

function resetContainerHeight() {
    const container = document.querySelector('.container');
    container.style.transition = '';
    container.style.height = 'auto';
}

function updateURL(pageName) {
    if (window.location.hash !== `#${pageName}`) {
        history.pushState({ page: pageName }, '', `#${pageName}`);
    }
}

function handleMenuClick(e) {
    e.preventDefault();
    const page = e.currentTarget.getAttribute('data-page');
    loadPage(page);
        
    // 处理移动端菜单（如果需要）
    const parentLi = e.currentTarget.parentElement;
    const submenu = e.currentTarget.nextElementSibling;

    if (submenu && submenu.classList.contains('submenu')) {
       
       parentLi.classList.toggle('active');
    }
}
// 处理浏览器的后退/前进按钮
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        loadPage(event.state.page);
    }else{
         let hash = window.location.hash.substring(1);
          let initialPage = hash ? hash : 'home';
           loadPage(initialPage);
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
//保存菜单状态
function saveMenuState() {
    const activeMenus = [];
    document.querySelectorAll('.menu li.active').forEach(li => {
        activeMenus.push(li.querySelector('a[data-page]').getAttribute('data-page'));
    });
    localStorage.setItem('activeMenus', JSON.stringify(activeMenus));
}
//恢复菜单状态
function restoreMenuState() {
    const activeMenus = localStorage.getItem('activeMenus');
    if(activeMenus){
        const menus = JSON.parse(activeMenus);
        menus.forEach(menu=>{
            document.querySelectorAll(`.menu li > a[data-page="${menu}"]`).forEach(link =>{
                const parentLi = link.parentElement;
                const submenu = link.nextElementSibling;
                if(submenu && submenu.classList.contains('submenu')){
                    parentLi.classList.add('active');
                }
            })

        })
    }else{
        loadPage('home')
    }
}
//高亮当前菜单
function highlightCurrentMenu(pageName) {
    // 移除所有菜单项的 'selected' 类
    document.querySelectorAll('.menu li a').forEach(link => {
        link.parentElement.classList.remove('selected'); // 同时移除父级 li 的 selected 类
    });

    // 找到当前页面对应的菜单项并高亮
    const currentLink = document.querySelector(`.menu a[data-page="${pageName}"]`);
    if (currentLink) {
      currentLink.parentElement.classList.add('selected'); // 高亮父级 li
       // 如果是子菜单，高亮父菜单
       let parentLi = currentLink.closest('li.menu-item');
         if (parentLi) {
           parentLi.classList.add('selected')
        }
    }
}