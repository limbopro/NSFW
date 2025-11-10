async function fetchCodes() {

  var dataList = {};
  try {
    const response = await fetch('./index.json');
    if (!response.ok) throw new Error('无法加载 JSON 文件');
    var dataList = await response.json();
    console.log(dataList);
  } catch (error) {
    console.error('错误:', error);
  }


  async function loadJsonFiles(files, basePath = "./") { // basePath 参数，默认为当前目录
    // 自动去重 + 过滤空值
    const uniqueFiles = [...new Set(files.filter(f => f && typeof f === "string"))];
    const result = {};

    try {
      const responses = await Promise.all(
        uniqueFiles.map(async (file) => {
          const resp = await fetch(`${basePath}${file}`);
          if (!resp.ok) {
            throw new Error(`无法加载 ${file}（${resp.status} ${resp.statusText}）`);
          }
          const json = await resp.json();
          const name = file.replace(/\.json$/i, ""); // 更健壮：去掉 .json（大小写不敏感）
          return { name, json };
        })
      );

      responses.forEach(({ name, json }) => {
        result[name] = json;
      });
    } catch (err) {
      console.error("JSON 加载失败:", err.message || err);
    }
    return result;
  }

  // 1. 最佳评级数据
  const iBestratedfiles = [
    "bestrated_2025_11.json",
    "bestrated_translated.json",
    "2024best.json",
    "2024_best_netflav.json",
    "2023_best_netflav.json",
    "2022_best_netflav.json",
    "2021_best_netflav.json",
    "2020_best_netflav.json"
  ];

  window.dataBestrated = await loadJsonFiles(iBestratedfiles, "./bestrated/");

  // 2. 其他数据
  const otherfiles = [
    "friends.json", "fuqijiaohuan.json", "mostwanted_unique_translated.json",
    "mostwanted_duplicates_tranlated.json", "brother.json", "zhifuyouhuo.json",
    "yongzhuang.json", "wwr.json", "teacher.json", "siwa.json",
    "roumangaibian.json", "renqi.json", "office.json", "mom1.json",
    "mom.json", "koubao.json", "juru.json", "jiazhengfuwu.json",
    "fitness.json", "father.json", "duop.json", "chugui.json",
    "3p.json"
  ];
  window.dataMax = await loadJsonFiles(otherfiles, "./others/");

  // 3. 2025年最想要

  const mostwanted = [
    "most_wanted_201511.json",
  ];

  window.dataMostwanted = await loadJsonFiles(mostwanted, "./mostwanted/");


  // 组合数据到 dataList 对象

  /*
  dataList['2025年评价最佳[10月]'] = [
    ...dataBestrated['bestrated_2025_11'],
    ...dataBestrated['bestrated_translated']]
*/

  dataList['2025年最想要[已翻译]'] = [
    ...dataMax['mostwanted_unique_translated'],
    ...dataMax['mostwanted_duplicates_tranlated'],
  ];

  dataList['2025年最想要[未翻译]'] = [
    ...dataMostwanted['most_wanted_201511']
  ];

  dataList['2024年评价最佳'] = [
    ...dataBestrated['2024best'],
    ...dataBestrated['2024_best_netflav']
  ]; // 新增 2024 年评价最佳分类

  dataList['2023年评价最佳'] = [
    ...dataBestrated['2023_best_netflav']
  ]; // 新增 2023 年评价最佳分类

  dataList['2022年评价最佳'] = [
    ...dataBestrated['2022_best_netflav']
  ]; // 新增 2022 年评价最佳分类

  dataList['2021年评价最佳'] = [
    ...dataBestrated['2021_best_netflav']
  ]; // 新增 2021 年评价最佳分类

  dataList['2020年评价最佳'] = [
    ...dataBestrated['2020_best_netflav']
  ]; // 新增 2020 年评价最佳分类

  dataList['夫妻交换🎎'] = dataMax['fuqijiaohuan'];
  dataList['办公室🤤'] = dataMax['office'];
  dataList['办公室🤤'] = dataMax['office'];
  dataList['出轨🍷'] = dataMax['chugui'];
  dataList['巨乳🐻'] = dataMax['juru'];
  dataList['人妻👰'] = dataMax['renqi'];
  dataList['泳装👙'] = dataMax['yongzhuang'];
  dataList['健身🥵'] = dataMax['fitness'];
  dataList['多P👥'] = dataMax['duop'];
  //dataList['3P👥'] = dataMax['3p'];
  dataList['丝袜🧦'] = dataMax['siwa'];
  dataList['未亡人👘'] = dataMax['wwr'];
  dataList['老师🧑‍🏫'] = dataMax['teacher'];
  dataList['友人の●'] = dataMax['friends'];
  dataList['父●'] = dataMax['father'];
  dataList['母●'] = [...dataMax['mom'],
  ...dataMax['mom1']];
  dataList['姐●'] = dataMax['brother'];
  dataList['口爆👅'] = dataMax['koubao'];
  dataList['制服诱惑👩🏻‍💼'] = dataMax['zhifuyouhuo'];
  dataList['肉漫改编✍️'] = dataMax['roumangaibian'];

  dataList['综合●'] = [
    ...dataMax['friends'],
    ...dataMax['father'],
    ...dataMax['mom'],
    ...dataMax['brother']
  ];

  dataList["全部分类"] = Object.values(dataList)
    .filter(arr => Array.isArray(arr))
    .flat();
  window.dataList = dataList;

  setTimeout(() => {
    categoryChange();
  }, 1000);
}

