(this["webpackJsonpstatnet-booking-tool"]=this["webpackJsonpstatnet-booking-tool"]||[]).push([[0],{25:function(e,t,a){e.exports=a(48)},30:function(e,t,a){},31:function(e,t,a){},48:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(15),s=a.n(l),o=(a(30),a(22)),c=a(16),i=a(17),u=a(23),p=a(18),m=a(5),d=a(24),f=(a(31),a(11)),h=a.n(f),g=a(21),E=a(9),v=a(7),q=a(8),I=a(19),b=a.n(I),w=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(u.a)(this,Object(p.a)(t).call(this,e))).handleChange=function(e){a.setState({csvfile:e.target.files[0]})},a.importCSV=function(){var e=a.state.csvfile;h.a.parse(e,{complete:a.updateData,header:!1})},a.noteBox=function(e){return r.a.createElement("td",null,r.a.createElement(v.a,{icon:q.a,"data-tip":!0,"data-for":"noteToolTip"}),r.a.createElement(b.a,{id:"noteToolTip",ref:a.tooltip,place:"top",type:"dark",effect:"solid",className:"toolTipWrapper",clickable:!0},r.a.createElement("span",null,e)))},a.handleRequestClick=function(e){var t=a.state.newRequests,n=e.target.id,r=t[n];r.accepted=!a.state.newRequests[n].accepted,a.setState((function(e){return{newRequests:e.newRequests.map((function(e,t){return t===n?r:e}))}}))},a.generateRequestList=function(){for(var e=a.state.newRequests,t=[],n=0;n<e.length;n++)t.push(r.a.createElement("tr",{key:"request_"+n},r.a.createElement("td",null,e[n].requestInfo[0]),r.a.createElement("td",null,e[n].requestInfo[2]+" ("+e[n].requestInfo[1]+")"),r.a.createElement("td",null,e[n].requestInfo[4]+" ("+e[n].requestInfo[5]+")"),r.a.createElement("td",null,e[n].requestInfo[6]+" - "+e[n].requestInfo[7]),e[n].requestInfo[10].length>0?a.noteBox(e[n].requestInfo[10]):r.a.createElement("td",null),r.a.createElement("td",{id:n,onClick:function(e){return a.handleRequestClick(e)}},e[n].accepted?r.a.createElement(v.a,{icon:q.c,style:{pointerEvents:"none"}}):r.a.createElement(v.a,{icon:q.b,style:{pointerEvents:"none"}}))));return t},a.copyToClipboard=function(){a.textArea.select(),document.execCommand("copy")},a.formatAMPM=function(e){var t=e.getHours(),a=e.getMinutes(),n=t>=12?"PM":"AM";return(t=(t%=12)||12)+":"+(a=a<10?"0"+a:a)+" "+n},a.generateOutputCsv=function(e,t){var n=e[1]+"/"+e[2]+"/"+e[0],r=new Date(parseInt(e[0]),parseInt(e[1]-1),parseInt(e[2]),parseInt(t[2].split(":")[0]),parseInt(t[2].split(":")[1])),l=new Date(parseInt(e[0]),parseInt(e[1]-1),parseInt(e[2]),parseInt(t[1].split(":")[0])+2,parseInt(t[1].split(":")[1])+40);return["Statnet "+t[5]+" "+t[6]+" - "+t[7]+" ("+t[4]+")",n,a.formatAMPM(r),n,a.formatAMPM(l),t[10].replace(new RegExp(",","g"),".")]},a.generateBookings=function(){for(var e=a.state.newRequests,t={1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"Maj",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Okt",11:"Nov",12:"Dec"},n="",r=[["Subject","Start Date","Start Time","End Date","End Time","Description"]],l=0;l<e.length;l++){var s=e[l].accepted?"Ja":"Nej",o=e[l].requestInfo[0].split("-");n+=o[2]+" "+t[parseInt(o[1])]+": "+s+"\n",e[l].accepted&&r.push(a.generateOutputCsv(o,e[l].requestInfo))}a.setState({emailMessage:n}),console.log(h.a.unparse(r));var c="data:text/csv;charset=utf-8,"+r.map((function(e){return e.join(",")})).join("\n"),i=encodeURI(c);window.open(i)},a.state={csvfile:void 0,newRequests:[],emailMessage:""},a.updateData=a.updateData.bind(Object(m.a)(a)),a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"updateData",value:function(e){for(var t=e.data,a=3;a<t.length;a++)"Tillfr\xe5gad"===t[a][9]&&this.setState({newRequests:[].concat(Object(o.a)(this.state.newRequests),[{requestId:"request_"+a,accepted:!1,requestInfo:t[a]}])})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"App"},r.a.createElement("h2",null,"Statnet booking CSV generator"),r.a.createElement("input",{className:"csv-input",type:"file",ref:function(t){e.filesInput=t},name:"file",placeholder:null,onChange:this.handleChange}),r.a.createElement("p",null),r.a.createElement(E.a,{onClick:this.importCSV},"Ladda upp fil"),this.state.newRequests.length>0?r.a.createElement("div",{className:"tableWrapper"},r.a.createElement(g.a,{bordered:!0,hover:!0},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Datum"),r.a.createElement("th",null,"CT (pgm)"),r.a.createElement("th",null,"Prod."),r.a.createElement("th",null,"Lag"),r.a.createElement("th",null,"Notering"),r.a.createElement("th",null,"Accepterad"))),r.a.createElement("tbody",null,this.generateRequestList()))):null,r.a.createElement(E.a,{onClick:this.generateBookings,variant:"success"},"Klar"),this.state.emailMessage.length>0?r.a.createElement("div",{className:"emailMessage"},r.a.createElement("h3",null,"Svarsmeddelande att maila till bokning:"),r.a.createElement("textarea",{ref:function(t){return e.textArea=t},value:this.state.emailMessage,readOnly:!0}),r.a.createElement(E.a,{onClick:this.copyToClipboard,variant:"info"},"Kopiera meddelande")):null)}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(w,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[25,1,2]]]);
//# sourceMappingURL=main.7196aea1.chunk.js.map