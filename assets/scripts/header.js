$( function(){

	$('#identity div.dropdown').on( 'click', '> a', function( e ){
		
		e.preventDefault();

		$('#identity div.dropdown').toggleClass('active');

	});

});