// 初始化数据加载
fetchCodes();



// 分类选择变化时的处理
function categoryChange() {
  const options = Object.keys(dataList)
    .map(category => `<option value="${category}">${category}</option>`)
    .join('\n');
  const selectHtml = `${options}`;
  document.getElementById('category').innerHTML = selectHtml;

  var previousValue = categorySelect.value;
  categorySelect.addEventListener('change', function (e) {
    const newValue = e.target.value;
    if (newValue !== previousValue) {
      console.log('选择已更改，新值为:', newValue);
      historyItem_percent();
    }
    previousValue = newValue;
  });

  historyItem_percent();
  historyItem_paddingtoprebuild();
  addGlobalListener();
}

const categorySelect = document.getElementById('category');
var codeHover = "";
const display = document.getElementById('display');
const randomBtn = document.getElementById('randomBtn');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const favoritesList = document.getElementById('favoritesList');
const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');

let historyArr = [];
let historyArrTitle = [];
let favoritesArr = [];

function loadHistory() {

  try {
    const saved = localStorage.getItem('抽取记录_番号');
    if (saved) {
      historyArr = JSON.parse(saved);
    }
  } catch (e) {
    historyArr = [];
  }

  try {
    const savedTitle = localStorage.getItem('抽取记录_名称');
    if (savedTitle) {
      historyArrTitle = JSON.parse(savedTitle);
    }
  } catch (e) {
    historyArrTitle = [];
  }


}

function loadFavorites() {
  try {
    const saved = localStorage.getItem('收藏_番号');
    if (saved) {
      favoritesArr = JSON.parse(saved);
    }
  } catch (e) {
    favoritesArr = [];
  }
}

loadHistory();
loadFavorites();

function saveHistory() {
  localStorage.setItem('抽取记录_番号', JSON.stringify(historyArr));
  localStorage.setItem('抽取记录_名称', JSON.stringify(historyArrTitle));
}

function saveFavorites() {
  localStorage.setItem('收藏_番号', JSON.stringify(favoritesArr));
}

