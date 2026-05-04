(function(){
  const seedWorkers = [
    {id:'siti',name:'西蒂 Siti',rating:4.8,hot:true,status:'可立即上工',statusClass:'ok',country:'印尼',age:30,gender:'女',exp:2,area:'雙北',lang:'中文可溝通',care:'失智症、長期臥床者',skills:'老人照護、基本護理、中文可溝通',tags:['在台可速配','溫和有耐心','細心愛乾淨'],source:'seed',approved:true,documents:['居留證','護照']},
    {id:'maria',name:'瑪麗亞 Maria',rating:4.6,status:'目前不可',statusClass:'no',country:'菲律賓',age:29,gender:'女',exp:4,area:'台中',lang:'英文流利、中文基礎',care:'行動不便、陪伴就醫',skills:'流利英文、輪椅移位、緊急急救',tags:['流利英文','前雇主高評價'],source:'seed',approved:true,documents:['護照']},
    {id:'triana',name:'翠安娜 Triana',rating:4.9,hot:true,status:'可立即上工',statusClass:'ok',country:'印尼',age:41,gender:'女',exp:10,area:'全台',lang:'中文流利、台語聽得懂',care:'重度失能、重病照護',skills:'抽痰、翻身拍背、略懂台語',tags:['10年以上資歷','會聽台語','會煮台菜','具醫療護理背景'],source:'seed',approved:true,documents:['居留證','護照','體檢證明']},
    {id:'nguyen',name:'阿梅 Nguyen Thi Ma',rating:4.5,status:'資料審核中',statusClass:'review',country:'越南',age:35,gender:'女',exp:6,area:'高雄',lang:'基本中文',care:'醫院看護、中風復健協助',skills:'復健關節活動、基本中文',tags:['作息規律','復健協助'],source:'seed',approved:false,documents:['護照']}
  ];
  const seedChats = [
    {id:'chat-triana',workerId:'triana',workerName:'翠安娜 Triana',employerName:'王小姐',caseTitle:'台北市大安區｜長期住家看護',updatedAt:'2026/05/04 10:20',messages:[{from:'worker',text:'老闆您好，我是翠安娜。我可以照顧失智與臥床長輩，也會鼻胃管灌食與翻身拍背。'},{from:'employer',text:'您好，我們家阿公中風後需要協助翻身、餵食與陪伴就醫。'},{from:'worker',text:'我有照顧中風長輩的經驗，可以協助。請問阿公晚上需要起床幾次？'}]},
    {id:'chat-siti',workerId:'siti',workerName:'西蒂 Siti',employerName:'林先生',caseTitle:'新北市板橋區｜失智長者陪伴',updatedAt:'2026/05/04 09:10',messages:[{from:'employer',text:'我們家長輩偶爾會夜間躁動，妳是否能配合？'},{from:'worker',text:'可以，我之前照顧過失智阿嬤，會先安撫情緒並通知家屬。'}]}
  ];
  const seedEmployers = [
    {id:'case-taipei-1',title:'台北市大安區｜長期住家看護',city:'台北市',homeType:'大樓',mobility:'輪椅，需要移位協助',communication:'可簡單溝通，夜間需協助 1-2 次',languages:'中文、台語',careType:'中風後復健、鼻胃管、血糖監測',weight:'60-70公斤',startDate:'2026-06-01',salary:'32,000/月',status:'已取得招募許可',hiddenDisease:'中風後右側無力，家屬希望可協助復健關節活動。'},
    {id:'case-banqiao-1',title:'新北市板橋區｜失智長者陪伴',city:'新北市',homeType:'公寓',mobility:'可扶持行走',communication:'輕度失智，偶有夜間躁動',languages:'中文',careType:'失智照護、防走失、簡易家務',weight:'50-60公斤',startDate:'2026-05-20',salary:'31,000/月',status:'國內推介完成',hiddenDisease:'需要耐心溝通，偶爾抗拒洗澡。'}
  ];
  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback}catch(e){return fallback}}
  function write(key,val){localStorage.setItem(key,JSON.stringify(val))}
  window.MCPStore={
    init(){if(!localStorage.getItem('mcp_workers'))write('mcp_workers',seedWorkers);if(!localStorage.getItem('mcp_employers'))write('mcp_employers',seedEmployers);if(!localStorage.getItem('mcp_logs'))write('mcp_logs',[{time:new Date().toLocaleString('zh-TW'),text:'系統初始化示範資料'}]);if(!localStorage.getItem('mcp_chats'))write('mcp_chats',seedChats)},
    getWorkers(){this.init();return read('mcp_workers',[])},
    saveWorkers(rows){write('mcp_workers',rows)},
    upsertWorker(worker){const rows=this.getWorkers();const i=rows.findIndex(x=>x.id===worker.id);if(i>=0)rows[i]=worker;else rows.unshift(worker);this.saveWorkers(rows);this.log(`移工 ${worker.name} 更新/上傳履歷資料`)},
    setApproval(id,approved){const rows=this.getWorkers();const w=rows.find(x=>x.id===id);if(w){w.approved=approved;w.statusClass=approved?'ok':'review';w.status=approved?'可立即上工':'資料審核中';this.saveWorkers(rows);this.log(`${w.name} 審核狀態：${approved?'通過':'待審'}`)}},
    deleteWorker(id){const rows=this.getWorkers().filter(x=>x.id!==id);this.saveWorkers(rows);this.log(`刪除移工資料：${id}`)},
    getEmployers(){this.init();return read('mcp_employers',[])},
    saveEmployers(rows){write('mcp_employers',rows)},
    getChats(){this.init();return read('mcp_chats',[])},
    saveChats(rows){write('mcp_chats',rows)},
    appendChat(workerId, text, from='employer'){const chats=this.getChats();let chat=chats.find(c=>c.workerId===workerId);const w=this.getWorkers().find(x=>x.id===workerId);if(!chat){chat={id:`chat-${workerId||Date.now()}`,workerId,workerName:w?.name||'未命名移工',employerName:'展示雇主',caseTitle:'平台媒合交流',updatedAt:new Date().toLocaleString('zh-TW'),messages:[]};chats.unshift(chat)}chat.messages.push({from,text});chat.updatedAt=new Date().toLocaleString('zh-TW');this.saveChats(chats);this.log(`新增聊天訊息：${chat.workerName}`)},
    log(text){const logs=read('mcp_logs',[]);logs.unshift({time:new Date().toLocaleString('zh-TW'),text});write('mcp_logs',logs.slice(0,50))},
    getLogs(){this.init();return read('mcp_logs',[])},
    reset(){localStorage.removeItem('mcp_workers');localStorage.removeItem('mcp_employers');localStorage.removeItem('mcp_logs');localStorage.removeItem('mcp_chats');this.init()}
  };
  window.MCPStore.init();
})();
