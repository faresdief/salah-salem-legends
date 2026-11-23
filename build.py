import re
h=open('index.html',encoding='utf8').read()
h=h.replace('<link rel="stylesheet" href="styles.css">','<style>\n'+open('styles.css',encoding='utf8').read()+'</style>')
h=re.sub(r'<script src="(js/[a-z0-9-]+\.js)"></script>',lambda m:'<script>\n'+open(m.group(1),encoding='utf8').read()+'\n</script>',h)
open('/mnt/user-data/outputs/index.html','w',encoding='utf8').write(h)
print('KB',round(len(h.encode('utf8'))/1024,1),'| external:',re.findall(r'(?:src|href)="(?!data:)[^"]+"',h),'| gradient/purple:',re.findall(r'gradient|purple|violet|magenta',h,re.I) or 'none','| emoji:',len(re.findall('[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\uFE0F]',h)))
