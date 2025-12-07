
// 控制台获取 dataList 复制到 ori.json
//// console.log(JSON.stringify(dataList, null, 2)); // 格式化输出，带缩进
//// deduplicateByNumberMaxFav(dailyBestW['old'])
/// console.log(JSON.stringify(deduplicateByNumberMaxFav(dailyBestW['old']), null, 2)) //  单数组去重

function oriJsonMake1() {

    // 将 dataList(全部) 转换为数组 去重 复制到 ori.json
    let arrayDataList;
    if (!Array.isArray(dataList)) {
        console.warn('dataList 不是数组，正在转换为数组:', typeof dataList);
        arrayDataList = [dataList]; // 将对象包装为单元素数组
    } else {
        arrayDataList = dataList; // 已经是数组，直接使用
    }

    // 对 arrayDataList 中每个对象的每个键值对进行去重
    const deduplicatedDataList = arrayDataList.map(item => {
        const result = {};
        // 遍历对象的所有键
        for (const key in item) {
            if (Array.isArray(item[key])) {
                // 对每个数组基于 "番号" 去重，保留最后一个记录
                result[key] = Array.from(
                    new Map(item[key].map(subItem => [subItem.番号, subItem])).values()
                );
            } else {
                // 非数组键直接复制
                result[key] = item[key];
            }
        }
        return result;
    });

    // 输出去重后的结果到控制台

    // window.ori = result;

    console.log(JSON.stringify(deduplicatedDataList, null, 2));

}

// oriJsonMake1()



//// 获取两个数组中番号重复的部分 
// intersection(dataList['2025年最想要[已翻译]'],dataList['2025年最想要[未翻译]')
function intersection(a, b) { // dataList['2025年最想要[已翻译]'] , dataList['2025年最想要[未翻译]']
    const intersection = a.filter(itemA =>
        b.some(itemB => itemB.番号 === itemA.番号)
    );
    console.log(JSON.stringify(intersection, null, 2));
}









// 若还有 D、E... 请继续添加
// const arrays = [A, B, C];  // 按顺序排列：A→B→C→...
// 多个数组中重复的部分

function historyBest1(abcd) {
    const arrays = abcd // 按顺序排列：A→B→C→
    const result = [];

    for (let i = 1; i < arrays.length; i++) {
        const prev = arrays[i - 1];
        const curr = arrays[i];

        const prevCodes = new Set(prev.map(x => x.番号));
        const duplicatesInCurrent = curr.filter(x => prevCodes.has(x.番号));

        result.push(...duplicatesInCurrent);
    }

    console.log(JSON.stringify(result, null, 2));
    return result;
}

// var ihistoryBest = historyBest1([dataList['出轨🍷'], dataList['巨乳🐻'], dataList['人妻👰'], dataList['泳装👙'], dataList['多P👥'], dataList['肉漫改编✍️'], dataList['办公室🤤'], dataList['制服诱惑👩🏻‍💼'], dataList['2025年最想要[未翻译]']])



// [...A, ...B, ...C]
// 假设 all 是你的综合数组，A 是要移除的参照数组
// const allWithoutwfy = dataList['全部分类'].filter(item => 
//   !dataList['2025年最想要[未翻译]'].some(a => a.番号 === item.番号)
// );







// 按收藏人数排序
// 排序：收藏人数从多到少，非数字排末尾

/**
 * 按“收藏人数”降序排序数据，并美化输出到控制台
 * @param {Array<Object>} data - 待排序的数据数组，每个对象需包含 `收藏人数` 字段
 * @returns {Array<Object>} 排序后的数组（原地排序）
 */


function sortByFavoritesDesc(data) {
    const toNumber = (v) => {
        if (typeof v === 'number') return v;
        const n = parseInt(v, 10);
        return isNaN(n) ? -1 : n; // 无法解析的视为 -1，排在后面
    };

    // 原地排序（降序）
    data.sort((a, b) => toNumber(b.收藏人数) - toNumber(a.收藏人数));

    // 美化输出
    console.log(JSON.stringify(data, null, 2));

    return data;
}





// 仅对重复番号进行去重，保留最后一个记录 dataList['全部分类'] dataList['靓女'] 出轨🍷 dataList['人妻👰'] 巨乳🐻 泳装👙 多P👥 夫妻交换🎎

/**
 * 按「番号」去重，保留收藏人数最多的记录，并输出到控制台
 * @param {Array|Object} data - 原始数据（数组或对象）
 * @param {string} [label='去重结果'] - 控制台输出的标签名（可选）
 * @returns {Array} 去重后的数组
 */

