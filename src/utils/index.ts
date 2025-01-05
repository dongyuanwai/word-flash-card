// 单词拆分音节
function syllables(word:any) {
    var letters = word; // 将输入的单词赋值给变量 letters
    var syllablesArray = []; // 初始化一个空数组，用于存储音节

    while (letters.length > 0) { // 当 letters 还有剩余字符时，继续循环
        // 使用正则表达式匹配最后一个音节
        var lastSyllable = letters.match(/(^y|y(?=[aeiou])|bh|ch|gh|sc|wr|ng$|[^aeiouy])?([aeiou]*y?)?([^aeiouy]*)?$/i);
        if (lastSyllable) { // 如果匹配到音节
            var currentSyllable = lastSyllable[0]; // 获取匹配到的音节
            syllablesArray.push(currentSyllable); // 将音节添加到数组中
            var syllableLength = currentSyllable.length; // 获取音节的长度
            var lettersCount = letters.length; // 获取剩余字母的长度
            letters = letters.substr(0, lettersCount - syllableLength); // 去掉已经匹配到的音节部分
            // console.log(letters); // 打印剩余的字母
        }
    }

    if (syllablesArray) { // 如果音节数组不为空
        return syllablesArray.reverse(); // 反转数组并用 "+" 连接音节
    } else {
        return ""; // 如果没有匹配到音节，返回空字符串
    }
}

export { syllables }