class Syntax {
	constructor(name) {
		this.id = '';
		this.name = name;
		this.description = '';
		this.type = '';
		this.patterns = [];
		this.example = '';
	}
}

const docHostName = 'AlexLew95';

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(link) {
	let back = await fetch(link)
	.then(function(response) {
		return response.text();
	})
	.then(function(asText) {
		return asText;		
	});
	return back;
}

function compatible() {
    "use strict";

    if (typeof Symbol == "undefined") return false;
    try {
        eval("class Foo {}");
        eval("var bar = (x) => x+1");
    } catch (e) { return false; }

    return true;
}

async function start() {

	if (!compatible()) {
		document.getElementsByClassName('notCompatibleMessage')[0].style.display = 'block';
	}

	const match = window.location.href.match(/(\#.+)$/gm);
	const defaultCard = await request('https://raw.githubusercontent.com/' + docHostName + '/Vixio/master/documentation/card.html');
	let file = await request('https://raw.githubusercontent.com/' + docHostName + '/Vixio/master/documentation/Syntaxes.txt');

	if (defaultCard.includes('404') || file.includes('404')) return;

	file = file
		.replace(/</gmui, '&lt;');

	const lines = file.split('\n');
	const syntax = new Syntax();
	let card = defaultCard;

	document.getElementsByClassName('ldBar')[0].setAttribute('data-max', file.match(/name:\s/gmui).length + 1);
	const loadingBar = new ldBar('.ldBar');

	for (let line of lines) {
		if (!line.match(/\t/gmui)) {
			syntax.type = line
				.toLowerCase()
				.replace(/:/gmui, '');
		} else if (line.match(/\tname:\s/gmui)) {
			let register = true;
			if (Object.values(syntax).includes(undefined)) {
				register = false;
			}
			if (register) {
				card = card
					.replace(/%id%/gmui, syntax.id)
					.replace(/%type%/gmui, syntax.type)
					.replace(/%name%/gmui, syntax.name)
					.replace(/%description%/gmui, syntax.description)
					.replace(
						/%patterns%/gmui,
						syntax.patterns.join('\n')
							.replace(/\b(seen|from|of|in|reply with|append|set|add|remove)\b/gmui, '<span style="color: rgb(69, 134, 239)">$&</span>')
							.replace(/\b(bot|guild|user|member|role|channel|permission|emote|embed)(builder)?s?\b/gmui, '<span style="color: rgb(61, 226, 75)">$&</span>')
					)
					.replace(
						/%example%/gmui,
						syntax.example
							.replace(/\t(prefixes|aliases|roles|description|usage|bots|executable in|trigger):/gmui, '<span style="color: rgb(244, 182, 66)">$&</span>')
							.replace(/\s".+"/gmui, '<span style="color: rgb(194, 66, 244)">$&</span>')
							.replace(/(discord )?command/gmui, '<span style="color: rgb(244, 182, 66)">$&</span>')
							.replace(/\{@.+\}/gmui, '<span style="color: rgb(224, 38, 38)">$&</span>')
							.replace(/\b(seen|from|in|reply with|append|set|add|remove)(?!:)\b/gmui, '<span style="color: rgb(69, 134, 239)">$&</span>')
					)
				
				document.getElementsByClassName(syntax.type)[0].innerHTML += card;
				loadingBar.set(loadingBar.value + 1);
				syntax.patterns = [];
				card = defaultCard;
				await sleep(1);
			}
			syntax.name = line
				.replace(/\tname:\s/gmui, '')
			syntax.id = syntax.name
				.toLowerCase()
				.replace(/\s/gmui, '_');
		} else if (line.match(/\tdescription:\s/gmui)) {
			syntax.description = line
				.replace(/\tdescription:(\s|\t)+/gmui, '')
				.replace(/\\t/gmui, '\t')
				.replace(/\\n/gmui, '\n');
		} else if (line.match(/\texample:\s/gmui)) {
			syntax.example = line
				.split(',\\t')
				.join('\n\t')
				.replace(/\texample:(\s|\t)+/gmui, '')
				.replace(/\\t/gmui, '\t')
				.replace(/\\"/gmui, '"')
		} else if (line.match(/\t+-\s/gmui)) {
			syntax.patterns.push(
				line
					.replace(/\t+-(\s|\t)+/gmui, '')
					.replace(/\\t/gmui, '\t')
					.replace(/\\n/gmui, '\n')
				);
		}
	}

	for (let element of document.getElementsByClassName('card-pattern')) {
		element.innerHTML = element.innerHTML.replace(/^\s+/gmui, '');
	}

	for (let element of document.getElementsByClassName('card-example')) {
		let lines = element.innerHTML.split('\n');
		lines[0] = lines[0].replace(/^\s+/gmui, '');
		element.innerHTML = lines.join('\n');
	}

	document.getElementById('doc_loading').style.display = 'none';
	document.getElementById('doc_content').style.display = 'block';
	if (match) {
		let element = document.getElementById(match[0].replace(
			/^\#/gm,
			''
		))
		await element.scrollIntoView();
	}

}

function search() {
	cards = document.getElementsByClassName('syntaxes')[0].getElementsByClassName('card')
	search_value = document.getElementsByClassName('search-input')[0].value.toLowerCase();
	for (i = 0; i < cards.length; i++) {
		txtValue = cards[i].getElementsByClassName('card-header-title')[0].textContent;
		pattern = cards[i].getElementsByClassName('card-pattern')[0];
		if (txtValue.toLowerCase().indexOf(search_value) > -1) {
			cards[i].style.display = '';
		} else {
			cards[i].style.display = 'none';
		}
	}
}

start()

document.addEventListener('DOMContentLoaded', () => {

	// Get all 'navbar-burger' elements
	const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
	// Check if there are any navbar burgers
	if ($navbarBurgers.length > 0) {
  
	  // Add a click event on each of them
	  $navbarBurgers.forEach( el => {
		el.addEventListener('click', () => {
  
		  // Get the target from the 'data-target' attribute
		  const target = el.dataset.target;
		  const $target = document.getElementById(target);
  
		  // Toggle the 'is-active' class on both the 'navbar-burger' and the 'navbar-menu'
		  el.classList.toggle('is-active');
		  $target.classList.toggle('is-active');
  
		});
	  });
	}
  
});

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		document.getElementById('topButton').style.display = 'block';
	} else {
		document.getElementById('topButton').style.display = 'none';
	}
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}