function showData(data) {

  const idPrefix = data.番号;
  display.innerHTML = `
    <span class="notranslate" translate="no">番号：</span><p class="notranslate" translate="no">${data.番号}</p><br>
    <span class="notranslate" id='icode' translate="no">标题：</span><p class='default'>${data.名称}'</p><br>
    <span class="notranslate" translate="no">演员：</span><p id='iactor'class="notranslate" translate="no">${data.演员}</p><br>
    <span class="notranslate" translate="no">收藏人数：</span><p id='ifav'class="notranslate" translate="no">${data.收藏人数}</p><br>
    <span class="notranslate" translate="no">分类：</span><p id='icategory' class="notranslate" translate="no">${getCategoryByNumber(data.番号)}</p><br>
    <div class='none'><p id='${idPrefix}'>标题：${data.名称}'</p></div>
  `;

  setTimeout(() => {

    toggleSearchState('false');

    // 1. 选取目标元素
    const element = document.getElementById('icount'); // 替换为你想选取的元素 ID

    if (element) {
      // 2. 调用函数模拟选取
      selectElementText(element);
      element.click();
    } else {
      console.error('未找到 ID 为 icode 的元素。');
    }

    setTimeout(() => {
      if (window.getSelection) {
        // 1. 获取当前的 Selection 对象（即用户高亮的区域）
        const selection = window.getSelection();

        // 2. 移除 Selection 对象中包含的所有 Range
        // 这将有效地清除所有高亮文本。
        selection.removeAllRanges();
        //// console.log('全局文本选取已取消。');
      }
    }, 1000);

  }, 1000);

}

function getCategoryByNumber(number) {
  const matchingCategories = [];
  for (const category in dataList) {
    if (category !== "全部分类" && dataList[category].some(item => item.番号 === number)) {
      matchingCategories.push(category);
    }
  }
  return matchingCategories.length > 0 ? matchingCategories.join(', ') : '未找到分类';
}