/**
 * 
 * /// console.log(JSON.stringify(deduplicateByNumberMaxFav(dailyBestW['old']), null, 2)) //  单数组去重
 * 
*/

function deduplicateByNumberMaxFav(data, label = '去重结果', consoleChoice) {
    // ------------------- 统一转成数组 -------------------
    // console.log(JSON.stringify(deduplicateByNumberMaxFav(dailyBestW['old']), null, 2)) //  单数组去重
    // console.log(JSON.stringify(deduplicateByNumberMaxFav(dataList['本月热门🔥🔞']), null, 2)) //  单数组去重
    let arrayDataList;
    if (!Array.isArray(data)) {
        console.warn('data 不是数组，正在转换为数组:', typeof data);
        arrayDataList = Object.values(data);
    } else {
        arrayDataList = data;
    }

    // ------------------- 标准化收藏人数 -------------------
    const normalized = arrayDataList.map(item => {
        const fav = parseInt(item.收藏人数, 10);
        return {
            ...item,
            __favNum: isNaN(fav) ? 0 : fav
        };
    });

    // ------------------- 按番号分组，保留收藏最多 -------------------
    const map = new Map();
    for (const item of normalized) {
        const key = item.番号;
        const existing = map.get(key);

        if (!existing || item.__favNum > existing.__favNum) {
            map.set(key, item);
        }
    }

    // ------------------- 移除临时字段 -------------------
    const result = Array.from(map.values()).map(({ __favNum, ...rest }) => rest);

    // ------------------- 控制台输出 JSON（美化格式） -------------------

    if (consoleChoice == 'yes') {
        console.log(`\n${label}:`);
        console.log(JSON.stringify(result, null, 2));
    }

    //return result;

    window.newjson = result;
    return result
}



// 数组对比后 去重

// unique(dataList['全部分类'], dataMax['bestrated_translated'])

function unique(newJsonx, oldJsonx) { // 想获得 newJsonx 中对于 oldJsonx 中唯一的部分

    var newJson = newJsonx
    var oldJson = oldJsonx

    // Find duplicate 番号 values between A and B
    const aIds = new Set(oldJson.map(item => item.番号));
    const duplicateIds = [...new Set(newJson.map(item => item.番号).filter(id => aIds.has(id)))];

    // Get full objects for duplicate 番号 values from B
    const duplicates = newJson.filter(item => duplicateIds.includes(item.番号));

    // Remove duplicates from B based on 番号 and find unique entries not in A
    const seenIds = new Set();
    const uniqueB = newJson.filter(item => {
        if (!seenIds.has(item.番号)) {
            seenIds.add(item.番号);
            return !aIds.has(item.番号);
        }
        return false;
    });

    // Output results
    // console.log("Duplicate 番号 values between oldJson.json and newJson.json:");
    // console.log(duplicates);
    console.log("\n去重后的newJson，包含不在oldJsonx中的番号：");
    console.log(JSON.stringify(uniqueB, null, 2));
    // console.log(uniqueB);

}





async function loadJsonFiles() {

    // 定义要加载的 JSON 文件列表
    const files = ['brother.json', 'zhifuyouhuo.json', 'yongzhuang.json', 'wwr.json', 'teacher.json', 'siwoldJson.json', 'roumangaibian.json', 'renqi.json', 'office.json', 'mom.json',
        'koubao.json', 'juru.json', 'jiazhengfuwu.json', 'fitness.json', 'father.json', 'duop.json', 'chugui.json', 'brother.json', '3p.json', '2024best.json'
    ]; // 示例文件列表
    const dataMax = {};

    try {
        // 使用 Promise.all 并行加载所有文件
        const responses = await Promise.all(
            files.map(file =>
                fetch(`./${file}`).then(response => {
                    if (!response.ok) throw new Error(`无法加载 ${file}`);
                    return response.json().then(json => ({ name: file.split('.')[0], json }));
                })
            )
        );

        // 将解析后的 JSON 数据存入 dataMax 对象，以文件名（去掉扩展名）作为键
        responses.forEach(({ name, json }) => {
            dataMax[name] = json;
        });

        // 访问数据
        console.log(dataMax.duop);

        // return dataMax; // 返回数据对象

    } catch (error) {
        console.error('错误:', error);
    }

}

// 调用函数
// loadJsonFiles();