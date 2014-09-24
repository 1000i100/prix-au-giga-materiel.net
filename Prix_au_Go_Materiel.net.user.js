// ==UserScript==
// @name        Prix au Go Materiel.net
// @namespace   1twitif
// @include     http://www.materiel.net/*
// @version     1.1
// @grant       none
// ==/UserScript==

$(document).ready(function(){
	$('body').append('<style>.prixAuGiga{font-size:10px;font-weight:normal;color:#F30;} .Carac .prixAuGiga{color:#0A0;} </style>');
	updatePrixAuGiga();
});

setInterval(updatePrixAuGiga,1000);

function updatePrixAuGiga(){
	$('span[property="v:price"]').each(function(){
		try{
			var prix = priceFinder($(this));
			var giga = gigaFinder($(this));
			var prixAuGiga = prix/giga;
			if (!isFinite(prixAuGiga) || prixAuGiga<=0) throw {'prix':prixAuGiga, 'text':'prix invalide'};
			afficherPrixAuTera(capacityParentFinder($(this)), prixAuGiga);
			if($('#prod .caract').length) afficherPrixAuTera($(this).parent(), prixAuGiga);
		}catch(e){
			console.log(e, $(this));
		}
	});
}
function gigaFinder(jQNode){
	if($('#page',jQNode).length) throw 'Trop haut sans résultat !';
	var giga = 0;
	var node = $('.Carac:contains(" Go"), .caract:contains(" Go")',jQNode);
	if(node.length){
		node.text().replace(/([0-9]+) Go/,function(all, number){
			giga = parseInt(number);
		});
		// multi disque
		node.text().replace(/([0-9]+) x [0-9To ]+ [(]([0-9]+) Go[)]/,function(all, qty, number){
			giga = qty * number;
		});
	}
	if(!giga) return gigaFinder(jQNode.parent());
	else return giga;
}
function capacityParentFinder(jQNode){
	if($('#page',jQNode).length) throw 'Trop haut sans résultat !';
	var node = $('.Carac:contains(" Go"), .caract:contains(" Go")',jQNode);
	if(node.length){
		node = node.eq(0);
		if(node.text().match(/([0-9]+) Go/)) return node;
	}
	return capacityParentFinder(jQNode.parent());
}
function priceFinder(jQNode){
	var prix = 0;
	node = $('span[property="v:price"]',jQNode);
	if(node.length) jQNode = node;
	jQNode.text().replace(/([,0-9]+)[ ]?€/,function(all, number){
		prix = parseFloat(number.replace(',','.'));
	});
	if(!prix) throw 'Aucun prix trouvé';
	return prix;
}
function afficherPrixAuGiga(jQNode, prixAuGiga){
	if($('.prixAuGiga',jQNode).length) $('.prixAuGiga',jQNode).html(' <span class="prix">'+prixAuGiga+'</span>€/Go');
	else jQNode.append('<span class="prixAuGiga"> <span class="prix">'+prixAuGiga+'</span>€/Go</span>');
}
function afficherPrixAuTera(jQNode, prixAuGiga){
	prix = Math.round(prixAuGiga*100000)/100;
	if($('.prixAuGiga',jQNode).length) $('.prixAuGiga',jQNode).html(' <span class="prix">'+prix+'</span> € / To');
	else jQNode.append('<span class="prixAuGiga"> <span class="prix">'+prix+'</span> € / To</span>');
}