function getRandomItem(category) {
  const items = dataList[category];
  if (!items || items.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

randomBtn.onclick = function () {
  const selectedCategory = categorySelect.value;
  const randomData = getRandomItem(selectedCategory);
  showData(randomData);
  searchInput.value = randomData.番号;

  if (document.querySelector('input.gsc-input') !== null) {
    document.querySelector('input.gsc-input').value = randomData.番号;
  } else {
    console.log('cseScript is not loaded');
  }

  updateSearchHref();

  if (!historyArr.includes(randomData.番号)) {
    historyArr.push(randomData.番号);
    historyArrTitle.push(randomData.番号 + " " + randomData.名称 + " " + randomData.演员)
    saveHistory();
    renderHistory();
  } else {
    historyArr = historyArr.filter(num => num !== randomData.番号);
    historyArr.push(randomData.番号);


    const index = historyArrTitle.findIndex(item =>
      typeof item === 'string' && item.includes(randomData.番号)
    );

    if (index !== -1) {
      // 取出该元素
      const [matchedItem] = historyArrTitle.splice(index, 1);
      // 重新添加到末尾
      historyArrTitle.push(matchedItem);
    }


    /*
    for (let i = historyArrTitle.length - 1; i >= 0; i--) {
      if (historyArrTitle[i].includes(num)) {
        historyArrTitle.splice(i, 1); // 删除当前元素
      }
    }

    historyArrTitle.push(randomData.番号 + " " + randomData.名称 + " " + randomData.演员)
    */

    saveHistory();
    renderHistory();
  }

  historyItem_paddingtoprebuild();
  historyItem_normal();
  codeHover = randomData.番号;
  historyItem_highlights();
  historyItem_percent();
};

searchInput.oninput = updateSearchHref;

function historyItem_paddingtoprebuild() {
  document.querySelector('div.container-result').style.paddingTop = document.querySelector('div.container-search').offsetHeight - 10 + "px";
}

function updateSearchHref() {
  const value = searchInput.value.trim();
  const url = value ? `https://limbopro.com/btsearch.html#gsc.tab=0&gsc.q=${encodeURIComponent(value)}` : "#";
  searchBtn.href = url;
  console.log('url:' + url);
}

searchBtn.onclick = function (e) {
  const searchValue = searchInput.value.trim();
  if (!searchValue) {
    e.preventDefault();
    display.innerHTML = "请输入要搜索的番号！";
  }
};




function renderHistory() {
  historyList.innerHTML = "";



  // 找出 historyArr 中没有被 historyArrTitle 任何一项“包含”的元素
  const toAdd = historyArr.filter(itemA =>
    !historyArrTitle.some(itemB => itemB.includes(itemA))
  );

  // 添加到 B 末尾
  historyArrTitle.push(...toAdd);



  historyArr.forEach((num, index) => {
    title = ''

    historyArrTitle.forEach((item) => {
      if (item.includes(num)) {
        title = item
        console.log(num + " " + item)
      }
    })

    const span = document.createElement("span");
    span.className = "history-item";
    span.style.position = "relative";
    //// span.textContent = historyArrTitle[index];
    span.textContent = title;
    span.title = "点击填入搜索框并显示详情，长按加入收藏";

    span.onclick = function (e) {
      e.preventDefault(); // 防止默认行为干扰点击
      searchInput.value = num;
      if (isScriptLoaded()) {
        document.querySelector('input.gsc-input').value = num;
      }
      historyItem_normal();
      codeHover = num;
      historyItem_highlights();
      updateSearchHref();
      const item = dataList["全部分类"].find(d => d.番号 === num.toUpperCase());
      if (item) {
        showData(item);
      } else {
        display.innerHTML = "<div class='notranslate'><br>未在<span>数据库</span>找到该<span>番号/关键字</span>的详细信息！请在确保输入<span>番号/关键字</span>后<span>直接点击搜索按钮</span>进行搜索。</div>";
      }
      historyItem_paddingtoprebuild();
    };

    let pressTimer;
    span.addEventListener('touchstart', function (e) {
      pressTimer = setTimeout(() => {
        e.preventDefault(); // 长按时阻止默认行为，防止文本选择
        if (num !== codeHover) {
          // alert('请先点击选中此番号！');
          return;
        }
        if (favoritesArr.includes(num)) {
          alert('此番号已加入收藏！');
        } else if (confirm(`是否将番号 ${num} 加入收藏？`)) {
          favoritesArr.push(num);
          saveFavorites();
          renderFavorites();
          historyItem_paddingtoprebuild();
        }
      }, 1000);
    }, { passive: false });

    span.addEventListener('touchend', function () {
      clearTimeout(pressTimer);
    });

    span.addEventListener('touchcancel', function () {
      clearTimeout(pressTimer);
    });

    span.onmousedown = function () {
      pressTimer = setTimeout(() => {
        if (num !== codeHover) {
          alert('请先点击选中此番号！');
          return;
        }
        if (favoritesArr.includes(num)) {
          alert('此番号已加入收藏！');
        } else if (confirm(`是否将番号 ${num} 加入收藏？`)) {
          favoritesArr.push(num);
          saveFavorites();
          renderFavorites();
          historyItem_paddingtoprebuild();
        }
      }, 1000);
    };

    span.onmouseup = function () {
      clearTimeout(pressTimer);
    };

    span.onmouseleave = function () {
      clearTimeout(pressTimer);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "";
    deleteBtn.className = "delete-history-btn";
    deleteBtn.title = "删除此记录";
    deleteBtn.onclick = function (e) {
      e.stopPropagation();

      historyArr = historyArr.filter(item => item !== num);

      for (let i = historyArrTitle.length - 1; i >= 0; i--) {
        if (historyArrTitle[i].includes(num)) {
          historyArrTitle.splice(i, 1); // 删除当前元素 // 目前正确
        }
      }

      saveHistory();
      renderHistory();
      if (searchInput.value === num) {
        searchInput.value = "";
        document.querySelector('input.gsc-input').value = "";
        updateSearchHref();
        display.innerHTML = "<br><p class='notranslate'>点击下方按钮</p><span class='notranslate'>随机抽取</span><p class='notranslate'>一个番号</p><br><p class='notranslate'>或者</p><span class='notranslate'>输入番号/关键字</span><p class='notranslate'>进行搜索</p>";
      }
      historyItem_paddingtoprebuild();
    };
    span.appendChild(deleteBtn);
    historyList.appendChild(span);
  });

  historyItem_paddingtoprebuild();
}




function renderFavorites() {
  favoritesList.innerHTML = "";


  favoritesArr.forEach((num, index) => {
    title = ''

    historyArrTitle.forEach((item) => {
      if (item.includes(num)) {
        title = item
        console.log(num + " " + item)
      }
    })

    const span = document.createElement("span");
    span.className = "history-item";
    span.style.position = "relative";
    //// span.textContent = historyArrTitle[index];
    span.textContent = title;
    span.title = "点击填入搜索框并显示详情，长按移除收藏";

    span.onclick = function (e) {
      e.preventDefault(); // 防止默认行为干扰点击
      searchInput.value = num;
      if (isScriptLoaded()) {
        document.querySelector('input.gsc-input').value = num;
      }
      historyItem_normal();
      codeHover = num;
      historyItem_highlights();
      updateSearchHref();
      const item = dataList["全部分类"].find(d => d.番号 === num);
      if (item) {
        showData(item);
      } else {
        display.innerHTML = "<br>未在<span>数据库</span>找到该<span>番号/关键字</span>的详细信息！请在确保输入<span>番号/关键字</span>后<span>直接点击搜索按钮</span>进行搜索。";
      }
      historyItem_paddingtoprebuild();
    };

    let pressTimer;
    span.addEventListener('touchstart', function (e) {
      pressTimer = setTimeout(() => {
        e.preventDefault(); // 长按时阻止默认行为，防止文本选择
        if (num !== codeHover) {
          alert('请先点击选中此番号！');
          return;
        }
        if (confirm(`是否将番号 ${num} 从收藏移除？`)) {
          favoritesArr = favoritesArr.filter(item => item !== num);
          saveFavorites();
          renderFavorites();
          historyItem_paddingtoprebuild();
        }
      }, 1000);
    }, { passive: false });

    span.addEventListener('touchend', function () {
      clearTimeout(pressTimer);
    });

    span.addEventListener('touchcancel', function () {
      clearTimeout(pressTimer);
    });

    span.onmousedown = function () {
      pressTimer = setTimeout(() => {
        if (num !== codeHover) {
          alert('请先点击选中此番号！');
          return;
        }
        if (confirm(`是否将番号 ${num} 从收藏移除？`)) {
          favoritesArr = favoritesArr.filter(item => item !== num);
          saveFavorites();
          renderFavorites();
          historyItem_paddingtoprebuild();
        }
      }, 1000);
    };

    span.onmouseup = function () {
      clearTimeout(pressTimer);
    };

    span.onmouseleave = function () {
      clearTimeout(pressTimer);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "";
    deleteBtn.className = "delete-history-btn";
    deleteBtn.title = "移除此收藏";
    deleteBtn.onclick = function (e) {
      e.stopPropagation();
      favoritesArr = favoritesArr.filter(item => item !== num);
      saveFavorites();
      renderFavorites();
      if (searchInput.value === num) {
        searchInput.value = "";
        document.querySelector('input.gsc-input').value = "";
        updateSearchHref();
        display.innerHTML = "<br><p class='notranslate'>点击下方按钮</p><span class='notranslate'>随机抽取</span><p class='notranslate'>一个番号<><br><p class='notranslate'>或者</p><span class='notranslate'>输入番号/关键字</span><p class='notranslate'>进行搜索</p>";
      }
      historyItem_paddingtoprebuild();
    };
    span.appendChild(deleteBtn);
    favoritesList.appendChild(span);
  });

  historyItem_paddingtoprebuild();
}

clearHistoryBtn.onclick = function () {
  if (confirm("确定要清除所有抽取记录吗？")) {
    historyArr = [];
    historyArrTitle = [];
    saveHistory();
    renderHistory();
    historyItem_paddingtoprebuild();
    historyItem_percent();
  }
};

clearFavoritesBtn.onclick = function () {
  if (confirm("确定要清除所有收藏吗？")) {
    favoritesArr = [];
    saveFavorites();
    renderFavorites();
    historyItem_paddingtoprebuild();
  }
};

renderHistory();
renderFavorites();

function customSearchEvent() {
  codeHover = document.querySelector('input.gsc-input').value;
  var customSearchEventCode = document.querySelector('input.gsc-input').value;
  if (!historyArr.includes(customSearchEventCode) && customSearchEventCode !== "") {
    historyArr.push(customSearchEventCode);
    historyArrTitle.push(customSearchEventCode);
    saveHistory();
    renderHistory();
  } else if (historyArr.includes(customSearchEventCode) && customSearchEventCode !== "") {

    historyArr = historyArr.filter(num => num !== customSearchEventCode);
    historyArr.push(customSearchEventCode);


    // 找到第一个包含 customSearchEventCode 的项
    const index = historyArrTitle.findIndex(item =>
      typeof item === 'string' && item.includes(customSearchEventCode)
    );

    if (index !== -1) {
      // 取出该元素
      const [matchedItem] = historyArrTitle.splice(index, 1);
      // 重新添加到末尾
      historyArrTitle.push(matchedItem);
    }

    /*
    for (let i = historyArrTitle.length - 1; i >= 0; i--) {
      if (historyArrTitle[i].includes(customSearchEventCode)) {
        historyArrTitle.splice(i, 1); // 删除当前元素
      }
    }
    historyArrTitle.push(customSearchEventCode);
    */

    saveHistory();
    renderHistory();
  } else {
    console.log("Error: Unable to update history.");
  }
  historyItem_normal();
  historyItem_highlights();
  historyItem_paddingtoprebuild();
  return customSearchEventCode;
}

function historyItem_highlights() {
  document.querySelectorAll('.history-item').forEach(span => {
    if (span.textContent.includes(codeHover)) {
      console.log(span.textContent)
      span.classList.add('gradient-button');
    }
  });
}

function historyItem_normal() {
  document.querySelectorAll('.history-item').forEach(span => {
    if (!span.textContent.includes(codeHover)) {
      span.classList.remove('gradient-button');
    }
  });
}

function historyItem_percent() {
  if (!window.dataList) {
    console.log("dataList 未定义，无法计算统计数据");
    setTimeout(() => {
      historyItem_percent();
    }, 1500);
    return;
  }
  const selectedCategory = categorySelect.value;
  const uniqueById = dataList[selectedCategory].filter((item, index, self) =>
    index === self.findIndex(t => t.番号 === item.番号)
  );

  window.uniqueById = uniqueById;

  const matchedCount = historyArr.reduce((count, historyItem) => {
    const isMatched = dataList[selectedCategory].some(dataItem => dataItem.番号 === historyItem);
    return count + (isMatched ? 1 : 0);
  }, 0);
  const proportion = dataList[selectedCategory].length > 0 ? (matchedCount / dataList[selectedCategory].length) * 100 : 0;
  console.log(`已抽取番号数量: ${matchedCount}`);
  console.log(`匹配比例: ${proportion.toFixed(4)}%`);
  console.log("数组名称: " + "dataList['" + selectedCategory + "']");
  console.log(`番号实际存在数量: ${dataList[selectedCategory].length}`);
  console.log("按番号属性去重后的数量:", uniqueById.length);
  document.getElementById('count').textContent = uniqueById.length;
  document.getElementById('countHas').textContent = matchedCount;
  document.getElementById('percent').textContent = proportion.toFixed(1) + '%';
}

function addGlobalListener() {
  setTimeout(() => {
    if (isScriptLoaded()) {
      var button = document.querySelector('.gsc-search-button.gsc-search-button-v2');
      button.addEventListener('click', () => {
        setTimeout(() => {
          customSearchEvent();
        }, 1000);
        console.log('按钮被点击！');
      });
      const input = document.querySelector('input[autocomplete]');
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
          console.log('带有 autocomplete 属性的输入框中按下回车！');
          console.log('输入内容:', input.value);
          setTimeout(() => {
            customSearchEvent();
          }, 1000);
        }
      });
      document.querySelector('.container-search').classList.add('hidden');
    } else {
      document.querySelector('div.search-area').classList.add('show');
      historyItem_paddingtoprebuild();
      if (document.getElementById('alert') == null) {
        const alertDiv = document.createElement('div');
        alertDiv.id = 'alert';
        alertDiv.className = 'alert-box';
        const alertText = document.createElement('span');
        alertText.innerHTML = '<br><br><h1 style="color: white;">嘿！朋友，</h1>你的设备现在可以打开<a href="https://www.google.com/search?q=%E6%AF%92%E5%A5%B6%E5%8D%9A%E4%B8%BB" target="_blank">谷歌搜索</a>吗？<br><br>“今晚看什么？”的搜索功能由谷歌提供技术支持，请确保你的设备可以正常使用<a href="https://www.google.com/search?q=%E6%AF%92%E5%A5%B6%E5%8D%9A%E4%B8%BB" target="_blank">谷歌搜索</a>引擎。<br><br><br>';
        alertDiv.appendChild(alertText);
        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.onclick = function () {
          alertDiv.style.display = 'none';
        };
        alertDiv.appendChild(closeButton);
        document.querySelector('div.container-search').appendChild(alertDiv);
      }
    }
  }, 3000);
}

function monitorElementChanges(targetSelector, callback) {
  const targetNode = document.querySelector(targetSelector);
  if (!targetNode) {
    console.error(`Element with selector ${targetSelector} not found`);
    return;
  }
  const observer = new MutationObserver((mutationsList, observer) => {
    callback(mutationsList, observer);
  });
  const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
  };
  observer.observe(targetNode, config);
  return observer;
}

