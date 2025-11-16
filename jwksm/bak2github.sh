#!/bin/bash

cd /home/typecho/tools/jwksm
cp ./*.js NSFW
cp ./*.* NSFW/jwksm
cp -r bestrated NSFW/jwksm
cp -r mostwanted NSFW/jwksm
cp -r others NSFW/jwksm
rm /home/typecho/tools/NSFW/jwksm/bak2github.sh


echo -n "输入 1 确认提交GitHub，其他取消: "
read input

if [ "$input" = "1" ]; then
    cd /home/typecho/tools/jwksm/NSFW
    rm NSFW/jwksm/bak2github.sh
git add .
git pull
git commit -m 'jwksm'
git push
    echo "提交完成！"
else
    echo "已取消操作。"
fi


