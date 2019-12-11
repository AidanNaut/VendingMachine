// home.js
$(document).ready(function() {
	$('#money').val('0.00');
	$('#itemNumber').val('');
	$('#changeOutput').val('');
	$('#messageOutput').val("Ready");

	loadItems();

	$('#addDollar').click(function() { 
		var bal = parseFloat($('#money').val());
		bal += 1.00;
		$('#money').val(bal.toFixed(2));
	});
	$('#addQuarter').click(function() { 
		var bal = parseFloat($('#money').val());
		bal += .25;
		$('#money').val(bal.toFixed(2));
	});
	$('#addDime').click(function() { 
		var bal = parseFloat($('#money').val());
		bal += .10;
		$('#money').val(bal.toFixed(2));
		
	});
	$('#addNickel').click(function() { 
		var bal = parseFloat($('#money').val());
		bal += .05;
		$('#money').val(bal.toFixed(2));
		
	});
	
	$('#purchaseButton').click(purchaseValidation);

	$('#change').click(returnChange);

});	

function loadItems() {

	var buttons = $('#itemButtons');

	$.ajax({
		type: "GET",
		url: "http://tsg-vending.herokuapp.com/items",
		success: function (data, status) {
			$.each(data, function (index, item) {
				var id = item.id;
				var name = item.name;
				var price = item.price;
				var quan = item.quantity;

				var card =  '<div class="container-fluid float-left cardSettings" onclick="setItemID(' + id + ')">';
				 	card += '<div class="card noselect" id="item' + id + '">';
					card += '<div class="card-body">';
					card +=	'<h5 class="card-title">'+ name +'</h5>';
					card +=	'<span>Price: </span><p class="card-text" id="itemPrice' + id + '">'+ price + '</p>';
					card +=	'<span>Quantity: </span><p class="card-text" id="itemQuantity' + id + '">'+ quan +'</p>';
					card += '</div>';
				    card += '</div>';
					card += '</div>';
				buttons.append(card);
			});
		},
		error: function() {

		}
	});
}

function setItemID(itemID) {
	$('#itemNumber').val(itemID);
}

function purchaseItem() {

	var id = $("#itemNumber").val();
	var amount = $("#money").val();

	if (amount == "") {
		amount = "0";
	}
	
	$.ajax({
		type: "POST",
		url: "http://tsg-vending.herokuapp.com/money/" + amount + "/item/" + id,
		success: function (Change, status) {
			$('#changeOutput').val(
				"Q: "  + Change.quarters +
				" D: " + Change.dimes +
				" N: " + Change.nickels +
				" P: " + Change.pennies
			);

			$('#money').val('0.00');
			$('#messageOutput').val("Thank YOU!!!");

			$('#itemButtons').html('');
			loadItems();
		},
		error: function(message) {
			$('#messageOutput').val(message.responseJSON.message);
		}
	});
	
	
}

function purchaseValidation() {
	$('#messageOutput').val("");
	var item = $('#itemNumber').val();

	if (item == "") {
		$('#messageOutput').val("Please make a selection first.");
	}
	else {
		purchaseItem();
	}
}

function returnChange() {
	$('#changeOutput').val('');
}
			