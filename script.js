const version = "3.4.0.5";
const lang = /\/en\//.test(document.location.href) ? 0 : 1;
const texts = {
    bit: ["100bit History: Volume", "100bitの履歴"][lang],
    change: ["Changelog", "変更ログ"][lang],
    dbcbb: ["You are using Xyvyrianeth's Dan-Ball Comment Board Beautifier!", "ＸｙｖｙｒｉａｎｅｔｈのＤＡＮ－ＢＡＬＬの掲示板の美化するを使用しています！"][lang],
    discord: ["Join our Discord server!", "Discordサーバーに参加する！"][lang],
    donate: ["Consider donating", "寄付を検討するください"][lang],
    minute: ["Less than a minute ago.", "1分未満"][lang],
    months: ["Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec", "1月 ２月 ３月 ４月 ５月 ６月 ７月 ８月 ９月 １０月 １１月 １２月"][lang],
	pg: ["Powder Game", "粉遊び"][lang],
	pg2: ["Powder Game 2", "粉遊び2"][lang],
    pgPostGone: ["UPLOAD NO LONGER EXISTS", "アップロードはもう存在しません"][lang],
    pgPostLoad: ["Upload information loading...", "アップロードの情報を読み込んでいます"][lang],
    timeErr: ["There was an error in time conversion.", "時間変換にエラーがありました"][lang],
    version: ["Version", "バージョン"][lang],
    viewUpload: ["Click to view this user's uploads", "クリックしてこのユーザーのアップロードを表示します"][lang],
    votes: [" votes", "票"][lang],
    website: ["Website", "ウェブサイト"][lang],
}
Object.defineProperty(String.prototype, 'embed', {
	value: function() {
		const linkRegex = /(\s*)<a href="\/\/dan-ball\.jp\/(?:jump\/[a-zA-Z0-9/+]{1,}|(?:en\/|)javagame\/(?:(?:dust2?\/\?code=[0-9]+|dust2?\/[0-9]+\.html)|bit\/[0-9]+\.html+)\/?)" target="_top">((?:(?:https?|ftps?|blob|wss?):\/*(?:www\.|)|www\.)(?:[a-zA-Z0-9:/\\~#?*=()_.,-]|&amp;|%[0-9a-f]{2}){2,})<\/a>(\s*)/;
		return String(this).replace(new RegExp(linkRegex, 'g'), function(a) {
			const link = a.replace(linkRegex, "$2");
			const trail = a.replace(linkRegex, "$1|$3").split('|');

			// Powder Game Uploads
			if (/https?:\/\/dan-ball\.jp\/(?:en\/|)javagame\/(?:dust2?\/\?code=[0-9]+|dust2?\/[0-9]+\.html)/.test(link))
			{
				const lg = link.match(/en\//) !== null ? "en/" : '';
				const up = link.replace("dust2", '').match(/[0-9]+/)[0];
				const pg = link.match(/dust2?/)[0] == "dust" ? 0 : 1;
				const i1 = up.length > 3 ? up.substring(0, up.length - 3) + ["000/", '/'][pg] : "0/";
				const i2 = [".gif", ".png"][pg];

				const test = new XMLHttpRequest();
				test.open("GET", document.location.href.match(/https?/)[0] + link.replace(/https?/, ''), true);
				test.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200)
					{
						const rows = this.response.split('\n').filter(x => x.startsWith("<SCRIPT>dust12_view"));
						const divs = [].slice.call(document.getElementsByClassName(["dust", "dust2"][pg] + up));
						if (rows.length == 0)
						{
							return divs.forEach(div => div.children[0].children[1].innerText = texts.pgPostGone);
						}

						divs.forEach(div => {
							const line = rows[0].replace(/<\/?SCRIPT>/g, '');
							const info = JSON.parse(line.substring(16, line.length - 5).replace(/'/g, '"') + ']').splice(0, 5);
							const time = localizedTime(info[4], lg == "en/" ? 0 : 1);
							const star =
								`<div class="dust-star" style="display: inline-block;"><div class="dust-star_color dust-star_c${
									info[2] <  10 ? `0" style="left:${(Math.round((info[2] -  0) * 6.11) - 55)}px;">` :
									info[2] <  50 ? `1" style="left:${(Math.round((info[2] -  9) * 1.37) - 55)}px;">` :
									info[2] < 100 ? `2" style="left:${(Math.round((info[2] - 49) * 1.12) - 55)}px;">` :
									info[2] < 500 ? `3" style="left:${(Math.round((info[2] - 99) * 0.12) - 55)}px;">` : '4">'
								}</div><span class="dust-star_span"></span></div>`;

							div.innerHTML =
								`<div class="dust" style="height: ${[76, 71][pg]}px;">` +
									`<div class="dust-left">` +
										`<img class="dust-preview" src="https://dan-ball.jp/images/${["dust", "dust2"][pg]}/${i1}${up}${i2}" width="${[100, 124][pg]}" height="${[75, 70][pg]}">` +
									`</div>` +
									`<div class="dust-right" style="margin-left: ${[102, 126][pg]}px;">` +
										`<font class="dust-name">${utf8_hex(info[1])}</font>` +
										`<br>` +
										`by <font class="dust-author uploader">${utf8_hex(info[3])}</font>` +
										`<br>` +
										`${star}<font class="dust-votes"> ${info[2]}${texts.votes}</font>` +
										`<br>` +
										`<font class="dust-time" title="${time[1]}">${time[0]}</font>` +
										`<br>` +
										`<font class="dust-game">${texts[["pg", "pg2"][pg]]}</font>`+
									`</div>` +
								`</div>`;
						});
					}
				}
				test.send();

				return `<a class="${["dust", "dust2"][pg] + up}" class="dust-link" href="https://dan-ball.jp/${lg}javagame/${["dust", "dust2"][pg]}/?code=${up}" target="_blank">` +
						`<div class="dust dust-loading" style="height: ${[76, 71][pg]}px;">` +
							`<div class="dust-left>` +
								`<img class="dust-preview" src="https://dan-ball.jp/images/${["dust", "dust2"][pg]}/${i1}${up}${i2}" width="${[100, 124][pg]}" height="${[75, 70][pg]}">` +
							`</div>` +
							`<div class="dust-right" style="margin-left: ${[102, 126][pg]}px;">` +
								`<font class="dust-other">${texts.pgPostLoad}</font>` +
							`</div>` +
						`</div>` +
					`</a>` +
					`<br>`;
			}

			// 100bit Histories
			if (/https?:\/\/dan-ball.jp\/(?:en\/|)javagame\/bit\/(?:ja\/|)[0-9]{1,3}.html/.test(link))
			{
				const lg = link.match(/en\//) !== null ? "en/" : '';
				const up = link.match(/[0-9]{1,3}.html/)[0].replace(".html", '');
				const ja = link.match(/ja\//) !== null ? "ja/" : '';
				return `<a href="https://dan-ball.jp/${lg}javagame/bit/${ja}${up}.html" target="_blank">` +
						`<div class="bit">` +
							`<font>${texts.bit} ${up}</font>` +
							`<br>` +
							`<img src="https://dan-ball.jp/images/bit/0/${up}.png" width="256" height="192">` +
						`</div>` +
					`</a>` +
					`<br>`;
			}

			// Other types of links
			return /(?:mp4|webm|gifv)$/i.test(link) ?
					// Video File
					`<br>` +
					`<video class="bbs-video" title="${link}" loop autoplay>` +
						`<source src="${((link.startsWith("http")) ? "" : "http://") + link}" type="video/${link.match(/(?:mp4|webm|gifv)$/i)[0]}">` +
					`</video>` +
					`<br>` :
				/(?:jpg|png|bmp|gif|jpeg|svg)$/i.test(link) ?
					// Image File
					`<br>` +
					`<a href="${((link.startsWith("http")) ? "" : "http://") + link}" target="_blank">` +
						`<img class="bbs-image" title="${link}" src="${link}">` +
					`</a>` +
					`<br>` :
				/(?:mp3|wav|ogg)$/i.test(link) ?
					// Audio File
					`<br>` +
					`<audio title="${link}" controls>` +
						`<source src="${((link.startsWith("http")) ? "" : "http://") + link}" type="audio/${link.match(/(?:mp3|wav|ogg)$/i)[0]}>` +
					`</audio>` +
					`<br>` :
				/https?:\/\/(?:(www|m)\.youtube\.com\/watch\?v=[a-zA-Z0-9-_]{11}|www\.youtu\.be\/[a-zA-Z0-9-_]{11})/i.test(link) ?
					// YouTube Link
					`<br>` +
					`<iframe width="420" height="315" src="https://www.youtube.com/embed/${link.match(/[a-zA-Z0-9-_]{11}/g)[0]}">` +
					`</iframe>` +
					`<br>` :
				// Normal Link
				`${trail[0]}<a href="${link}" target="_blank">${link}</a>${trail[1]}`;
    	});
	}
});
localizedTime = function(oldTime, l) {
	oldTime = oldTime.replace(',', ' ').split(' ');
	const dif = new Date().getTimezoneOffset() + 540;
	const timestamp = l == 0 ?
		["Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(' ').indexOf(oldTime[0]), oldTime[1], oldTime[2], oldTime[3].split(':')[0], oldTime[3].split(':')[1]] :
		[oldTime[0].split('/')[1] - 1, oldTime[0].split('/')[2], oldTime[0].split('/')[0], oldTime[1].split(':')[0], oldTime[1].split(':')[1]];
	const newDate = new Date();
		newDate.setFullYear(timestamp[2]);
		newDate.setMonth(timestamp[0]);
		newDate.setDate(timestamp[1]);
		newDate.setHours(timestamp[3] - Math.floor(dif / 60));
		newDate.setMinutes(timestamp[4] - (dif % 60));
		newDate.setSeconds(0);
	const time = [
		[	texts.months.split(' ')[newDate.getMonth()],
			newDate.getDate() + ",",
			newDate.getYear() + 1900,
			(newDate.getHours() < 10 ? '0' : '') + newDate.getHours() + ":" + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes() ].join(' '),
		`${newDate.getYear() + 1900}/${newDate.getMonth() + 1}/${newDate.getDate()} ${(newDate.getHours() < 10 ? '0' : '') + newDate.getHours()}:${(newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes()}` ][lang];
	const difference = new Date() - newDate;
	const timeTitle =
		difference > 31536000000	? [`Over ${Math.floor(difference / 31536000000)	} year${(Math.floor(difference / 31536000000)	> 1 ? "s" : "")} ago.`, `${Math.floor(difference / 31536000000)}年以上前`][lang] :
		difference > 2592000000		? [`Over ${Math.floor(difference / 2592000000)	} month${(Math.floor(difference / 2592000000)	> 1 ? "s" : "")} ago.`, `${Math.floor(difference / 2592000000)}月以上前`][lang] :
		difference > 86400000		? [`Over ${Math.floor(difference / 86400000)	} day${(Math.floor(difference / 86400000)		> 1 ? "s" : "")} ago.`, `${Math.floor(difference / 86400000)}日以上前`][lang] :
		difference > 3600000		? [`Over ${Math.floor(difference / 3600000)		} hour${(Math.floor(difference / 3600000)		> 1 ? "s" : "")} ago.`, `${Math.floor(difference / 3600000)}時間以上前`][lang] :
		difference > 60000			? [`Over ${Math.floor(difference / 60000)		} minute${(Math.floor(difference / 60000)		> 1 ? "s" : "")} ago.`, `${Math.floor(difference / 60000)}分以上前`][lang] :
		difference < 0				? texts.timeErr : texts.minute;

	return [time, timeTitle];
};
view_posts = user => {
	const f = document.createElement('form');
	document.body.appendChild(f);
	const v = {
		s: user,
		o: 'v',
		e: '2',
		k: '0',
		t: 'a' };
	for (let k in v)
	{
		let i = document.createElement('input');
			i.setAttribute('type', 'hidden');
			i.setAttribute('name', k);
			i.setAttribute('value', v[k]);
		f.appendChild(i);
	}
	f.setAttribute('action', {
		"dust": "/en/javagame/dust/search/",
		"dust2": "/en/javagame/dust2/search.html",
		"ranger": "/en/javagame/ranger/versus.html" }[window.location.href.match(/(?:dust2|dust|ranger)/)[0]] );
	f.setAttribute('method','post');
	f.setAttribute('target', '_blank');
	f.submit();
};
utf8_hex = t => {
    var r = [], c;
    for (var i = 0; i < t.length; i += 2)
    {
        r.push(parseInt(t.substr(i, 2), 16));
    }
    t = r;
    r = '';
    while (j = t.shift())
    {
        if (j <= 0x7f)
		{
			r += String.fromCharCode(j);
		}
        else
        if (j <= 0xdf)
		{
			c = ((j & 0x1f) << 6);
            c += t.shift() & 0x3f;
            r += String.fromCharCode(c);
		}
        else
        if (j <= 0xe0)
		{
			c = ((t.shift() & 0x1f) << 6) | 0x0800;
            c += t.shift() & 0x3f;
            r += String.fromCharCode(c);
		}
        else
		{
			c = ((j & 0x0f) << 12);
            c += (t.shift() & 0x3f) << 6;
            c += t.shift() & 0x3f;
            r += String.fromCharCode(c);
		}
    }
    return r;
};

[].slice.call(document.getElementsByClassName("bbs")).forEach(bb => {
	const name = bb.children[1].innerText;
	const tag = bb.children[0].innerText.substring(0, 9);
	const time = localizedTime(bb.children[0].innerText.substring(10), lang);
	const text = bb.innerHTML.split("</div>")[2].embed();
	const color = bb.style.color;
	const newOuterHTML =
		`<div class="bbs" style="color: ${color}">` +
			`<div class="bbs_tm bbs_time" title="${time[1]}">` +
				`${time[0]}` +
			`</div>` +
			`<div class="bbs_nm bbs_name ${bb.children[1].classList.contains("bbs_b") ? "bbs_b uploader" : ''}">` +
				`${name}` +
			`</div>` +
			`<div class="bbs_nm bbs_tag">` +
				`${tag}` +
			`</div>` +
			`<div class="bbs_text">` +
				`${text}` +
			`</div>` +
		`</div>`;

	bb.outerHTML = newOuterHTML;
});

[].slice.call(document.getElementsByClassName("uploader")).forEach(name => {
	name.onclick = function() { view_posts(name.innerText); };
	name.title = texts.viewUpload;
	name.style.cursor = "pointer";
	name.style.color = "#0000FF";
});

document.getElementById("mrw_ads").remove();
document.getElementsByClassName("tt")[1].outerHTML = document.getElementsByClassName("tt")[1].outerHTML.replace("</div>", `<br><br>${texts.dbcbb}<br>${texts.version} ${version} | <a href="https://sites.google.com/view/danball-cbb/home" target="_blank" rel="noopener">${texts.website}</a> | <a href="https://sites.google.com/view/danball-cbb/changelog" target="_blank" rel="noopener">${texts.change}</a> | <a href="https://paypal.me/Xyvyrianeth" target="_blank" rel="noopener">${texts.donate}</a></div>`);

const widgetText = document.createElement("p");
    widgetText.innerText = texts.discord;
    widgetText.style.fontSize = "16px";
    widgetText.style.marginBottom = "2px";
document.getElementById("middle_ru").appendChild(widgetText);
const widget = document.createElement("iframe");
    widget.id = "widget";
    widget.src = "https://discord.com/widget?id=250066523346042881&theme=dark";
    widget.width = 300;
    widget.height = 400;
    widget.allowTransparancy = true;
document.getElementById("middle_ru").appendChild(widget);

console.log('%c' + texts.dbcbb, "color: #b00edf; font-size: 30px");