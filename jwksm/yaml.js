const codeBlocks = document.querySelectorAll('code.hljs.yaml');
const keywords = ['交换', '夫妻']; // Add more keywords here as needed
let allText = '';
codeBlocks.forEach(block => {
    allText += block.innerText + '\n';
});
const lines = allText.split('\n');
const matches = lines.filter(line => keywords.some(keyword => line.includes(keyword)));
console.log(matches.join('\n'));