const observer = monitorElementChanges('body', openInNewTab);

function openInNewTab(url) {
  if (document.querySelector('body') !== null) {
    document.querySelector('body').querySelectorAll("a[target='_self']").forEach(link => {
      if (link.getAttribute('href') !== 'https://limbopro.com/tools/jwksm/') {
        link.setAttribute('target', '_blank');
      }
    });
  }
}


// 去重函数 示例

function oriJsonMake() {
  let arrayDataList;
  if (!Array.isArray(dataList)) {
    console.warn('dataList 不是数组，正在转换为数组:', typeof dataList);
    arrayDataList = [dataList];
  } else {
    arrayDataList = dataList;
  }
  const deduplicatedDataList = arrayDataList.map(item => {
    const result = {};
    for (const key in item) {
      if (Array.isArray(item[key])) {
        result[key] = Array.from(
          new Map(item[key].map(subItem => [subItem.番号, subItem])).values()
        );
      } else {
        result[key] = item[key];
      }
    }
    return result;
  });
  console.log(JSON.stringify(deduplicatedDataList, null, 2));
}

function unique(newJson_name, oldJson_name, outputChoice = "unique", outputduplicatesChoice = newJson_name) {
  const aIds = new Set(oldJson_name.map(item => item.番号));
  const duplicateIds = [...new Set(newJson_name.map(item => item.番号).filter(id => aIds.has(id)))];
  const duplicates = outputduplicatesChoice.filter(item => duplicateIds.includes(item.番号));
  const seenIds = new Set();
  const uniqueB = newJson_name.filter(item => {
    if (!seenIds.has(item.番号)) {
      seenIds.add(item.番号);
      return !aIds.has(item.番号);
    }
    return false;
  });
  if (outputChoice === "unique") {
    console.log("\n去重后的newJson，包含不在 oldJson 中的番号：");
    console.log(JSON.stringify(uniqueB, null, 2));
  } else {
    console.log("\nnewJson重复的部分，包含在 oldJson 中的番号：");
    console.log(JSON.stringify(duplicates, null, 2));
  }
}



function selectElementText(element) {
  // 1. 确保浏览器支持 Selection API
  if (window.getSelection && document.createRange) {

    // 2. 创建一个 Range 对象
    const range = document.createRange();

    // 3. 将 Range 对象的边界设置到目标元素的起始和结束位置
    // 这意味着 Range 将包含目标元素内的所有子节点和文本
    range.selectNodeContents(element);

    // 4. 获取当前的 Selection 对象
    const selection = window.getSelection();

    // 5. 在设置新 Range 之前，先清除任何现有的 Selection (防止叠加)
    selection.removeAllRanges();

    // 6. 将新的 Range 添加到 Selection 中，从而高亮显示文本
    selection.addRange(range);

    //// console.log(`成功高亮选取了 ID 为 ${element.id} 的元素内的所有文本。`);

    // 注意：虽然文本被高亮了，但浏览器安全限制通常不允许
    // JS 在没有用户交互的情况下将文本自动复制到剪贴板。

  } else {
    console.warn('您的浏览器不支持Selection API，无法模拟文本高亮选取。');
  }
}