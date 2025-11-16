#!/bin/bash

# --- 变量定义 ---
ARCHIVE_DIR="/home/typecho/tools/jwksm/daily"
TEMP_DIR="/home/typecho/tools/jwksm/temp"
TOOL_DIR="/home/typecho/tools/jwksm/temp" 

# HTML 文件所在的目录 (已根据您最新的路径确认)
HTML_DIR="/home/typecho/tools/jwksm/temp/jable_data"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 脚本启动..."

# 确保目录存在
mkdir -p "$ARCHIVE_DIR"
mkdir -p "$TEMP_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始解析本地目录：$HTML_DIR"

# 核心：运行 Node.js 脚本，传递 HTML 目录、临时目录和归档目录
# Node.js 脚本现在会在内部处理所有文件
node "$TOOL_DIR/jwksm.js" "$HTML_DIR" "$TEMP_DIR" "$ARCHIVE_DIR"

# 检查 Node.js 脚本的退出状态码
if [ $? -eq 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 成功！数据处理和归档完成。"
    
    # --- 成功后的后续操作 ---
    cp /home/typecho/tools/jwksm/daily/daily.json /home/typecho/tools/jwksm/temp/
    cd /home/typecho/tools/jwksm/time
    node generate.js
    cd /home/typecho/tools/jwksm/temp/
    node scrapeData.js
    cp /home/typecho/tools/jwksm/temp/ori.json /home/typecho/tools/jwksm/ori.json 
else
    # Node.js 脚本会打印详细的错误信息
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 失败！请查看上方的 Node.js 错误信息。"
fi